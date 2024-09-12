import { promises as fs, createReadStream } from 'fs';
import encryptFileService from '../services/encryptFile';
import uploadService from '../services/uploadFile';
import {
  Encoding,
  Encryption,
  EncryptionKey,
  Hash,
  HashAlgorithm,
  Linkage,
  ResourceType,
  StorageType,
} from '@super-protocol/dto-js';
import Printer from '../printer';
import { isCommandSupported } from '../services/uplinkSetupHelper';
import { generateExternalId, preparePath, tryParse } from '../utils';
import readJsonFileService from '../services/readJsonFile';
import generateEncryptionService from '../services/generateEncryption';
import ordersCreateCommand from './ordersCreate';
import { Analytics, Crypto, OfferType, parseStorageCredentials } from '@super-protocol/sdk-js';
import { Config as BlockchainConfig } from '@super-protocol/sdk-js';
import doWithRetries from '../services/doWithRetries';
import getOrderResult, { OrderResultError } from '../services/getOrderResult';
import cancelOrder from '../services/cancelOrder';
import { AnalyticsEvent } from '@super-protocol/sdk-js';
import { AnalyticEvent, AnalyticsUtils } from '../services/analytics';
import crypto from 'crypto';

const MAX_ATTEMPT_COUNT = 12;
const RETRY_TIMEOUT = 5000;

export type FilesUploadParams = {
  analytics?: Analytics<AnalyticsEvent> | null;
  localPath: string;
  remotePath?: string;
  outputPath: string;
  metadataPath?: string;
  storageType: StorageType;
  bucket: string;
  prefix: string;
  writeAccessToken: string;
  readAccessToken: string;
  withEncryption: boolean;
  maximumConcurrent?: string;
  storage: string[];
  minRentMinutes: number;
  backendUrl: string;
  accessToken: string;
  actionAccountKey: string;
  blockchainConfig: BlockchainConfig;
  resultEncryption: EncryptionKey;
  pccsServiceApiUrl: string;
};

const createOrder = async (params: {
  analytics?: FilesUploadParams['analytics'];
  storage: FilesUploadParams['storage'];
  minRentMinutes: FilesUploadParams['minRentMinutes'];
  backendUrl: FilesUploadParams['backendUrl'];
  accessToken: FilesUploadParams['accessToken'];
  actionAccountKey: FilesUploadParams['actionAccountKey'];
  blockchainConfig: FilesUploadParams['blockchainConfig'];
  resultEncryption: FilesUploadParams['resultEncryption'];
  pccsServiceApiUrl: FilesUploadParams['pccsServiceApiUrl'];
}): Promise<string> => {
  const {
    analytics,
    storage,
    minRentMinutes,
    backendUrl,
    accessToken,
    actionAccountKey,
    blockchainConfig,
    resultEncryption,
    pccsServiceApiUrl,
  } = params;
  Printer.print('Storage order creating...');
  if (!Array.isArray(storage) || storage.length !== 2) {
    throw Error('Invalid storage param');
  }

  const [offerId, slotId] = storage;
  const orderId = await ordersCreateCommand({
    ...(analytics && { analytics }),
    accessToken,
    actionAccountKey,
    pccsServiceApiUrl,
    args: {
      inputOffers: [],
      outputOffer: '0',
    },
    backendUrl,
    blockchainConfig,
    minRentMinutes,
    offerId,
    options: { onlyOfferType: OfferType.Storage },
    resultEncryption,
    slotId,
  });

  if (!orderId) {
    throw Error('Storage order was not created');
  }

  return orderId;
};

interface ICredentials {
  token: string;
  bucket: string;
  prefix: string;
}
const getCredentials = async (params: {
  accessToken: string;
  analytics?: Analytics<AnalyticsEvent> | null;
  backendUrl: string;
  key: string;
  orderId: string;
}): Promise<{
  read: ICredentials;
  write: ICredentials;
}> => {
  const { orderId, key } = params;
  let attemptCount = 1;
  const orderReadyFn = async (): Promise<Encryption> => {
    Printer.print(`Getting encrypted data: attempt ${attemptCount++}/${MAX_ATTEMPT_COUNT}`);
    const orderResult = await getOrderResult({ orderId });

    if (orderResult?.encryptedResult) {
      return tryParse(orderResult.encryptedResult);
    }
    throw new OrderResultError(
      `Storage order ${orderId} has not been processed well. Encrypted result is invalid.`,
    );
  };

  try {
    const encryptedResult = await doWithRetries(orderReadyFn, MAX_ATTEMPT_COUNT, RETRY_TIMEOUT);
    await params.analytics?.trackEventCatched({
      eventName: AnalyticEvent.ORDER_RESULT_DOWNLOAD,
      eventProperties: await AnalyticsUtils.getOrderEventPropertiesByOrder({
        orderId: params.orderId,
        backendUrl: params.backendUrl,
        accessToken: params.accessToken,
      }),
    });
    Printer.print('Decrypting data...');
    const decryptedResult = await Crypto.decrypt({
      ...encryptedResult,
      key,
    });

    Printer.print('Extracting data...');
    const credentials = parseStorageCredentials<StorageType.StorJ>(decryptedResult);
    if (!credentials.uploadCredentials || !credentials.downloadCredentials) {
      throw new Error('Invalid credentials');
    }

    return {
      read: credentials.downloadCredentials,
      write: credentials.uploadCredentials,
    };
  } catch (err: unknown) {
    if (err instanceof OrderResultError) {
      await params.analytics?.trackErrorEventCatched(
        { eventName: AnalyticEvent.ORDER_RESULT_DOWNLOAD },
        err,
      );
    }
    Printer.error(`Failed to get storage credentials. Error: ${(err as Error).message}`);
    Printer.print(`Trying to cancel created order ${orderId}.`);
    await cancelOrder({ id: orderId });
    Printer.print(`Order ${orderId} was canceled.`);
    throw err;
  }
};

export default async (params: FilesUploadParams): Promise<void> => {
  Printer.print('File uploading command is starting...');
  if (!isCommandSupported()) {
    return;
  }

  let metadata: { linkage?: Linkage; hash?: Hash } = {};

  if (params.metadataPath) {
    metadata = await readJsonFileService({ path: preparePath(params.metadataPath) });
  }

  const localPath = preparePath(params.localPath).replace(/\/$/, '');

  const info = await fs.stat(localPath);
  if (info.isDirectory()) {
    throw new Error('Uploading a folder is not supported, please use a tar.gz archive');
  }

  let remotePath = `${params.remotePath || generateExternalId()}`;
  let fileEncryption: Encryption | undefined;

  const originFileStream = createReadStream(localPath);

  const hash = crypto.createHash('sha256');

  if (!metadata.hash?.hash) {
    originFileStream.on('data', (chunk) => {
      hash.update(chunk);
    });

    originFileStream.on('end', () => {
      const resultHash: Hash = {
        algo: HashAlgorithm.SHA256,
        encoding: Encoding.hex,
        hash: hash.digest(Encoding.hex),
      };
      metadata.hash = resultHash;
    });

    originFileStream.pause();
  }

  let encryptedFilePath: string | null = null;
  if (params.withEncryption) {
    remotePath += '.encrypted';
    const encryption = await generateEncryptionService();
    const encryptionResult = await encryptFileService(
      originFileStream,
      localPath,
      encryption,
      (total: number, current: number) => {
        Printer.progress('Encrypting file', total, current);
      },
    );

    encryptedFilePath = encryptionResult.encryptedFilePath;
    fileEncryption = encryptionResult.encryption;
  }

  let writeCredentials = {
    token: params.writeAccessToken,
    bucket: params.bucket,
    prefix: params.prefix,
  };
  let readCredentials = {
    token: params.readAccessToken,
    bucket: params.bucket,
    prefix: params.prefix,
  };

  let maximumConcurrent: number | undefined;
  if (params.maximumConcurrent) {
    maximumConcurrent = parseInt(params.maximumConcurrent, 10);
    if (maximumConcurrent < 4 || maximumConcurrent > 1000) {
      throw new Error('Value of maximumConcurrent must be between 4 and 1000');
    }
  }

  try {
    if (params.storage.length) {
      if (!params.resultEncryption.key) {
        throw Error('Invalid encryption key');
      }

      const orderId = await createOrder({
        storage: params.storage[0].split(','),
        minRentMinutes: params.minRentMinutes,
        backendUrl: params.backendUrl,
        accessToken: params.accessToken,
        actionAccountKey: params.actionAccountKey,
        blockchainConfig: params.blockchainConfig,
        resultEncryption: params.resultEncryption,
        pccsServiceApiUrl: params.pccsServiceApiUrl,
      });

      Printer.print('Getting storage credentials from created order...');
      const credentials = await getCredentials({
        accessToken: params.accessToken,
        analytics: params.analytics,
        backendUrl: params.backendUrl,
        key: params.resultEncryption.key,
        orderId,
      });
      readCredentials = credentials.read;
      writeCredentials = credentials.write;
    }

    const filePathToUpload = encryptedFilePath || params.localPath;
    const size = (await fs.stat(filePathToUpload)).size;
    const uploadFileStream = encryptedFilePath
      ? createReadStream(encryptedFilePath)
      : originFileStream;
    await uploadService(
      uploadFileStream,
      remotePath,
      {
        storageType: params.storageType,
        credentials: writeCredentials,
        maximumConcurrent: maximumConcurrent,
      },
      size,
      (total: number, current: number) => {
        Printer.progress('Uploading file', total, current);
      },
    );
    Printer.stopProgress();

    Printer.print('File was uploaded successfully');

    const result = {
      ...metadata,
      encryption: fileEncryption,
      resource: {
        type: ResourceType.StorageProvider,
        storageType: StorageType.StorJ,
        filepath: remotePath,
        credentials: readCredentials,
      },
    };
    const outputpath = preparePath(params.outputPath);
    await fs.writeFile(outputpath, JSON.stringify(result, null, 2));
    Printer.print(`Resource file was created in ${outputpath}`);

    await params.analytics?.trackSuccessEventCatched({
      eventName: AnalyticEvent.FILE_UPLOAD,
    });
  } catch (err: unknown) {
    await params.analytics?.trackErrorEventCatched(
      {
        eventName: AnalyticEvent.FILE_UPLOAD,
      },
      err,
    );
    Printer.print(`File was not uploaded. Error: ${(err as Error).message}`);
  } finally {
    if (encryptedFilePath) {
      Printer.print('Deleting temp files');
      await fs.unlink(encryptedFilePath);
    }
  }
};

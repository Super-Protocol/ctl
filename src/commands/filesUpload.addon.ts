import { promises as fs } from 'fs';
import {
  Encryption,
  EncryptionKey,
  ResourceType,
  RuntimeInputInfo,
  StorageType,
  StorjCredentials,
} from '@super-protocol/dto-js';
import Printer from '../printer';
import { isCommandSupported } from '../services/uplinkSetupHelper';
import { generateExternalId, preparePath, tryParse } from '../utils';
import readJsonFileService from '../services/readJsonFile';
import ordersCreateCommand from './ordersCreate';
import { Analytics, Crypto, OfferType, parseStorageCredentials } from '@super-protocol/sdk-js';
import { Config as BlockchainConfig } from '@super-protocol/sdk-js';
import doWithRetries from '../services/doWithRetries';
import getOrderResult, { OrderResultError } from '../services/getOrderResult';
import cancelOrder from '../services/cancelOrder';
import { AnalyticsEvent } from '@super-protocol/sdk-js';
import { AnalyticEvent, AnalyticsUtils } from '../services/analytics';
import path, { basename, dirname } from 'path';

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
  storage: string[];
  maximumConcurrent?: string;
  minRentMinutes: number;
  backendUrl: string;
  accessToken: string;
  actionAccountKey: string;
  blockchainConfig: BlockchainConfig;
  resultEncryption: EncryptionKey;
  pccsServiceApiUrl: string;
};

export type CreateOrderParams = {
  analytics?: FilesUploadParams['analytics'];
  storage: FilesUploadParams['storage'];
  minRentMinutes: FilesUploadParams['minRentMinutes'];
  backendUrl: FilesUploadParams['backendUrl'];
  accessToken: FilesUploadParams['accessToken'];
  actionAccountKey: FilesUploadParams['actionAccountKey'];
  blockchainConfig: FilesUploadParams['blockchainConfig'];
  resultEncryption: FilesUploadParams['resultEncryption'];
  pccsServiceApiUrl: FilesUploadParams['pccsServiceApiUrl'];
};

export const createOrder = async (params: CreateOrderParams): Promise<string> => {
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
  if (!Array.isArray(storage) || !storage.length) {
    throw Error('Invalid storage param');
  }

  const [offerId, slotId] = storage;
  const orderId = await ordersCreateCommand({
    ...(analytics && { analytics }),
    accessToken,
    actionAccountKey,
    pccsServiceApiUrl,
    args: {
      inputOffersIds: [],
      outputOfferId: '0',
      inputOffersVersions: [],
      outputOfferVersion: 0,
    },
    backendUrl,
    blockchainConfig,
    minRentMinutes,
    offerId,
    offerVersion: 0,
    options: { onlyOfferType: OfferType.Storage },
    resultEncryption,
    slotId,
  });

  if (!orderId) {
    throw Error('Storage order was not created');
  }

  return orderId;
};

export const getCredentials = async (params: {
  accessToken: string;
  analytics?: Analytics<AnalyticsEvent> | null;
  backendUrl: string;
  key: string;
  orderId: string;
}): Promise<{
  read: StorjCredentials;
  write: StorjCredentials;
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
  Printer.print('Uploading...');
  if (!isCommandSupported()) {
    return;
  }

  let metadata: Partial<Pick<RuntimeInputInfo, 'hardwareContext' | 'signatureKeyHash'>> = {};

  if (params.metadataPath) {
    metadata = await readJsonFileService({ path: preparePath(params.metadataPath) });
  }

  let localPath = preparePath(params.localPath).replace(/\/$/, '');
  let sourcePath: string | undefined;

  const info = await fs.stat(localPath);
  if (info.isFile()) {
    sourcePath = basename(localPath);
    localPath = dirname(localPath);
  }

  const remotePath = `${params.remotePath || generateExternalId()}`;

  let writeCredentials = {
    token: params.writeAccessToken,
    bucket: params.bucket,
    prefix: path.join(params.prefix, remotePath),
  };
  let readCredentials = {
    token: params.readAccessToken,
    bucket: params.bucket,
    prefix: path.join(params.prefix, remotePath),
  };

  let maximumConcurrent: number | undefined;
  if (params.maximumConcurrent) {
    maximumConcurrent = parseInt(params.maximumConcurrent, 10);
    if (maximumConcurrent < 1 || maximumConcurrent > 1000) {
      throw new Error('Value of maximumConcurrent must be between 1 and 1000');
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

    const { upload } = await import('@super-protocol/sp-files-addon');
    const uploadResult = await upload(
      localPath,
      {
        type: ResourceType.StorageProvider,
        storageType: StorageType.StorJ,
        credentials: writeCredentials,
        filepath: '',
      },
      {
        sourcePath,
        threads: maximumConcurrent,
        encryption: params.withEncryption,
        progressCallback: ({ current, total, key }) => {
          Printer.progress(key, total, current);
        },
      },
    );

    uploadResult.resource.storageType = StorageType.StorJ;
    uploadResult.resource.credentials = readCredentials;

    Printer.stopProgress();
    Printer.print('Uploaded successfully');

    const result = {
      ...metadata,
      ...uploadResult,
    };

    const outputPath = preparePath(params.outputPath);
    await fs.writeFile(outputPath, JSON.stringify(result, null, 2));
    Printer.print(`Resource file was created in ${outputPath}`);

    await params.analytics?.trackSuccessEventCatched({
      eventName: AnalyticEvent.FILE_UPLOAD,
    });
  } catch (err: unknown) {
    Printer.stopProgress();
    await params.analytics?.trackErrorEventCatched(
      {
        eventName: AnalyticEvent.FILE_UPLOAD,
      },
      err,
    );
    Printer.print(`\nUpload failed. Error: ${(err as Error).message}`);
  }
};

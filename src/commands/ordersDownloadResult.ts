import { promises as fs } from 'fs';
import downloadService from '../services/downloadFile';
import decryptFileService from '../services/decryptFile';
import Printer from '../printer';
import { isCommandSupported } from '../services/uplinkSetupHelper';
import path from 'path';
import getOrderResult from '../services/getOrderResult';
import {
  Encryption,
  Resource,
  ResourceType,
  StorageProviderResource,
  UrlResource,
  EncryptionKey,
  StorageType,
} from '@super-protocol/dto-js';
import {
  Crypto,
  Config as BlockchainConfig,
  OrderStatus,
  OrderResult,
  Analytics,
  RIGenerator,
  parseStorageCredentials,
} from '@super-protocol/sdk-js';
import downloadFileByUrl from '../services/downloadFileByUrl';
import initBlockchainConnector from '../services/initBlockchainConnector';
import getPublicFromPrivate from '../services/getPublicFromPrivate';
import { preparePath, tryParse } from '../utils';
import { Config } from '../config';
import checkOrderService from '../services/checkOrder';
import { AnalyticsEvent } from '@super-protocol/sdk-js';
import { AnalyticEvent, AnalyticsUtils } from '../services/analytics';
import { checkStorageConfig } from '../services/checkStorageConfig';
import { isStorageOrder } from '../services/isStorageOrder';

export type FilesDownloadParams = {
  accessToken: string;
  analytics?: Analytics<AnalyticsEvent> | null;
  backendUrl: string;
  blockchainConfig: BlockchainConfig;
  localPath?: string;
  orderId: string;
  resultDecryption: EncryptionKey;
  storageConfig?: Config['storage'];
};

export const localTxtPath = './result.txt';
export const localTarPath = './result.tar.gz';

export default async (params: FilesDownloadParams): Promise<void> => {
  // Validate decryption key
  getPublicFromPrivate(params.resultDecryption.key);
  const primaryPrivateKey = params.resultDecryption;

  Printer.print('Connecting to the blockchain');
  await initBlockchainConnector({
    blockchainConfig: params.blockchainConfig,
  });

  Printer.print('Checking if the order result is ready');
  await checkOrderService({
    id: params.orderId,
    statuses: [OrderStatus.Canceled, OrderStatus.Done, OrderStatus.Error, OrderStatus.Processing],
  });

  Printer.print('Fetching order result');
  let orderResult: OrderResult | undefined;
  try {
    orderResult = await getOrderResult({ orderId: params.orderId });
    await params.analytics?.trackEventCatched({
      eventName: AnalyticEvent.ORDER_RESULT_DOWNLOAD,
      eventProperties: await AnalyticsUtils.getOrderEventPropertiesByOrder({
        orderId: params.orderId,
        backendUrl: params.backendUrl,
        accessToken: params.accessToken,
      }),
    });
  } catch (err: unknown) {
    await params.analytics?.trackErrorEventCatched(
      {
        eventName: AnalyticEvent.ORDER_RESULT_DOWNLOAD,
      },
      err,
    );
  }
  const encrypted = orderResult?.encryptedResult;
  if (!encrypted?.length) {
    Printer.print('There is no result in the specified order');
    return;
  }

  Printer.print('Decrypting file');

  const encryptedResultObject: { resource: Encryption; encryption?: Encryption } =
    tryParse(encrypted);
  if (!encryptedResultObject) {
    await writeResult(
      localTxtPath,
      encrypted,
      'Could not parse the result, saving raw data to file',
    );
    return;
  }

  const publicKeyEncryption = Crypto.getPublicKey(primaryPrivateKey);
  const derivedPrivateKey = await RIGenerator.getDerivedPrivateKey(publicKeyEncryption);

  let decrypted: { resource?: Resource; encryption?: Encryption } = {};
  if (encryptedResultObject.resource && encryptedResultObject.encryption) {
    const decryptedResourceStr = await tryDecryptWithKeys(encryptedResultObject.resource, [
      primaryPrivateKey.key,
      derivedPrivateKey.key,
    ]);
    const decryptedEncryptionStr = await tryDecryptWithKeys(encryptedResultObject.encryption, [
      primaryPrivateKey.key,
      derivedPrivateKey.key,
    ]);

    if (!decryptedResourceStr || !decryptedEncryptionStr) {
      await writeResult(
        localTxtPath,
        JSON.stringify(encrypted),
        'Could not decrypt the result, make sure that the result encryption key in the config file is correct',
      );
      return;
    }
    decrypted.resource = tryParse(decryptedResourceStr);
    decrypted.encryption = tryParse(decryptedEncryptionStr);
    if (!decrypted.resource || !decrypted.encryption) {
      await writeResult(
        localTxtPath,
        JSON.stringify({ resource: decryptedResourceStr, encryption: decryptedEncryptionStr }),
        'The result was decrypted, but could not be parsed, saving raw data to file',
      );
      return;
    }
  } else {
    const stringResult = await tryDecryptWithKeys(encryptedResultObject as unknown as Encryption, [
      primaryPrivateKey.key,
      derivedPrivateKey.key,
    ]);
    if (!stringResult) {
      await writeResult(
        localTxtPath,
        JSON.stringify(encrypted),
        'Could not decrypt the result, make sure that the result encryption key in the config file is correct',
      );
      return;
    }
    try {
      const result = JSON.parse(stringResult);
      if (!result.resource) throw Error('Resource could not be found');
      decrypted = result;
    } catch (e) {
      try {
        if (await isStorageOrder(params.orderId)) {
          printAdviceToUseStorage(stringResult);
        }
      } catch {
        // write result to file anyway
      }

      await writeResult(localTxtPath, stringResult, 'Result message was decrypted, saving to file');
      return;
    }
  }

  Printer.print('Result was decrypted, downloading file');
  const resource: Resource = decrypted.resource!;
  let localPathEncrypted;

  switch (resource.type) {
    case ResourceType.Url:
      localPathEncrypted = getEncryptedResultPath(params.localPath);

      await downloadFileByUrl({
        url: (resource as UrlResource).url,
        savePath: localPathEncrypted,
        progressListener: (total, current) => {
          Printer.progress('Downloading file', total, current);
        },
      });
      break;

    case ResourceType.StorageProvider: {
      if (!isCommandSupported()) return;
      const storageProviderResource = resource as StorageProviderResource;
      if (storageProviderResource.storageType !== StorageType.StorJ) {
        throw new Error(
          `Unsupported storage type ${storageProviderResource.storageType}. Only StorJ is supported.`,
        );
      }

      const storageConfig = checkStorageConfig(params.storageConfig);

      storageProviderResource.credentials = {
        bucket: storageConfig.bucket,
        prefix: storageConfig.prefix,
        token: storageConfig.readAccessToken,
      };
      localPathEncrypted = getEncryptedResultPath(
        params.localPath,
        storageProviderResource.filepath,
      );
      await downloadService(
        storageProviderResource.filepath,
        localPathEncrypted,
        storageProviderResource,
        (total: number, current: number) => {
          Printer.progress('Downloading file', total, current);
        },
      );
      break;
    }
    default:
      throw Error(`Resource type ${resource.type} is not supported`);
  }

  if (!decrypted.encryption) {
    Printer.stopProgress();
    Printer.print(
      `File encryption data could not be found, encrypted result was saved to ${localPathEncrypted}`,
    );
    return;
  }

  const localPath = localPathEncrypted.replace(/\.encrypted$/, '');
  await decryptFileService(
    localPathEncrypted,
    localPath,
    decrypted.encryption,
    (total: number, current: number) => {
      Printer.progress('Decrypting file', total, current);
    },
  );

  Printer.stopProgress();
  Printer.print('Deleting temp files');
  await fs.unlink(localPathEncrypted);
  Printer.print(`Order result was saved to ${localPath}`);
};

async function tryDecryptWithKeys(
  encryption: Encryption,
  decryptionKeys: string[],
): Promise<string | undefined> {
  for (const decryptionKey of decryptionKeys) {
    try {
      encryption.key = decryptionKey;
      return await Crypto.decrypt(encryption);
    } catch (e) {
      continue;
    }
  }
}

async function writeResult(localPath: string, content: string, message: string): Promise<void> {
  Printer.print(message);
  await fs.writeFile(path.join(process.cwd(), localPath), content);
  Printer.print(`Order result metadata was saved to ${localPath}`);
}

function getEncryptedResultPath(customPath?: string, sourcePath?: string): string {
  if (customPath) {
    if (sourcePath) {
      const sourceExtension = /\..+$/.exec(sourcePath.replace(/\.encrypted$/, ''));
      const customExtension = /\..+$/.exec(customPath);
      if (sourceExtension && customExtension && sourceExtension[0] !== customExtension[0]) {
        Printer.print(
          `WARNING: provided file extension (${customExtension[0]}) doesn't match extension in order result (${sourceExtension[0]})`,
        );
      }
    }

    return `${preparePath(customPath).replace(/\/$/, '')}.encrypted`;
  }

  if (sourcePath) {
    const filename = path.basename(sourcePath);
    const preparedPath = preparePath(filename);
    if (!/\.encrypted$/.test(preparedPath)) {
      return `${preparedPath}.encrypted`;
    }
    return preparedPath;
  }

  return `${preparePath(localTarPath)}.encrypted`;
}

function printAdviceToUseStorage(stringResult: string): void {
  const credentials = parseStorageCredentials<StorageType.StorJ>(stringResult);

  Printer.print(
    'You can paste following storage credentials to config.json under "storage" section:',
  );
  Printer.print(
    JSON.stringify(
      {
        type: credentials.storageType,
        bucket: credentials.downloadCredentials.bucket,
        prefix: credentials.downloadCredentials.prefix,
        writeAccessToken: credentials.uploadCredentials.token,
        readAccessToken: credentials.downloadCredentials.token,
      },
      null,
      2,
    ),
  );
}

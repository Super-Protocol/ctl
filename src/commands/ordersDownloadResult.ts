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
} from '@super-protocol/dto-js';
import { Crypto, Config as BlockchainConfig, OrderStatus } from '@super-protocol/sdk-js';
import downloadFileByUrl from '../services/downloadFileByUrl';
import initBlockchainConnector from '../services/initBlockchainConnector';
import getPublicFromPrivate from '../services/getPublicFromPrivate';
import { preparePath, tryParse } from '../utils';
import checkOrderService from '../services/checkOrder';

export type FilesDownloadParams = {
  blockchainConfig: BlockchainConfig;
  orderId: string;
  localPath?: string;
  resultDecryptionKey: string;
};

export const localTxtPath = './result.txt';
export const localTarPath = './result.tar.gz';

export default async (params: FilesDownloadParams): Promise<void> => {
  // Validate decryption key
  getPublicFromPrivate(params.resultDecryptionKey);

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
  const orderResult = await getOrderResult({ orderId: params.orderId });
  const encrypted = orderResult.encryptedResult;
  if (!encrypted.length) {
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

  let decrypted: { resource?: Resource; encryption?: Encryption } = {};
  if (encryptedResultObject.resource && encryptedResultObject.encryption) {
    const decryptedResourceStr = await tryDecrypt(
      encryptedResultObject.resource,
      params.resultDecryptionKey,
    );
    const decryptedEncryptionStr = await tryDecrypt(
      encryptedResultObject.encryption,
      params.resultDecryptionKey,
    );
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
    const stringResult = await tryDecrypt(
      encryptedResultObject as unknown as Encryption,
      params.resultDecryptionKey,
    );
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

    case ResourceType.StorageProvider:
      if (!isCommandSupported()) return;
      const storageProviderResource = resource as StorageProviderResource;
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

async function tryDecrypt(
  encryption: Encryption,
  decryptionKey: string,
): Promise<string | undefined> {
  try {
    encryption.key = decryptionKey;
    return await Crypto.decrypt(encryption);
  } catch (e) {
    return;
  }
}

async function writeResult(localPath: string, content: string, message: string) {
  Printer.print(message);
  await fs.writeFile(path.join(process.cwd(), localPath), content);
  Printer.print(`Order result metadata was saved to ${localPath}`);
}

function getEncryptedResultPath(customPath?: string, sourcePath?: string) {
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
    sourcePath = preparePath(sourcePath);
    if (!/\.encrypted$/.test(sourcePath)) sourcePath += '.encrypted';
    return sourcePath;
  }

  return `${preparePath(localTarPath)}.encrypted`;
}

import { promises as fs, createReadStream } from 'fs';
import encryptFileService from '../services/encryptFile';
import uploadService from '../services/uploadFile';
import {
  Encoding,
  Encryption,
  HashAlgorithm,
  ResourceType,
  RuntimeInputInfo,
  StorageType,
} from '@super-protocol/dto-js';
import Printer from '../printer';
import { isCommandSupported } from '../services/uplinkSetupHelper';
import { generateExternalId, preparePath } from '../utils';
import readJsonFileService from '../services/readJsonFile';
import generateEncryptionService from '../services/generateEncryption';
import { FilesUploadParams } from './filesUpload.addon';
import { AnalyticEvent } from '../services/analytics';
import crypto, { BinaryLike } from 'crypto';

export default async (params: FilesUploadParams): Promise<void> => {
  Printer.print('File uploading command is starting...');
  if (!isCommandSupported()) {
    return;
  }

  let metadata: Partial<Pick<RuntimeInputInfo, 'hash' | 'hardwareContext' | 'signatureKeyHash'>> =
    {};

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
      hash.update(chunk as unknown as BinaryLike);
    });

    originFileStream.on('end', () => {
      metadata.hash = {
        algo: HashAlgorithm.SHA256,
        encoding: Encoding.hex,
        hash: hash.digest(Encoding.hex),
      };
    });

    originFileStream.pause();
  }

  let encryptedFilePath: string | null = null;
  if (params.withEncryption) {
    remotePath += '.encrypted';
    const encryptionConfig = generateEncryptionService();
    const encryptionResult = await encryptFileService(
      originFileStream,
      localPath,
      encryptionConfig,
      (total: number, current: number) => {
        Printer.progress('Encrypting file', total, current);
      },
    );

    encryptedFilePath = encryptionResult.encryptedFilePath;
    fileEncryption = encryptionResult.encryption;
  }

  const writeCredentials = {
    token: params.writeAccessToken,
    bucket: params.bucket,
    prefix: params.prefix,
  };
  const readCredentials = {
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

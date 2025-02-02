import { promises as fs } from 'fs';
import { EncryptionKey, ResourceType, RuntimeInputInfo, StorageType } from '@super-protocol/dto-js';
import Printer from '../printer';
import { isCommandSupported } from '../services/uplinkSetupHelper';
import { generateExternalId, preparePath } from '../utils';
import readJsonFileService from '../services/readJsonFile';
import { Analytics } from '@super-protocol/sdk-js';
import { Config as BlockchainConfig } from '@super-protocol/sdk-js';
import { AnalyticsEvent } from '@super-protocol/sdk-js';
import { AnalyticEvent } from '../services/analytics';
import { upload } from '@super-protocol/sp-files-addon';
import path, { basename, dirname } from 'path';

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

export default async (params: FilesUploadParams): Promise<void> => {
  Printer.print('Uploading...');
  if (!isCommandSupported()) {
    return;
  }

  const metadata: Partial<Pick<RuntimeInputInfo, 'hardwareContext' | 'signatureKeyHash'>> =
    params.metadataPath
      ? await readJsonFileService({ path: preparePath(params.metadataPath) })
      : {};

  let localPath = preparePath(params.localPath).replace(/\/$/, '');
  let sourcePath: string | undefined;

  const info = await fs.stat(localPath);
  if (info.isFile()) {
    sourcePath = basename(localPath);
    localPath = dirname(localPath);
  }

  const remotePath = `${params.remotePath || generateExternalId()}`;

  const writeCredentials = {
    token: params.writeAccessToken,
    bucket: params.bucket,
    prefix: path.join(params.prefix, remotePath),
  };

  try {
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
        encryption: params.withEncryption,
        progressCallback: ({ current, total, key }) => {
          Printer.progress(key, total, current);
        },
      },
    );

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

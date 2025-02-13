import { promises as fs } from 'fs';
import Printer from '../printer';
import { isCommandSupported } from '../services/uplinkSetupHelper';
import readResourceFileService from '../services/readResourceFile';
import { ResourceType, StorageProviderResource } from '@super-protocol/dto-js';
import { preparePath } from '../utils';

export type FilesDownloadParams = {
  resourcePath: string;
  localDirectory: string;
};

export default async (params: FilesDownloadParams): Promise<void> => {
  if (!isCommandSupported()) return;

  const resourceFile = await readResourceFileService({
    path: preparePath(params.resourcePath),
  });

  const resource = resourceFile.resource as StorageProviderResource;
  if (resource.type !== ResourceType.StorageProvider)
    throw Error(
      `Resource type ${resource.type} is not supported, use StorageProvider type for this command`,
    );

  const localPath = preparePath(params.localDirectory).replace(/\/$/, '');
  const exists = await fs.stat(localPath).catch(() => null);

  if (!exists) {
    await fs.mkdir(localPath, { recursive: true });
  } else if (!exists.isDirectory()) {
    throw new Error('localDirectory argument must be the path to a folder');
  }

  try {
    const { download } = await import('@super-protocol/sp-files-addon');
    await download(resource, localPath, {
      encryption: resourceFile.encryption,
      progressCallback: ({ key, current, total }) => {
        Printer.progress(key, total, current);
      },
    });
    Printer.print('File was downloaded successfully');
  } finally {
    Printer.stopProgress();
  }
};

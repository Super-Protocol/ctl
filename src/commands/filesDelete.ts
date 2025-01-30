import { isCommandSupported } from '../services/uplinkSetupHelper';
import readResourceFileService from '../services/readResourceFile';
import { ResourceType, StorageProviderResource, StorjCredentials } from '@super-protocol/dto-js';
import Printer from '../printer';
import { preparePath } from '../utils';
import { deleteResource } from '@super-protocol/sp-files-addon';

export type FilesDeleteParams = {
  resourcePath: string;
  writeAccessToken: string;
};

export default async (params: FilesDeleteParams): Promise<void> => {
  if (!isCommandSupported()) return;

  const resourceFile = await readResourceFileService({
    path: preparePath(params.resourcePath),
  });

  const resource = resourceFile.resource as StorageProviderResource<StorjCredentials>;
  if (resource.type !== ResourceType.StorageProvider)
    throw Error(
      `Resource type ${resource.type} is not supported, use StorageProvider type for this command`,
    );

  resource.credentials.token = params.writeAccessToken;
  Printer.print('Deleting file');
  await deleteResource(resource);
  Printer.print('File was deleted');
};

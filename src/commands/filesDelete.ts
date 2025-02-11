import deleteFileService from '../services/deleteFile';
import { isCommandSupported } from '../services/uplinkSetupHelper';
import Printer from '../printer';
import { FilesDeleteParams, prepareResource } from './filesDelete.addon';

export default async (params: FilesDeleteParams): Promise<void> => {
  if (!isCommandSupported()) return;

  const resource = await prepareResource(params);
  Printer.print('Deleting file');
  await deleteFileService({
    storageAccess: resource,
    remotePath: resource.filepath,
  });
  Printer.print('File was deleted');
};

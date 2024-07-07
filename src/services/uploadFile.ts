import { getStorageProvider, StorageAccess } from '@super-protocol/sdk-js';
import * as fs from 'fs';

export default async (
  readStream: fs.ReadStream,
  remotePath: string,
  storageAccess: StorageAccess,
  size: number,
  progressListener?: (total: number, current: number) => void,
): Promise<void> => {
  const storageProvider = getStorageProvider(storageAccess);
  await storageProvider.uploadFile(readStream, remotePath, size, progressListener);
};

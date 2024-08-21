import { getStorageProvider, StorageAccess } from '@super-protocol/sdk-js';
import { Readable } from 'stream';

export default async (
  readStream: Readable,
  remotePath: string,
  storageAccess: StorageAccess,
  size: number,
  progressListener?: (total: number, current: number) => void,
): Promise<void> => {
  const storageProvider = getStorageProvider(storageAccess);
  await storageProvider.uploadFile(readStream, remotePath, size, progressListener);
};

import { getStorageProvider, StorageAccess } from "@super-protocol/sp-sdk-js";

export default async (
    localPath: string,
    remotePath: string,
    storageAccess: StorageAccess,
    progressListener?: (total: number, current: number) => void
) => {
    const storageProvider = getStorageProvider(storageAccess);
    await storageProvider.uploadFile(localPath, remotePath + '', progressListener);
};

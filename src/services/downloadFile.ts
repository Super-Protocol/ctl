import { getStorageProvider, StorageAccess } from "@super-protocol/sp-sdk-js";

export default async (
    remotePath: string,
    localPath: string,
    storageAccess: StorageAccess,
    progressListener?: (total: number, current: number) => void
) => {
    const storageProvider = getStorageProvider(storageAccess);
    await storageProvider.downloadFile(remotePath, localPath, progressListener);
};

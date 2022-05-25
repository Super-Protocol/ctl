import { getStorageProvider, StorageAccess } from "@super-protocol/sp-sdk-js";
import { troubleshootHelper, loadDependencies } from "./uplinkSetupHelper";
import { StorageType } from "@super-protocol/sp-dto-js";

export default async (
    localPath: string,
    remotePath: string,
    storageAccess: StorageAccess,
    progressListener?: (total: number, current: number) => void
) => {
    if (storageAccess.storageType === StorageType.StorJ) loadDependencies();
    const storageProvider = getStorageProvider(storageAccess);
    try {
        await storageProvider.uploadFile(localPath, remotePath, progressListener);
    } catch (e) {
        if (storageAccess.storageType === StorageType.StorJ) await troubleshootHelper(e as Error);
        else throw e;
    }
};

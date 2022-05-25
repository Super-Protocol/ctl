import { getStorageProvider, StorageAccess } from "@super-protocol/sp-sdk-js";
import { troubleshootHelper, loadDependencies } from "./uplinkSetupHelper";
import { StorageType } from "@super-protocol/sp-dto-js";

export default async (
    remotePath: string,
    localPath: string,
    storageAccess: StorageAccess,
    progressListener?: (total: number, current: number) => void
) => {
    if (storageAccess.storageType === StorageType.StorJ) loadDependencies();
    const storageProvider = getStorageProvider(storageAccess);
    try {
        await storageProvider.downloadFile(remotePath, localPath, progressListener);
    } catch (e) {
        if (storageAccess.storageType === StorageType.StorJ) await troubleshootHelper(e as Error);
        else throw e;
    }
};

import { getStorageProvider, StorageAccess } from "@super-protocol/sp-sdk-js";
import { troubleshootHelper, loadDependencies } from "./uplinkSetupHelper";
import { StorageType } from "@super-protocol/sp-dto-js";

export type DeleteFileParams = {
    remotePath: string;
    storageAccess: StorageAccess;
};

export default async (params: DeleteFileParams) => {
    if (params.storageAccess.storageType === StorageType.StorJ) loadDependencies();
    const storageProvider = getStorageProvider(params.storageAccess);
    try {
        await storageProvider.deleteFile(params.remotePath);
    } catch (e) {
        if (params.storageAccess.storageType === StorageType.StorJ) await troubleshootHelper(e as Error);
        else throw e;
    }
};

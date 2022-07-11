import { getStorageProvider, StorageAccess } from "@super-protocol/sp-sdk-js";
import { StorageType } from "@super-protocol/sp-dto-js";

export type DeleteFileParams = {
    remotePath: string;
    storageAccess: StorageAccess;
};

export default async (params: DeleteFileParams) => {
    const storageProvider = getStorageProvider(params.storageAccess);
    await storageProvider.deleteFile(params.remotePath);
};

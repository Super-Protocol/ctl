import { getStorageProvider, StorageAccess } from "@super-protocol/sdk-js";
import { StorageType } from "@super-protocol/dto-js";

export type DeleteFileParams = {
    remotePath: string;
    storageAccess: StorageAccess;
};

export default async (params: DeleteFileParams) => {
    const storageProvider = getStorageProvider(params.storageAccess);
    await storageProvider.deleteObject(params.remotePath);
};

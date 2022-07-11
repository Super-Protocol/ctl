import { getStorageProvider, StorageAccess } from "@super-protocol/sp-sdk-js";
import * as fs from "fs";

export default async (
    localPath: string,
    remotePath: string,
    storageAccess: StorageAccess,
    progressListener?: (total: number, current: number) => void
) => {
    const storageProvider = getStorageProvider(storageAccess);
    await storageProvider.uploadFile(
        fs.createReadStream(localPath),
        remotePath,
        (
            await fs.promises.stat(localPath)
        ).size,
        progressListener
    );
};

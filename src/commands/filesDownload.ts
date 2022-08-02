import { promises as fs } from "fs";
import downloadService from "../services/downloadFile";
import decryptFileService from "../services/decryptFile";
import Printer from "../printer";
import { isCommandSupported } from "../services/uplinkSetupHelper";
import path from "path";
import readResourceFileService from "../services/readResourceFile";
import { ResourceType, StorageProviderResource } from "@super-protocol/dto-js";

export type FilesDownloadParams = {
    resourcePath: string;
    localPath: string;
};

export default async (params: FilesDownloadParams): Promise<void> => {
    if (!isCommandSupported()) return;

    const resourceFile = await readResourceFileService({
        path: path.join(process.cwd(), params.resourcePath),
    });

    const resource = resourceFile.resource as StorageProviderResource;
    if (resource.type !== ResourceType.StorageProvider)
        throw Error(`Resource type ${resource.type} not supported, supported only StorageProvider type`);

    let localPath = params.localPath.replace(/\/$/, "");
    if (resourceFile.encryption) localPath += ".encrypted";

    const storageAccess = {
        storageType: resource.storageType,
        credentials: resource.credentials,
    };

    await downloadService(resource.filepath, localPath, storageAccess, (total: number, current: number) => {
        Printer.progress("Downloading", total, current);
    });

    if (resourceFile.encryption) {
        await decryptFileService(localPath, resourceFile.encryption, (total: number, current: number) => {
            Printer.progress("Decrypting", total, current);
        });

        Printer.stopProgress();
        Printer.print("Deleting temp files..");
        await fs.unlink(localPath);
    } else {
        Printer.stopProgress();
    }

    Printer.print("Done");
};

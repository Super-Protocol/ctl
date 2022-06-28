import deleteFileService from "../services/deleteFile";
import { isCommandSupported } from "../services/uplinkSetupHelper";
import path from "path";
import readResourceFileService from "../services/readResourceFile";
import { ResourceType, StorageProviderResource } from "@super-protocol/sp-dto-js";
import Printer from "../printer";

export type FilesDeleteParams = {
    resourcePath: string;
};

export default async (params: FilesDeleteParams): Promise<void> => {
    if (!isCommandSupported()) return;

    const resourceFile = await readResourceFileService({
        path: path.join(process.cwd(), params.resourcePath),
    });

    const resource = resourceFile.resource as StorageProviderResource;
    if (resource.type !== ResourceType.StorageProvider)
        throw Error(`Resource type ${resource.type} not supported, supported only StorageProvider type`);

    Printer.print("Deleting file...");
    await deleteFileService({
        storageAccess: resource,
        remotePath: resource.filepath,
    });
    Printer.print("File has been deleted successfully...");
};

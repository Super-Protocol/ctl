import deleteFileService from "../services/deleteFile";
import { isCommandSupported } from "../services/uplinkSetupHelper";
import readResourceFileService from "../services/readResourceFile";
import { ResourceType, StorageProviderResource } from "@super-protocol/dto-js";
import Printer from "../printer";
import { preparePath } from "../utils";

export type FilesDeleteParams = {
    resourcePath: string;
    writeAccessToken: string;
};

export default async (params: FilesDeleteParams): Promise<void> => {
    if (!isCommandSupported()) return;

    const resourceFile = await readResourceFileService({
        path: preparePath(params.resourcePath),
    });

    const resource = resourceFile.resource as StorageProviderResource;
    if (resource.type !== ResourceType.StorageProvider)
        throw Error(`Resource type ${resource.type} is not supported, use StorageProvider type for this command`);

    resource.credentials.token = params.writeAccessToken;
    Printer.print("Deleting file");
    await deleteFileService({
        storageAccess: resource,
        remotePath: resource.filepath,
    });
    Printer.print("File was deleted");
};

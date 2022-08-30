import { promises as fs } from "fs";
import encryptFileService from "../services/encryptFile";
import uploadService from "../services/uploadFile";
import { ResourceType, StorageType } from "@super-protocol/dto-js";
import Printer from "../printer";
import { isCommandSupported } from "../services/uplinkSetupHelper";
import path from "path";
import { generateExternalId } from "../utils";
import readJsonFileService from "../services/readJsonFile";
import generateEncryptionService from "../services/generateEncryption";

export type FilesUploadParams = {
    localPath: string;
    outputPath: string;
    metadataPath?: string;
    storageType: StorageType;
    writeCredentials: any;
    readCredentials: any;
};

export default async (params: FilesUploadParams) => {
    if (!isCommandSupported()) return;

    let metadata = {};
    if (params.metadataPath) {
        metadata = await readJsonFileService({ path: path.join(process.cwd(), params.metadataPath) });
    }

    const encryption = await generateEncryptionService();

    let localPath = params.localPath.replace(/\/$/, "");

    let info = await fs.stat(localPath);
    if (info.isDirectory()) {
        throw new Error("Folder uploading is not supported, pack it to .tar.gz archive");
    }

    let encryptedFileData = await encryptFileService(localPath, encryption, (total: number, current: number) => {
        Printer.progress("Encrypting", total, current);
    });
    const remotePath = `${generateExternalId()}.encrypted`;

    try {
        await uploadService(
            encryptedFileData.encryptedFilePath,
            remotePath,
            {
                storageType: params.storageType,
                credentials: params.writeCredentials,
            },
            (total: number, current: number) => {
                Printer.progress("Uploading", total, current);
            }
        );
        Printer.stopProgress();

        const result = {
            ...metadata,
            encryption: encryptedFileData.encryption,
            resource: {
                type: ResourceType.StorageProvider,
                storageType: StorageType.StorJ,
                filepath: remotePath,
                credentials: params.writeCredentials,
            },
        };
        const outputpath = path.join(process.cwd(), params.outputPath);
        await fs.writeFile(outputpath, JSON.stringify(result, null, 2));
        Printer.print(`Resource was written into ${outputpath}\n`);
    } finally {
        Printer.print("Deleting temp files..");
        await fs.unlink(encryptedFileData.encryptedFilePath);
        Printer.print("Done");
    }
};

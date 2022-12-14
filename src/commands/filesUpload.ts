import { promises as fs } from "fs";
import encryptFileService from "../services/encryptFile";
import uploadService from "../services/uploadFile";
import { Encryption, ResourceType, StorageType } from "@super-protocol/dto-js";
import Printer from "../printer";
import { isCommandSupported } from "../services/uplinkSetupHelper";
import { generateExternalId, preparePath } from "../utils";
import readJsonFileService from "../services/readJsonFile";
import generateEncryptionService from "../services/generateEncryption";

export type FilesUploadParams = {
    localPath: string;
    remotePath?: string;
    outputPath: string;
    metadataPath?: string;
    storageType: StorageType;
    bucket: string;
    writeAccessToken: string;
    readAccessToken: string;
    withEncryption: boolean;
};

export default async (params: FilesUploadParams) => {
    if (!isCommandSupported()) return;

    let metadata = {};
    if (params.metadataPath) {
        metadata = await readJsonFileService({ path: preparePath(params.metadataPath) });
    }

    let localPath = preparePath(params.localPath).replace(/\/$/, "");

    let info = await fs.stat(localPath);
    if (info.isDirectory()) {
        throw new Error("Uploading a folder is not supported, please use a tar.gz archive");
    }

    let remotePath = `${params.remotePath || generateExternalId()}`;
    let fileEncryption: Encryption | undefined;
    if (params.withEncryption) {
        remotePath += ".encrypted";
        const encryption = await generateEncryptionService();
        const encryptionResult = await encryptFileService(localPath, encryption, (total: number, current: number) => {
            Printer.progress("Encrypting file", total, current);
        });
        localPath = encryptionResult.encryptedFilePath;
        fileEncryption = encryptionResult.encryption;
    }

    const writeCredentials = {
        token: params.writeAccessToken,
        storageId: params.bucket,
    };
    const readCredentials = {
        token: params.readAccessToken,
        storageId: params.bucket,
    };

    try {
        await uploadService(
            localPath,
            remotePath,
            {
                storageType: params.storageType,
                credentials: writeCredentials,
            },
            (total: number, current: number) => {
                Printer.progress("Uploading file", total, current);
            }
        );
        Printer.stopProgress();

        Printer.print("File was uploaded successfully");

        const result = {
            ...metadata,
            encryption: fileEncryption,
            resource: {
                type: ResourceType.StorageProvider,
                storageType: StorageType.StorJ,
                filepath: remotePath,
                credentials: readCredentials,
            },
        };
        const outputpath = preparePath(params.outputPath);
        await fs.writeFile(outputpath, JSON.stringify(result, null, 2));
        Printer.print(`Resource file was created in ${outputpath}`);
    } finally {
        if (params.withEncryption) {
            Printer.print("Deleting temp files");
            await fs.unlink(localPath);
        }
    }
};

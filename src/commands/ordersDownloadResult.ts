import { promises as fs } from "fs";
import downloadService from "../services/downloadFile";
import decryptFileService from "../services/decryptFile";
import Printer from "../printer";
import { isCommandSupported } from "../services/uplinkSetupHelper";
import path from "path";
import getOrderResult from "../services/getOrderResult";
import { Encryption, Resource, ResourceType, StorageProviderResource, UrlResource } from "@super-protocol/dto-js";
import { Crypto, Config as BlockchainConfig } from "@super-protocol/sdk-js";
import downloadFileByUrl from "../services/downloadFileByUrl";
import initBlockchainConnector from "../services/initBlockchainConnector";

export type FilesDownloadParams = {
    blockchainConfig: BlockchainConfig;
    orderId: string;
    localPath: string;
    resultDecryptionKey: string;
};

export const localTxtPath = "./result.txt";

export default async (params: FilesDownloadParams): Promise<void> => {
    Printer.print("Connecting to the blockchain");
    await initBlockchainConnector({
        blockchainConfig: params.blockchainConfig,
    });

    Printer.print("Fetching order result");
    const { encryptedError, encryptedResult } = await getOrderResult({ orderId: params.orderId });
    const encrypted = encryptedResult || encryptedError;
    Printer.print("Decrypting file");

    let encryptedResultObject: { resource: Encryption; encryption?: Encryption } = await tryParse(encrypted);
    if (!encryptedResultObject) {
        await writeResult(localTxtPath, encrypted, "Could not parse the result, saving raw data to file");
        return;
    }

    let decrypted: { resource?: Resource; encryption?: Encryption } = {};
    if (encryptedResultObject.resource && encryptedResultObject.encryption) {
        const decryptedResourceStr = await tryDecrypt(encryptedResultObject.resource, params.resultDecryptionKey);
        const decryptedEncryptionStr = await tryDecrypt(encryptedResultObject.encryption, params.resultDecryptionKey);
        if (!decryptedResourceStr || !decryptedEncryptionStr) {
            await writeResult(
                localTxtPath,
                JSON.stringify(encrypted),
                "Could not decrypt the result, saving raw data to file"
            );
            return;
        }
        decrypted.resource = await tryParse(decryptedResourceStr);
        decrypted.encryption = await tryParse(decryptedEncryptionStr);
        if (!decrypted.resource || !decrypted.encryption) {
            await writeResult(
                localTxtPath,
                JSON.stringify({ resource: decryptedResourceStr, encryption: decryptedEncryptionStr }),
                "The result was decrypted, but could not be parsed, saving raw data to file"
            );
            return;
        }
    } else {
        const stringResult = await tryDecrypt(
            encryptedResultObject as unknown as Encryption,
            params.resultDecryptionKey
        );
        if (!stringResult) {
            await writeResult(
                localTxtPath,
                JSON.stringify(encrypted),
                "Could not decrypt the result, saving raw data to file"
            );
            return;
        }
        try {
            const result = JSON.parse(stringResult);
            if (!result.resource) throw Error("Resource could not be found");
            decrypted = result;
        } catch (e) {
            await writeResult(localTxtPath, stringResult, "Result message was decrypted, saving to file");
            return;
        }
    }

    Printer.print("Result was decrypted, downloading file");
    const resource: Resource = decrypted.resource!;
    const localPath = `${params.localPath.replace(/\/$/, "")}.encrypted`;

    switch (resource.type) {
        case ResourceType.Url:
            await downloadFileByUrl({
                url: (resource as UrlResource).url,
                savePath: path.join(process.cwd(), localPath),
                progressListener: (total, current) => {
                    Printer.progress("Downloading file", total, current);
                },
            });
            break;

        case ResourceType.StorageProvider:
            if (!isCommandSupported()) return;

            const storageProviderResource = resource as StorageProviderResource;
            await downloadService(
                storageProviderResource.filepath,
                localPath,
                storageProviderResource,
                (total: number, current: number) => {
                    Printer.progress("Downloading file", total, current);
                }
            );
            break;
        default:
            throw Error(`Resource type ${resource.type} is not supported`);
    }

    if (!decrypted.encryption) {
        Printer.stopProgress();
        Printer.print(`File encryption data could not be found, encrypted result was saved to ${localPath}`);
        return;
    }

    await decryptFileService(localPath, decrypted.encryption, (total: number, current: number) => {
        Printer.progress("Decrypting file", total, current);
    });

    Printer.stopProgress();
    Printer.print("Deleting temp files");
    await fs.unlink(localPath);
    Printer.print("Order result was downloaded successfully");
};

async function tryDecrypt(encryption: Encryption, decryptionKey: string): Promise<string | undefined> {
    try {
        encryption.key = decryptionKey;
        return await Crypto.decrypt(encryption);
    } catch (e) {
        return;
    }
}

async function tryParse(text: string): Promise<any> {
    try {
        return JSON.parse(text);
    } catch (e) {
        return;
    }
}

async function writeResult(localPath: string, content: string, message: string) {
    Printer.print(message);
    await fs.writeFile(path.join(process.cwd(), localPath), content);
    Printer.print(`Order result was saved to ${localPath}`);
}

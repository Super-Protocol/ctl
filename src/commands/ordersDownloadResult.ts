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
    Printer.print("Connecting to blockchain...");
    await initBlockchainConnector({
        blockchainConfig: params.blockchainConfig,
    });

    Printer.print("Connected successfully, fetching order result from blockchain...");
    const { encryptedError, encryptedResult } = await getOrderResult({ orderId: params.orderId });
    const encrypted = encryptedResult || encryptedError;
    Printer.print("Order result found, decrypting...");

    let encryptedResultObject: { resource: Encryption; encryption?: Encryption } = await tryParse(encrypted);
    if (!encryptedResultObject) {
        await writeResult(localTxtPath, encrypted, "Unable to parse order result, saving raw result to file...");
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
                "Unable to decrypt order result, saving raw result to file..."
            );
            return;
        }
        decrypted.resource = await tryParse(decryptedResourceStr);
        decrypted.encryption = await tryParse(decryptedEncryptionStr);
        if (!decrypted.resource || !decrypted.encryption) {
            await writeResult(
                localTxtPath,
                JSON.stringify({ resource: decryptedResourceStr, encryption: decryptedEncryptionStr }),
                "Order result decrypted, but was unable to parse, saving raw result to file..."
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
                "Unable to decrypt order result, saving raw result to file..."
            );
            return;
        }
        try {
            const result = JSON.parse(stringResult);
            if (!result.resource) throw Error("Resource not found");
            decrypted = result;
        } catch (e) {
            await writeResult(localTxtPath, stringResult, "Result message decrypted, saving to file...");
            return;
        }
    }

    Printer.print("Result decrypted, downloading result file...");
    const resource: Resource = decrypted.resource!;
    const localPath = `${params.localPath.replace(/\/$/, "")}.encrypted`;

    switch (resource.type) {
        case ResourceType.Url:
            await downloadFileByUrl({
                url: (resource as UrlResource).url,
                savePath: path.join(process.cwd(), localPath),
                progressListener: (total, current) => {
                    Printer.progress("Downloading", total, current);
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
                    Printer.progress("Downloading", total, current);
                }
            );
            break;
        default:
            throw Error(`Resource type ${resource.type} not supported`);
    }

    if (!decrypted.encryption) {
        Printer.stopProgress();
        Printer.print(`File encryption not found, encrypted result saved to ${localPath}`);
        return;
    }

    await decryptFileService(localPath, decrypted.encryption, (total: number, current: number) => {
        Printer.progress("Decrypting", total, current);
    });

    Printer.stopProgress();
    Printer.print("Deleting temp files..");
    await fs.unlink(localPath);
    Printer.print("Done");
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
    Printer.print(`Result successfully saved to ${localPath}`);
}

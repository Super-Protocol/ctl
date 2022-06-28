import { promises as fs } from "fs";
import downloadService from "../services/downloadFile";
import decryptFileService from "../services/decryptFile";
import Printer from "../printer";
import { isCommandSupported } from "../services/uplinkSetupHelper";
import path from "path";
import getOrderResult from "../services/getOrderResult";
import { Encryption, Resource, ResourceType, StorageProviderResource, UrlResource } from "@super-protocol/sp-dto-js";
import { Crypto } from "@super-protocol/sp-sdk-js";
import downloadFileByUrl from "../services/downloadFileByUrl";
import initBlockchainConnector from "../services/initBlockchainConnector";
import { Config as BlockchainConfig } from "@super-protocol/sp-sdk-js/build/BlockchainConnector";

export type FilesDownloadParams = {
    blockchainConfig: BlockchainConfig;
    orderId: string;
    localPath: string;
    resultDecryptionKey: string;
};

export default async (params: FilesDownloadParams): Promise<void> => {
    Printer.print("Connecting to blockchain...");
    await initBlockchainConnector({
        blockchainConfig: params.blockchainConfig,
    });

    Printer.print("Connected successfully, fetching order result from blockchain...");
    const { encryptedError, encryptedResult } = await getOrderResult({ orderId: params.orderId });
    const encrypted = encryptedResult || encryptedError;
    Printer.print("Order result found, decrypting...");

    let encryptedResultObject: { resource: Encryption; encryption?: Encryption };
    try {
        encryptedResultObject = JSON.parse(encrypted);
    } catch (e) {
        Printer.print("Unable to parse order result, saving raw result to file...");
        await fs.writeFile(path.join(process.cwd(), params.localPath), encrypted);
        Printer.print(`Raw result extracted and saved to ${params.localPath}`);
        return;
    }

    let decrypted: { resource?: Resource; encryption?: Encryption } = {};
    if (encryptedResultObject.resource) {
        encryptedResultObject.resource.key = params.resultDecryptionKey;
        decrypted.resource = JSON.parse(await Crypto.decrypt(encryptedResultObject.resource));

        if (encryptedResultObject.encryption) {
            encryptedResultObject.encryption.key = params.resultDecryptionKey;
            decrypted.encryption = JSON.parse(await Crypto.decrypt(encryptedResultObject.encryption));
        }
    } else {
        const stringEncryptedResult: Encryption = encryptedResultObject as unknown as Encryption;
        stringEncryptedResult.key = params.resultDecryptionKey;
        const stringResult = await Crypto.decrypt(stringEncryptedResult);

        try {
            const result = JSON.parse(stringResult);
            if (!result.resource) throw Error("Resource not found");
            decrypted = result;
        } catch (e) {
            Printer.print("Result message decrypted, saving to file...");
            await fs.writeFile(path.join(process.cwd(), params.localPath), stringResult);
            Printer.print(`Result message extracted successfully and saved to ${params.localPath}`);
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

            const storageProviderResource: StorageProviderResource = resource as StorageProviderResource;
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

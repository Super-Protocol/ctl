import { promises as fs } from "fs";
import encryptFile from "../services/encryptFile";
import packFolder from "../services/packFolder";
import upload from "../services/uploadFile";
import { Encryption } from "@super-protocol/sp-dto-js";
import { StorageAccess } from "@super-protocol/sp-sdk-js";
import Printer from "../printer";
import download from "../services/downloadFile";
import uplinkSetupHelper from "../services/uplinkSetupHelper";

export default async (
    localPath: string,
    remotePath: string,
    encryption: Encryption,
    storageAccess: StorageAccess
): Promise<Encryption> => {
    localPath = localPath.replace(/\/$/, "");
    let packedFilePath: string | undefined;

    let info = await fs.stat(localPath);
    if (info.isDirectory()) {
        let output = `${localPath}`;
        localPath = await packFolder(localPath, output, (total: number, current: number) => {
            Printer.progress("Packing", total, current);
        });

        packedFilePath = localPath;
    }

    let encryptedFileData = await encryptFile(
        localPath,
        encryption,
        (total: number, current: number) => {
            Printer.progress("Encrypting", total, current);
        }
    );
    remotePath = `${remotePath}.encrypted`;

    try {
        await upload(encryptedFileData.encryptedFilePath, remotePath, storageAccess, (total: number, current: number) => {
            Printer.progress("Uploading", total, current);
        });
        Printer.stopProgress();
    } catch (e) {
        await uplinkSetupHelper();
        throw e;
    } finally {
        Printer.print("Deleting temp files..");
        if (typeof packedFilePath != "undefined") await fs.unlink(packedFilePath);
        await fs.unlink(encryptedFileData.encryptedFilePath);
    }

    return encryptedFileData.encryption;
};
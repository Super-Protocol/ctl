import { promises as fs } from "fs";
import { Encryption } from "@super-protocol/sp-dto-js";
import { StorageAccess } from "@super-protocol/sp-sdk-js";
import download from "../services/downloadFile";
import decryptFile from "../services/decryptFile";
import Printer from "../printer";
import {isCommandSupported} from "../services/uplinkSetupHelper";

export default async (
    remotePath: string,
    localPath: string,
    encryption: Encryption,
    storageAccess: StorageAccess
): Promise<void> => {
    if (!isCommandSupported()) return;

    localPath = localPath.replace(/\/$/, "");

    remotePath = `${remotePath}.encrypted`;
    localPath = `${localPath}.encrypted`;

    await download(remotePath, localPath, storageAccess, (total: number, current: number) => {
        Printer.progress("Downloading", total, current);
    });

    await decryptFile(localPath, encryption, (total: number, current: number) => {
        Printer.progress("Decrypting", total, current);
    });

    Printer.stopProgress();
    Printer.print("Deleting temp files..");
    await fs.unlink(localPath);
    Printer.print("Done");
};

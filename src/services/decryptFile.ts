import { Crypto } from "@super-protocol/sdk-js";
import { Encryption } from "@super-protocol/dto-js";
import fs from "fs";

export default async (
    filepath: string,
    encryption: Encryption,
    progressListener?: (total: number, current: number) => void
): Promise<string> => {
    const decryptedFilepath = filepath.substring(0, filepath.lastIndexOf(".encrypted"));
    const readStream = fs.createReadStream(filepath);
    const writeStream = fs.createWriteStream(decryptedFilepath);
    const fileSize = (await fs.promises.stat(filepath)).size;

    let bytesWritten = 0;
    readStream.on("data", (chunk) => {
        bytesWritten += chunk.length;
        if (progressListener) {
            progressListener(fileSize, bytesWritten);
        }
    });

    await Crypto.decryptStream(readStream, writeStream, encryption);
    if (progressListener) {
        progressListener(fileSize, fileSize);
    }

    return decryptedFilepath;
};

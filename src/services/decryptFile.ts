import { Crypto } from "@super-protocol/sdk-js";
import { Encryption } from "@super-protocol/dto-js";
import fs from "fs";

export default async (
    sourceFilepath: string,
    outputFilepath: string,
    encryption: Encryption,
    progressListener?: (total: number, current: number) => void
): Promise<string> => {
    const readStream = fs.createReadStream(sourceFilepath);
    const writeStream = fs.createWriteStream(outputFilepath);
    const fileSize = (await fs.promises.stat(sourceFilepath)).size;

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

    return outputFilepath;
};

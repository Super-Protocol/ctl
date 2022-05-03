import { Crypto } from "@super-protocol/sp-sdk-js";
import { Encryption } from "@super-protocol/sp-dto-js";
import fs from "fs";

type Result = {
    encryptedFilePath: string;
    encryption: any;
};

export default async (
    filepath: string,
    encryptionConfig: Encryption,
    progressListener?: (total: number, current: number) => void
): Promise<Result> => {
    const encryptedFilepath = `${filepath}.encrypted`;
    const readStream = fs.createReadStream(filepath);
    const writeStream = fs.createWriteStream(`${filepath}.encrypted`);
    const fileSize = (await fs.promises.stat(filepath)).size;

    let bytesWritten = 0;
    readStream.on("data", (chunk) => {
        bytesWritten += chunk.length;
        if (progressListener) {
            progressListener(fileSize, bytesWritten);
        }
    });

    const fileEncryption = await Crypto.encryptStream(readStream, writeStream, {
        algo: encryptionConfig.algo,
        encoding: encryptionConfig.encoding,
        key: encryptionConfig.key,
    });
    if (progressListener) {
        progressListener(fileSize, fileSize);
    }

    return {
        encryptedFilePath: encryptedFilepath,
        encryption: {
            ...fileEncryption,
            key: encryptionConfig.key
        },
    };
};

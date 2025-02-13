import { Crypto } from '@super-protocol/sdk-js';
import { Encryption } from '@super-protocol/dto-js';
import fs from 'fs';

type Result = {
  encryptedFilePath: string;
  encryption: any;
};

export default async (
  readStream: fs.ReadStream,
  filepath: string,
  encryptionConfig: Encryption,
  progressListener?: (total: number, current: number) => void,
): Promise<Result> => {
  const encryptedFilepath = `${filepath}.encrypted`;
  const writeStream = fs.createWriteStream(`${filepath}.encrypted`);
  const fileSize = (await fs.promises.stat(filepath)).size;

  let bytesWritten = 0;
  readStream.on('data', (chunk) => {
    bytesWritten += chunk.length;
    if (progressListener) {
      progressListener(fileSize, bytesWritten);
    }
  });

  const fileEncryption = await Crypto.encryptStream(readStream, writeStream, encryptionConfig);

  if (progressListener) {
    progressListener(fileSize, fileSize);
  }

  return {
    encryptedFilePath: encryptedFilepath,
    encryption: {
      ...fileEncryption,
      key: encryptionConfig.key,
    },
  };
};

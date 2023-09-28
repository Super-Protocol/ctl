import axios from 'axios';
import * as stream from 'stream';
import { promisify } from 'util';
import fs from 'fs';

const finished = promisify(stream.finished);

export type DownloadFileByUrlParams = {
  url: string;
  savePath: string;
  progressListener?: (total: number, current: number) => void;
};

const downloadFileByUrl = async (params: DownloadFileByUrlParams) => {
  const writer = fs.createWriteStream(params.savePath);

  await axios({
    method: 'get',
    url: params.url,
    responseType: 'stream',
  }).then(async ({ data, headers }) => {
    let fileSize = 0;
    try {
      fileSize = +headers['content-length'];
    } catch (e) {}

    let bytesWritten = 0;
    data.on('data', (chunk: Buffer) => {
      bytesWritten += chunk.length;
      if (params.progressListener) {
        params.progressListener(fileSize, bytesWritten);
      }
    });

    data.pipe(writer);
    await finished(writer);

    if (params.progressListener) {
      params.progressListener(fileSize, fileSize);
    }
  });
};

export default downloadFileByUrl;

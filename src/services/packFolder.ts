import _ from 'lodash';
import stream from 'stream';
import path from 'path';
import fs from 'fs';
import * as tarStream from 'tar-stream';
import * as zlib from 'zlib';
import Printer from '../printer';

export default async (
  folderPath: string,
  output: string,
  opts: { transform?: stream.Transform; follow?: boolean } = {},
): Promise<string> => {
  output = output ?? path.join(path.dirname(folderPath), `${path.basename(folderPath)}.tgz`);

  const filesCount = await calculateFilesCount(folderPath);
  let filesPacked = 0;
  const packingProgress = (current: number): void => {
    Printer.progress('Packing', filesCount, current);
  };

  await new Promise((resolve, reject) => {
    const tarPack = tarStream.pack();
    const outputStream = fs.createWriteStream(output);

    const gzip = zlib.createGzip({ level: 1 });

    tarPack.on('error', reject);

    stream.pipeline(
      tarPack,
      gzip,
      ...(opts.transform ? [opts.transform] : []),
      outputStream,
      (err): void => {
        if (err) {
          reject(err);
        }
      },
    );

    const addFiles = async (dir: string): Promise<void> => {
      const items = await fs.promises.readdir(dir, { withFileTypes: true });
      for (const itemsChunk of _.chunk(items, 10)) {
        await Promise.all(
          itemsChunk.map(async (item) => {
            let isDirectory: boolean;
            const fullPath = path.join(dir, item.name);
            try {
              if (item.isSymbolicLink()) {
                const realpath = await fs.promises.realpath(fullPath);
                const linkStat = await fs.promises.stat(realpath);
                isDirectory = linkStat.isDirectory();
              } else {
                isDirectory = item.isDirectory();
              }
              if (isDirectory) {
                tarPack.entry({
                  type: 'directory',
                  name: path.relative(folderPath, fullPath),
                });
                await addFiles(fullPath);

                return;
              }

              const stat = await fs.promises.stat(fullPath);
              const readStream = fs.createReadStream(fullPath);

              await new Promise((innerResolve, innerReject) => {
                const entry = tarPack.entry(
                  {
                    type: 'file',
                    name: path.relative(folderPath, fullPath),
                    size: stat.size,
                    mode: stat.mode,
                  },
                  (err) => {
                    if (err) {
                      innerReject(err);
                    }

                    filesPacked += 1;
                    packingProgress(filesPacked);
                  },
                );

                readStream.on('data', (chunk) => {
                  if (!entry.write(chunk)) {
                    readStream.pause();
                    entry.once('drain', () => {
                      readStream.resume();
                    });
                  }
                });

                readStream.on('end', () => {
                  entry.end();
                  innerResolve({});
                });

                readStream.on('error', innerReject);
                entry.on('error', innerReject);
              });
            } catch (err) {
              Printer.print(`\nIgnoring ${fullPath}. Error ${(err as Error).message}`);
            }
          }),
        );
      }
    };

    addFiles(folderPath)
      .then(() => {
        process.nextTick(() => {
          outputStream.on('finish', resolve);
          outputStream.on('error', reject);
        });
      })
      .catch(reject)
      .finally(() => {
        tarPack.finalize();
      });
  });

  Printer.stopProgress();
  Printer.print(`Archive was created successfully ${output}`);
  return output;
};

const calculateFilesCount = async (dirPath: string): Promise<number> => {
  let filesCount = 0;

  const scanDir = async (dirPath: string): Promise<void> => {
    const files = await fs.promises.readdir(dirPath);

    await Promise.allSettled(
      files.map(async (file) => {
        const filePath = path.join(dirPath, file);
        const stat = await fs.promises.stat(filePath);

        if (stat.isDirectory()) {
          await scanDir(filePath);
        } else {
          filesCount += 1;
        }
      }),
    );
  };

  await scanDir(dirPath);

  return filesCount;
};

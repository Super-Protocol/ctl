import path from 'path';
import { calculateResourceHash } from '@super-protocol/sp-files-addon';
import { cryptoUtils } from '@super-protocol/sdk-js';
import { promises as fs } from 'fs';
import Printer from '../printer';

export interface FilesCalculateHashParams {
  localPath: string;
}

export default async (params: FilesCalculateHashParams): Promise<void> => {
  const inputPath = typeof params.localPath === 'string' ? params.localPath.trim() : '';
  if (!inputPath) {
    Printer.print('Filename should be defined');
    return;
  }

  const localPath = path.resolve(inputPath);

  try {
    const stat = await fs.stat(localPath);
    if (stat.isDirectory()) {
      const files = await fs.readdir(localPath);

      Printer.print(`Found folder "${localPath}" with ${files.length} top-level entries`);
    } else if (stat.isFile()) {
      Printer.print(`Found file "${localPath}"`);
    } else {
      Printer.print(`Found path "${localPath}" (not a regular file or directory)`);
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      Printer.error(`\nFile or folder is missing on path ${localPath}`);
      return;
    }

    throw error;
  }

  try {
    const objectName = path.basename(localPath);
    Printer.print('Calculating hash...');

    const objectHash = await calculateResourceHash(localPath);
    const rootHash = await cryptoUtils.getDirHashFileContents({ [objectName]: objectHash });

    const raw = rootHash.hash ?? '';
    const colonIndex = raw.indexOf(':');

    const hash = {
      algo: colonIndex > 0 ? raw.slice(0, colonIndex).toLowerCase() : '',
      hash: colonIndex > 0 ? raw.slice(colonIndex + 1) : raw,
    };
    Printer.print(JSON.stringify(hash, null, 2));
  } catch (error) {
    throw new Error(`Failed to calculate hash: ${(error as Error).message}`);
  }
};

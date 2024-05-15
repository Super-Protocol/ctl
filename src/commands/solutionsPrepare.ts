import { createHash } from 'crypto';
import { Transform } from 'stream';
import { mkdir } from 'fs/promises';
import toml from '@iarna/toml';
import Printer from '../printer';
import { extractManifest, signManifest } from '../services/prepareSolution';
import packFolderService from '../services/packFolder';
import { assertSize, preparePath } from '../utils';
import { Encoding, Hash, HashAlgorithm, Linkage } from '@super-protocol/dto-js';
import { promises as fs } from 'fs';
import path from 'path';
import { tmpdir } from 'os';

export type PrepareSolutionParams = {
  metadataPath: string;
  solutionHashAlgo: string;
  solutionPath: string;
  solutionOutputPath: string;
  writeDefaultManifest: boolean;
  baseImagePath?: string;
  baseImageResource?: string;
  keyPath: string;
  sgxMaxThreads?: string;
  sgxEnclaveSize?: string;
  loaderPalInternalMemSize?: string;
  sysStackSize?: string;
  envs: string[];
};

const setValue = (obj: any, value: any, ...path: string[]): void => {
  for (let i = 0; i < path.length; i++) {
    if (i < path.length - 1) {
      if (obj[path[i]] === undefined) {
        obj[path[i]] = {};
      }
      obj = obj[path[i]];
    } else {
      obj[path[i]] = value;
    }
  }
};

export default async (params: PrepareSolutionParams): Promise<void> => {
  assertSize(params.loaderPalInternalMemSize, 'Invalid SGX pal internal size');
  assertSize(params.sysStackSize, 'Invalid stack size');
  assertSize(params.sgxEnclaveSize, 'Invalid enclave size');

  const solutionPath = preparePath(params.solutionPath);
  await mkdir(solutionPath, { recursive: true });

  const workingPath = path.join(tmpdir(), 'spctl' + String(Date.now()));
  try {
    await mkdir(workingPath, { recursive: true });
    Printer.print('Getting manifest');

    const { dockerImage, manifest } = await extractManifest({
      baseImagePath: params.baseImagePath,
      baseImageResource: params.baseImageResource,
      workingPath: workingPath,
    });

    Printer.print('Patching manifest');

    const manifestObject = <any>toml.parse(manifest);

    if (params.sgxEnclaveSize) {
      setValue(manifestObject, params.sgxEnclaveSize, 'sgx', 'enclave_size');
    }
    if (params.sgxMaxThreads) {
      if (parseInt(params.sgxMaxThreads, 10) < 4) {
        throw new Error('Value for the number of max threads is too low, the minimum value is 4');
      }
      setValue(manifestObject, parseInt(params.sgxMaxThreads, 10), 'sgx', 'max_threads');
    }
    if (params.loaderPalInternalMemSize) {
      setValue(manifestObject, params.loaderPalInternalMemSize, 'loader', 'pal_internal_mem_size');
    }
    if (params.sysStackSize) {
      setValue(manifestObject, params.sysStackSize, 'sys', 'stack', 'size');
    }
    if (params.envs.length) {
      params.envs.forEach((env) => {
        const [paramName, paramValue] = env.split(/=(.+)/);
        setValue(manifestObject, paramValue, 'loader', 'env', paramName);
      });
    }

    Printer.print('Signing manifest');

    const result = await signManifest({
      dockerImage,
      keyPath: params.keyPath,
      manifest: toml.stringify(manifestObject),
      solutionPath,
      writeDefaultManifest: params.writeDefaultManifest,
      workingPath: workingPath,
    });

    let solutionHash = '';
    let { solutionHashAlgo } = params;

    solutionHashAlgo = solutionHashAlgo || HashAlgorithm.SHA256;

    if (params.solutionOutputPath) {
      Printer.print('Packing solution folder');

      const tarGzExt = '.tar.gz';
      const tgzExt = '.tgz';
      const ext = params.solutionOutputPath.toLowerCase();

      // fix ext
      if (ext.slice(-tarGzExt.length) !== tarGzExt && ext.slice(-tgzExt.length) !== tgzExt) {
        params.solutionOutputPath += tarGzExt;
      }
      const solutionOutputPath = preparePath(params.solutionOutputPath);

      const hashStream = createHash(solutionHashAlgo);

      await packFolderService(solutionPath, solutionOutputPath, {
        transform: new Transform({
          transform: (chunk, _encoding, done): void => {
            hashStream.write(chunk);

            done(null, chunk);
          },
        }),
      });

      Printer.stopProgress();

      solutionHash = hashStream.digest().toString('hex');
    }

    Printer.print('Solution and manifest were created');
    if (solutionHash) {
      Printer.print(`Solution hash [${solutionHashAlgo}]: ${solutionHash}`);
    }
    Printer.print('MRENCLAVE: ' + result.mrenclave);
    Printer.print('MRSIGNER: ' + result.mrsigner);

    Printer.print('Saving metadata to file');
    const metadataPath = preparePath(params.metadataPath);
    const metadata: { linkage: Linkage; hash: Hash } = {
      linkage: {
        encoding: Encoding.base64,
        mrenclave: Buffer.from(result.mrenclave, 'hex').toString(Encoding.base64),
        mrsigner: Buffer.from(result.mrsigner, 'hex').toString(Encoding.base64),
      },
      hash: {
        encoding: Encoding.base64,
        algo: solutionHashAlgo as HashAlgorithm,
        hash: Buffer.from(solutionHash, 'hex').toString(Encoding.base64),
      },
    };
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    Printer.print(`Metadata was saved to ${metadataPath}`);
  } finally {
    await fs.rm(workingPath, { force: true, recursive: true });
  }
};

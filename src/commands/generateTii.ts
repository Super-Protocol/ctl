import { promises as fs } from 'fs';
import { Config as BlockchainConfig, TIIGenerator } from '@super-protocol/sdk-js';
import readResourceFile from '../services/readResourceFile';
import { preparePath } from '../utils';
import Printer from '../printer';
import initBlockchainConnector from '../services/initBlockchainConnector';

export type GenerateTiiParams = {
  blockchainConfig: BlockchainConfig;
  teeOfferId: string;
  resourcePath: string;
  outputPath: string;
  pccsServiceApiUrl: string;
};

export default async (params: GenerateTiiParams): Promise<void> => {
  const resourceFile = await readResourceFile({
    path: preparePath(params.resourcePath),
  });

  const { resource, encryption, hash, linkage, args } = resourceFile;

  if (!encryption) {
    throw new Error('Resource encryption missing');
  }

  Printer.print('Connecting to the blockchain');
  await initBlockchainConnector({
    blockchainConfig: params.blockchainConfig,
  });

  const isSolution = Boolean(linkage);

  const tii = await TIIGenerator.generateByOffer({
    offerId: params.teeOfferId,
    solutionHashes: isSolution && hash ? [hash] : [],
    imageHashes: !isSolution && hash ? [hash] : [],
    linkageString: JSON.stringify(linkage),
    resource: resource,
    args: args,
    encryption: encryption,
    sgxApiUrl: params.pccsServiceApiUrl,
  });

  const outputPath = preparePath(params.outputPath);

  await fs.writeFile(outputPath, tii);

  Printer.print(`TII file was created in ${outputPath}`);
};

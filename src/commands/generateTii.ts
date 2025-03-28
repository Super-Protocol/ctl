import { Encoding, HashAlgorithm, RuntimeInputInfo } from '@super-protocol/dto-js';
import { Config as BlockchainConfig, TIIGenerator } from '@super-protocol/sdk-js';
import { promises as fs } from 'fs';
import Printer from '../printer';
import initBlockchainConnector from '../services/initBlockchainConnector';
import readResourceFile from '../services/readResourceFile';
import { preparePath } from '../utils';

export type GenerateTiiParams = {
  blockchainConfig: BlockchainConfig;
  teeOfferId: string;
  type: string;
  solutionHash: string;
  resourcePath: string;
  outputPath: string;
  pccsServiceApiUrl: string;
};

export default async (params: GenerateTiiParams): Promise<void> => {
  const resourceFile = await readResourceFile({
    path: preparePath(params.resourcePath),
  });

  const { resource, encryption, hash, signatureKeyHash, hardwareContext, args } = resourceFile;

  if (!encryption) {
    throw new Error('Resource encryption missing');
  }

  Printer.print('Connecting to the blockchain');
  await initBlockchainConnector({
    blockchainConfig: params.blockchainConfig,
  });

  const inferRiiType = (type: string): RuntimeInputInfo['type'] => {
    if (type === 'data') {
      return 'Data';
    } else if (type === 'solution') {
      return signatureKeyHash && hardwareContext?.mrEnclave ? 'Solution' : 'Image';
    }

    throw new Error(`Unknown type ${type} provided`);
  };

  const runtimeInputInfos: RuntimeInputInfo[] = hash
    ? [
        {
          args,
          hash,
          ...(signatureKeyHash && { signatureKeyHash }),
          type: inferRiiType(params.type),
          ...(Object.keys(hardwareContext ?? {}).length && { hardwareContext }),
        },
      ]
    : [];

  if (params.solutionHash) {
    runtimeInputInfos.push({
      args,
      hash: {
        algo: HashAlgorithm.SHA256,
        hash: params.solutionHash,
        encoding: Encoding.hex,
      },
      type: 'Image',
    });
  }

  const tii = await TIIGenerator.generateByOffer({
    offerId: params.teeOfferId,
    resource: resource,
    args,
    encryption: encryption,
    sgxApiUrl: params.pccsServiceApiUrl,
    runtimeInputInfos,
  });

  const outputPath = preparePath(params.outputPath);

  await fs.writeFile(outputPath, tii);

  Printer.print(`TII file was created in ${outputPath}`);
};

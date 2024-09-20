import { Config as BlockchainConfig, BlockchainId } from '@super-protocol/sdk-js';
import Printer from '../printer';
import initBlockchainConnector from '../services/initBlockchainConnector';
import createValueOffer from '../services/createValueOffer';
import createTeeOffer from '../services/createTeeOffer';
import { readValueOfferInfo } from '../services/readValueOfferInfo';
import { readTeeOfferInfo } from '../services/readTeeOfferInfo';
import { Config } from '../config';
import readJsonFile from '../services/readJsonFile';
import { uploadOfferInput } from '../services/uploadOfferInput';

export type OffersCreateParams = {
  blockchainConfig: BlockchainConfig;
  type: 'tee' | 'value';
  authorityAccountKey: string;
  actionAccountKey: string;
  offerInfoPath: string;
  enableAutoDeposit: boolean;
  storageConfig: Config['storage'];
  configurationPath?: string;
};

export default async (params: OffersCreateParams): Promise<void> => {
  await initBlockchainConnector({
    blockchainConfig: params.blockchainConfig,
    actionAccountKey: params.actionAccountKey,
  });

  let id: BlockchainId;
  switch (params.type) {
    case 'tee': {
      const teeOfferInfo = await readTeeOfferInfo({
        path: params.offerInfoPath,
        isPartialContent: false,
      });

      Printer.print('Offer info file was read successfully');

      id = await createTeeOffer({
        authority: params.authorityAccountKey,
        action: params.actionAccountKey,
        contractAddress: params.blockchainConfig.contractAddress,
        enableAutoDeposit: params.enableAutoDeposit,
        offerInfo: teeOfferInfo,
      });
      break;
    }
    case 'value': {
      const offerInfo = await readValueOfferInfo({
        path: params.offerInfoPath,
        isPartialContent: false,
      });

      Printer.print('Offer info file was read successfully');

      if (params.configurationPath) {
        const configuration = await readJsonFile({ path: params.configurationPath });
        const input = { configuration };
        const inputResource = await uploadOfferInput({
          data: input,
          offerName: offerInfo.name,
          storageConfig: params.storageConfig,
        });

        offerInfo.input = JSON.stringify(inputResource);

        Printer.print('Offer configuration was saved successfully');
      }

      id = await createValueOffer({
        authority: params.authorityAccountKey,
        action: params.actionAccountKey,
        contractAddress: params.blockchainConfig.contractAddress,
        enableAutoDeposit: params.enableAutoDeposit,
        offerInfo,
      });
      break;
    }
    default:
      throw new Error(`Unknown offer type ${params.type} provided`);
  }

  Printer.print(`Offer was created with id ${id}`);
};

import { Config as BlockchainConfig, BlockchainId } from '@super-protocol/sdk-js';
import Printer from '../printer';
import initBlockchainConnector from '../services/initBlockchainConnector';
import createValueOffer from '../services/createValueOffer';
import createTeeOffer from '../services/createTeeOffer';
import { readValueOfferInfo } from '../services/readValueOfferInfo';
import { readTeeOfferInfo } from '../services/readTeeOfferInfo';

export type OffersCreateParams = {
  blockchainConfig: BlockchainConfig;
  type: 'tee' | 'value';
  authorityAccountKey: string;
  actionAccountKey: string;
  offerInfoPath: string;
  enableAutoDeposit: boolean;
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

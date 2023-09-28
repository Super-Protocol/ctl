import { Config as BlockchainConfig, Offer, TeeOffer } from '@super-protocol/sdk-js';
import Printer from '../printer';
import initBlockchainConnector from '../services/initBlockchainConnector';
import readTeeOfferInfo from '../services/readTeeOfferInfo';
import readValueOfferInfo from '../services/readValueOfferInfo';

export type OffersUpdateParams = {
  id: string;
  type: 'tee' | 'value';
  offerInfoPath: string;
  blockchainConfig: BlockchainConfig;
  actionAccountKey: string;
};

export default async (params: OffersUpdateParams) => {
  await initBlockchainConnector({
    blockchainConfig: params.blockchainConfig,
    actionAccountKey: params.actionAccountKey,
  });

  switch (params.type) {
    case 'tee':
      const teeOfferInfo = await readTeeOfferInfo({ path: params.offerInfoPath });

      Printer.print('Offer info file was read successfully, updating in blockchain');

      const teeOffer = new TeeOffer(params.id);
      await teeOffer.setInfo(teeOfferInfo);
      break;

    case 'value':
      const offerInfo = await readValueOfferInfo({ path: params.offerInfoPath });

      Printer.print('Offer info file was read successfully, updating in blockchain');

      const offer = new Offer(params.id);
      await offer.setInfo(offerInfo);
      break;

    default:
      throw new Error(`Unknown offer type ${params.type} provided`);
  }

  Printer.print(`Offer ${params.id} was updated successfully`);
};

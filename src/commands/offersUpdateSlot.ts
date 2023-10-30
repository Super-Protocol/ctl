import { Config as BlockchainConfig, Offer, TeeOffer } from '@super-protocol/sdk-js';
import Printer from '../printer';
import initBlockchainConnector from '../services/initBlockchainConnector';
import readTeeOfferSlot from '../services/readTeeOfferSlot';
import readValueOfferSlot from '../services/readValueOfferSlot';

export type OffersAddSlotParams = {
  offerId: string;
  slotId: string;
  type: 'tee' | 'value';
  slotPath: string;
  blockchainConfig: BlockchainConfig;
  actionAccountKey: string;
};

export default async (params: OffersAddSlotParams) => {
  await initBlockchainConnector({
    blockchainConfig: params.blockchainConfig,
    actionAccountKey: params.actionAccountKey,
  });

  switch (params.type) {
    case 'tee': {
      const teeOfferSlot = await readTeeOfferSlot({
        path: params.slotPath,
      });

      Printer.print('Slot info file was read successfully, updating in blockchain');

      const teeOffer = new TeeOffer(params.offerId);
      await teeOffer.updateSlot(params.slotId, teeOfferSlot.info, teeOfferSlot.usage);
      break;
    }
    case 'value': {
      const valueOfferSlot = await readValueOfferSlot({
        path: params.slotPath,
      });

      Printer.print('Slot info file was read successfully, updating in blockchain');

      const offer = new Offer(params.offerId);
      await offer.updateSlot(
        params.slotId,
        valueOfferSlot.info,
        valueOfferSlot.option,
        valueOfferSlot.usage,
      );
      break;
    }
    default:
      throw new Error(`Unknown offer type ${params.type} provided`);
  }

  Printer.print(`Slot ${params.slotId} was updated successfully`);
};

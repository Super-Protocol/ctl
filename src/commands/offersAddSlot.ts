import { Config as BlockchainConfig, BlockchainId, Offer, TeeOffer } from '@super-protocol/sdk-js';
import Printer from '../printer';
import initBlockchainConnector from '../services/initBlockchainConnector';
import readTeeOfferSlot from '../services/readTeeOfferSlot';
import readValueOfferSlot from '../services/readValueOfferSlot';
import { generateExternalId } from '../utils';

export type OffersAddSlotParams = {
  offerId: string;
  type: 'tee' | 'value';
  slotPath: string;
  blockchainConfig: BlockchainConfig;
  actionAccountKey: string;
};

export default async (params: OffersAddSlotParams): Promise<void> => {
  await initBlockchainConnector({
    blockchainConfig: params.blockchainConfig,
    actionAccountKey: params.actionAccountKey,
  });

  const slotExternalId = generateExternalId();

  const getSlotId = async (): Promise<BlockchainId> => {
    switch (params.type) {
      case 'tee': {
        const teeOfferSlot = await readTeeOfferSlot({
          path: params.slotPath,
        });

        Printer.print(
          `TEE slot info file was read successfully, cretaing with externalId ${slotExternalId}`,
        );

        const teeOffer = new TeeOffer(params.offerId);
        return await teeOffer.addSlot(teeOfferSlot.info, teeOfferSlot.usage, slotExternalId);
      }
      case 'value': {
        const valueOfferSlot = await readValueOfferSlot({
          path: params.slotPath,
        });

        Printer.print(
          `Value slot info file was read successfully, creating in blockchain with externalId ${slotExternalId}`,
        );

        const offer = new Offer(params.offerId);
        return await offer.addSlot(
          valueOfferSlot.info,
          valueOfferSlot.option,
          valueOfferSlot.usage,
          slotExternalId,
        );
      }
      default:
        throw new Error(`Unknown offer type ${params.type} provided`);
    }
  };

  const newSlotId = await getSlotId();

  Printer.print(`Slot was created with id ${newSlotId}`);
};

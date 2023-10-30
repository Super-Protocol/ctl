import {
  Config as BlockchainConfig,
  BlockchainId,
  Offer,
  TeeOffer,
  TeeOffers,
} from '@super-protocol/sdk-js';
import Printer from '../printer';
import initBlockchainConnector from '../services/initBlockchainConnector';
import readTeeOfferSlot from '../services/readTeeOfferSlot';
import readValueOfferSlot from '../services/readValueOfferSlot';
import { generateExternalId } from '../utils';
import { Offers } from '@super-protocol/sdk-js';
import doWithRetries from '../services/doWithRetries';

export type OffersAddSlotParams = {
  offerId: string;
  type: 'tee' | 'value';
  slotPath: string;
  blockchainConfig: BlockchainConfig;
  actionAccountKey: string;
};

export default async (params: OffersAddSlotParams) => {
  const creator = (await initBlockchainConnector({
    blockchainConfig: params.blockchainConfig,
    actionAccountKey: params.actionAccountKey,
  })) as string;

  const slotExternalId = generateExternalId();
  let slotLoaderFn: () => Promise<BlockchainId>;

  switch (params.type) {
    case 'tee': {
      const teeOfferSlot = await readTeeOfferSlot({
        path: params.slotPath,
      });

      Printer.print(
        `TEE slot info file was read successfully, cretaing with externalId ${slotExternalId}`,
      );

      const teeOffer = new TeeOffer(params.offerId);
      await teeOffer.addSlot(teeOfferSlot.info, teeOfferSlot.usage, slotExternalId);

      slotLoaderFn = () =>
        TeeOffers.getSlotByExternalId({
          creator,
          offerId: params.offerId,
          externalId: slotExternalId,
        }).then((event) => {
          if (event?.slotId) {
            return event.slotId;
          }
          throw new Error("Slot wasn't created. Try increasing the gas price.");
        });

      break;
    }
    case 'value': {
      const valueOfferSlot = await readValueOfferSlot({
        path: params.slotPath,
      });

      Printer.print(
        `Value slot info file was read successfully, cretaing in blockchain with externalId ${slotExternalId}`,
      );

      const offer = new Offer(params.offerId);
      await offer.addSlot(
        valueOfferSlot.info,
        valueOfferSlot.option,
        valueOfferSlot.usage,
        slotExternalId,
      );

      slotLoaderFn = () =>
        Offers.getSlotByExternalId({
          creator,
          offerId: params.offerId,
          externalId: slotExternalId,
        }).then((event) => {
          if (event?.slotId) {
            return event.slotId;
          }
          throw new Error("Slot wasn't created. Try increasing the gas price.");
        });

      break;
    }
    default:
      throw new Error(`Unknown offer type ${params.type} provided`);
  }

  const newSlotId = await doWithRetries(slotLoaderFn);

  Printer.print(`Slot was created with id ${newSlotId}`);
};

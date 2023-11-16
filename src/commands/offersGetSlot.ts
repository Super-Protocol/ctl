import { promises as fs } from 'fs';
import path from 'path';

import Printer from '../printer';

import { PriceType, TeeOfferSlot, ValueOfferSlot } from '@super-protocol/sdk-js';
import fetchTeeOffers, { TeeOfferItem } from '../services/fetchTeeOffers';
import fetchOffers, { OfferItem, OfferItemSlots } from '../services/fetchOffers';

export type OffersGetSlotParams = {
  backendUrl: string;
  accessToken: string;
  type: 'tee' | 'value';
  offerId: string;
  slotId: string;
  saveTo: string;
};

function findFetchedSlot(
  item: OfferItem | TeeOfferItem,
  targetSlotId: string,
): TeeOfferSlot | ValueOfferSlot | undefined {
  const slotItem = (item?.slots as OfferItemSlots)?.find((slot) => slot.id === targetSlotId);

  if (!slotItem) return;

  return {
    ...slotItem,
    usage: {
      ...slotItem.usage,
      priceType: PriceType[slotItem.usage.priceType],
    },
  };
}

export default async (params: OffersGetSlotParams): Promise<void> => {
  let slot: TeeOfferSlot | ValueOfferSlot | undefined;
  switch (params.type) {
    case 'tee':
      slot = await fetchTeeOffers({
        backendUrl: params.backendUrl,
        accessToken: params.accessToken,
        limit: 1,
        filter: { id: params.offerId },
      }).then(({ list }): TeeOfferSlot | undefined => findFetchedSlot(list[0], params.slotId));
      break;
    case 'value':
      slot = await fetchOffers({
        backendUrl: params.backendUrl,
        accessToken: params.accessToken,
        limit: 1,
        id: params.offerId,
      }).then(({ list }) => <ValueOfferSlot>findFetchedSlot(list[0], params.slotId));
      break;

    default:
      throw new Error(`Unknown offer type ${params.type} provided`);
  }

  if (!slot) {
    Printer.print(`Slot ${params.slotId} of offer ${params.offerId} could not be found`);
    return;
  }

  Printer.printObject(slot);

  if (params.saveTo) {
    const pathToSaveResult = path.join(process.cwd(), params.saveTo);
    await fs.writeFile(pathToSaveResult, JSON.stringify(slot));
    Printer.print(`Saved result to ${pathToSaveResult}`);
  }
};

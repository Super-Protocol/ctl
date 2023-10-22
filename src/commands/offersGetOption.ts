import { promises as fs } from 'fs';
import path from 'path';
import { PriceType, TeeOfferOption } from '@super-protocol/sdk-js';
import Printer from '../printer';
import fetchTeeOffers, { TeeOfferItemOptions } from '../services/fetchTeeOffers';

export type OffersGetSlotParams = {
  backendUrl: string;
  accessToken: string;
  offerId: string;
  optionId: string;
  saveTo?: string;
};

export default async (params: OffersGetSlotParams): Promise<void> => {
  const option = await fetchTeeOffers({
    backendUrl: params.backendUrl,
    accessToken: params.accessToken,
    limit: 1,
    id: params.offerId,
  }).then(({ list }): TeeOfferOption | undefined => {
    const optionItem = (list[0]?.node?.options as TeeOfferItemOptions)?.find(
      (option) => option.id === params.optionId,
    );

    if (!optionItem) return;

    return {
      ...optionItem,
      usage: {
        ...optionItem.usage,
        priceType: PriceType[optionItem.usage.priceType],
      },
    };
  });

  if (!option) {
    Printer.print(`Option ${params.optionId} of TEE offer ${params.offerId} could not be found`);
    return;
  }

  Printer.printObject(option);

  if (params.saveTo) {
    const pathToSaveResult = path.join(process.cwd(), params.saveTo);
    await fs.writeFile(pathToSaveResult, JSON.stringify(option));
    Printer.print(`Saved result to ${pathToSaveResult}`);
  }
};

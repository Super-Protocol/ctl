import { promises as fs } from 'fs';
import path from 'path';
import Printer from '../printer';
import { OfferInfo, TeeOfferInfo } from '@super-protocol/sdk-js';
import fetchTeeOffers from '../services/fetchTeeOffers';
import fetchOffers from '../services/fetchOffers';

export type OffersGetInfoParams = {
  backendUrl: string;
  accessToken: string;
  type: 'tee' | 'value';
  id: string;
  saveTo?: string;
};

export default async (params: OffersGetInfoParams): Promise<void> => {
  let offer: OfferInfo | TeeOfferInfo | undefined;
  switch (params.type) {
    case 'tee':
      offer = await fetchTeeOffers({
        backendUrl: params.backendUrl,
        accessToken: params.accessToken,
        limit: 1,
        id: params.id,
      }).then(({ list }) => <TeeOfferInfo>list[0]?.teeOfferInfo);
      break;
    case 'value':
      offer = await fetchOffers({
        backendUrl: params.backendUrl,
        accessToken: params.accessToken,
        limit: 1,
        id: params.id,
      }).then(({ list }) => <OfferInfo>list[0]?.offerInfo);
      break;

    default:
      throw new Error(`Unknown offer type ${params.type} provided`);
  }

  if (!offer) {
    Printer.print(`Offer ${params.id} could not be found`);
    return;
  }

  Printer.printObject(offer);

  if (params.saveTo) {
    const pathToSaveResult = path.join(process.cwd(), params.saveTo);
    await fs.writeFile(pathToSaveResult, JSON.stringify(offer));
    Printer.print(`Saved result to ${pathToSaveResult}`);
  }
};

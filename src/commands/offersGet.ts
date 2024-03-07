import Printer from '../printer';
import fetchOffers, { OfferDto, formatFetchedOffer } from '../services/fetchOffers';
import fetchTeeOffers, { TeeOfferDto, formatFetchedTeeOffer } from '../services/fetchTeeOffers';
import { prepareObjectToPrint } from '../utils';
import path from 'path';
import { promises as fs } from 'fs';

export type OffersGetParams = {
  backendUrl: string;
  accessToken: string;
  type: 'tee' | 'value';
  fields: string[];
  id: string;
  saveTo?: string;
};

export default async (params: OffersGetParams): Promise<void> => {
  let offer: OfferDto | TeeOfferDto | undefined;
  switch (params.type) {
    case 'tee':
      offer = await fetchTeeOffers({
        backendUrl: params.backendUrl,
        accessToken: params.accessToken,
        limit: 1,
        filter: { id: params.id },
      }).then(({ list }) => formatFetchedTeeOffer(list[0]));
      break;
    case 'value':
      offer = await fetchOffers({
        backendUrl: params.backendUrl,
        accessToken: params.accessToken,
        limit: 1,
        id: params.id,
      }).then(({ list }) => formatFetchedOffer(list[0]));
      break;

    default:
      throw new Error(`Unknown offer type ${params.type} provided`);
  }

  if (!offer) {
    Printer.print(`Offer ${params.id} could not be found`);
    return;
  }

  Printer.printObject(prepareObjectToPrint(offer, params.fields));

  if (params.saveTo) {
    const pathToSaveResult = path.join(process.cwd(), params.saveTo);
    await fs.writeFile(pathToSaveResult, JSON.stringify(offer));
    Printer.print(`\nSaved result to ${pathToSaveResult}`);
  }
};

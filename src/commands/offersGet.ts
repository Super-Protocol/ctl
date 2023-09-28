import Printer from '../printer';
import fetchOffers, { formatFetchedOffer } from '../services/fetchOffers';
import fetchTeeOffers, { formatFetchedTeeOffer } from '../services/fetchTeeOffers';
import { prepareObjectToPrint } from '../utils';

export type OffersGetParams = {
  backendUrl: string;
  accessToken: string;
  type: 'tee' | 'value';
  fields: string[];
  id: string;
};

export default async (params: OffersGetParams) => {
  let offers: any[];
  switch (params.type) {
    case 'tee':
      offers = await fetchTeeOffers({
        backendUrl: params.backendUrl,
        accessToken: params.accessToken,
        limit: 1,
        id: params.id,
      }).then(({ list }) => list.map((item) => formatFetchedTeeOffer(item)));
      break;
    case 'value':
      offers = await fetchOffers({
        backendUrl: params.backendUrl,
        accessToken: params.accessToken,
        limit: 1,
        id: params.id,
      }).then(({ list }) => list.map((item) => formatFetchedOffer(item)));
      break;

    default:
      throw new Error(`Unknown offer type ${params.type} provided`);
  }

  if (!offers.length) {
    Printer.print(`Offer ${params.id} could not be found`);
    return;
  }

  const offer = prepareObjectToPrint(offers[0], params.fields);
  Printer.printObject(offer);
};

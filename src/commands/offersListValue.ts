import fetchOffersService, { formatFetchedOffer } from '../services/fetchOffers';
import Printer from '../printer';
import { prepareObjectToPrint } from '../utils';
import { OffersListParams } from './offersListTee';

export default async (params: OffersListParams): Promise<void> => {
  const offers = await fetchOffersService({
    backendUrl: params.backendUrl,
    accessToken: params.accessToken,
    ...(params.ids.length && { ids: params.ids }),
    limit: params.limit,
    cursor: params.cursor,
  }).then((offers) => ({
    ...offers,
    list: offers.list.map((item) => formatFetchedOffer(item)),
  }));

  if (!offers.list.length) {
    Printer.print('No value offers found');
    return;
  }

  const rows = offers.list.map((item) => prepareObjectToPrint(item, params.fields));

  Printer.table(rows);
  Printer.print('Last pagination cursor: ' + offers.cursor);
};

import fetchTeeOffersService, { formatFetchedTeeOffer } from '../services/fetchTeeOffers';
import Printer from '../printer';
import { prepareObjectToPrint } from '../utils';

export type OffersListParams = {
  backendUrl: string;
  accessToken: string;
  fields: string[];
  ids: string[];
  limit: number;
  cursor?: string;
};

export default async (params: OffersListParams): Promise<void> => {
  const offers = await fetchTeeOffersService({
    backendUrl: params.backendUrl,
    accessToken: params.accessToken,
    filter: {
      ...(params.ids.length && { ids: params.ids }),
    },
    limit: params.limit,
    cursor: params.cursor,
  }).then((offers) => ({
    ...offers,
    list: offers.list.map((item) => formatFetchedTeeOffer(item)),
  }));

  if (!offers.list.length) {
    Printer.print('No tee offers found');
    return;
  }

  const rows = offers.list.map((item) => prepareObjectToPrint(item, params.fields));

  Printer.table(rows);
  Printer.print('Last pagination cursor: ' + offers.cursor);
};

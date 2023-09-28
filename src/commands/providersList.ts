import fetchProvidersService from '../services/fetchProviders';
import Printer from '../printer';
import { prepareObjectToPrint } from '../utils';

export type ProviderListParams = {
  backendUrl: string;
  accessToken: string;
  fields: string[];
  limit: number;
  cursor?: string;
};

export default async (params: ProviderListParams) => {
  const providers = await fetchProvidersService({
    backendUrl: params.backendUrl,
    accessToken: params.accessToken,
    limit: params.limit,
    cursor: params.cursor,
  });

  if (!providers.list.length) {
    Printer.print('No providers found');
    return;
  }

  const rows = providers.list.map((item) => prepareObjectToPrint(item, params.fields));

  Printer.table(rows);
  Printer.print('Last pagination cursor: ' + providers.cursor);
};

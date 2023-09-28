import fetchProvidersService from '../services/fetchProviders';
import Printer from '../printer';
import { prepareObjectToPrint } from '../utils';

export type ProvidersGetParams = {
  backendUrl: string;
  accessToken: string;
  fields: string[];
  address: string;
};

export default async (params: ProvidersGetParams) => {
  const providers = await fetchProvidersService({
    backendUrl: params.backendUrl,
    accessToken: params.accessToken,
    limit: 1,
    address: params.address,
  });

  if (!providers.list.length) {
    Printer.print(`Provider ${params.address} could not be found`);
    return;
  }

  const provider = prepareObjectToPrint(providers.list[0], params.fields);
  Printer.printObject(provider);
};

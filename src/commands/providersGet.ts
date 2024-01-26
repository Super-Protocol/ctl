import { promises as fs } from 'fs';
import path from 'path';
import fetchProvidersService from '../services/fetchProviders';
import Printer from '../printer';
import { prepareObjectToPrint } from '../utils';

export type ProvidersGetParams = {
  backendUrl: string;
  accessToken: string;
  fields: string[];
  address: string;
  saveTo?: string;
};

export default async (params: ProvidersGetParams): Promise<void> => {
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

  if (params.saveTo) {
    const pathToSaveResult = path.join(process.cwd(), params.saveTo);
    await fs.writeFile(pathToSaveResult, JSON.stringify(providers.list[0].providerInfo, null, 2));
    Printer.print(`Saved result to ${pathToSaveResult}`);
  }
};

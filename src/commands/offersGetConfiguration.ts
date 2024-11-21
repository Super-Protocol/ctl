import { promises as fs } from 'fs';
import path from 'path';
import Printer from '../printer';
import fetchOffers from '../services/fetchOffers';

export type OffersGetConfigurationParams = {
  backendUrl: string;
  accessToken: string;
  id: string;
  saveTo?: string;
};

export default async (params: OffersGetConfigurationParams): Promise<void> => {
  const { list: offers } = await fetchOffers({
    backendUrl: params.backendUrl,
    accessToken: params.accessToken,
    limit: 1,
    id: params.id,
  });

  if (!offers.length) {
    Printer.print(`Offer ${params.id} not found`);
    return;
  }

  const configuration = offers[0]?.configuration as Record<string, unknown>;
  if (!configuration) {
    Printer.print(`Offer ${params.id} has no configuration`);
    return;
  }

  if (params.saveTo) {
    const pathToSaveResult = path.join(process.cwd(), params.saveTo);
    await fs.writeFile(pathToSaveResult, JSON.stringify(configuration, null, 2));
    Printer.print(`Saved result to ${pathToSaveResult}`);
  } else {
    Printer.print(JSON.stringify(configuration, null, 2));
  }
};

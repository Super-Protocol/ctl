import { OfferInfo, OfferVersion, TeeOfferInfo } from '@super-protocol/sdk-js';
import { promises as fs } from 'fs';
import path from 'path';
import Printer from '../printer';
import fetchOffers, { OfferItem } from '../services/fetchOffers';
import fetchTeeOffers from '../services/fetchTeeOffers';
import { selectLastValueOfferVersion } from '../services/offerValueVersionHelper';

export type OffersGetInfoParams = {
  backendUrl: string;
  accessToken: string;
  type: 'tee' | 'value';
  id: string;
  saveTo?: string;
};

export default async (params: OffersGetInfoParams): Promise<void> => {
  let offer: (OfferInfo & { version?: OfferVersion }) | TeeOfferInfo | undefined;
  switch (params.type) {
    case 'tee': {
      offer = await fetchTeeOffers({
        backendUrl: params.backendUrl,
        accessToken: params.accessToken,
        limit: 1,
        filter: { id: params.id },
      }).then(({ list }) => <TeeOfferInfo>list[0]?.teeOfferInfo);
      break;
    }
    case 'value': {
      const convert = (offer?: OfferItem): (OfferInfo & { version?: OfferVersion }) | undefined => {
        if (!offer) {
          return;
        }

        const version = selectLastValueOfferVersion(offer.versions as OfferVersion[]);

        return {
          ...(offer.offerInfo as OfferInfo),
          ...(version && { version: version as OfferVersion }),
        };
      };
      offer = await fetchOffers({
        backendUrl: params.backendUrl,
        accessToken: params.accessToken,
        limit: 1,
        id: params.id,
      }).then(({ list }) => convert(list[0]));
      break;
    }
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

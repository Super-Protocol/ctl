import BlockchainConnector, { OfferInfo, Offers } from '@super-protocol/sdk-js';
import crypto from 'crypto';
import Printer from '../printer';
import doWithRetries from './doWithRetries';

export type CreateOfferParams = {
  authority: string;
  action: string;
  offerInfo: OfferInfo;
};

export default async (params: CreateOfferParams): Promise<string> => {
  const externalId = crypto.randomBytes(8).toString('hex');
  const actionAddress = await BlockchainConnector.getInstance().initializeActionAccount(
    params.action,
  );
  const authorityAddress = await BlockchainConnector.getInstance().initializeActionAccount(
    params.authority,
  );
  // TODO: make as option parameter with possibility to enable/disable by update command
  const enable = true;

  Printer.print('Creating value offer');

  Offers.create(authorityAddress, params.offerInfo, externalId, enable, { from: actionAddress });

  const offerLoaderFn = () =>
    Offers.getByExternalId(actionAddress, externalId).then((event) => {
      if (event?.offerId !== '-1') {
        return event.offerId;
      }
      throw new Error("Value offer wasn't created. Try increasing the gas price.");
    });

  const offerId = await doWithRetries(offerLoaderFn);

  return offerId;
};

import BlockchainConnector, { BlockchainId, TeeOfferInfo, TeeOffers } from '@super-protocol/sdk-js';
import crypto from 'crypto';
import Printer from '../printer';
import doWithRetries from './doWithRetries';

export type CreateTeeOfferParams = {
  authority: string;
  action: string;
  offerInfo: TeeOfferInfo;
};

export default async (params: CreateTeeOfferParams): Promise<BlockchainId> => {
  const externalId = crypto.randomBytes(8).toString('hex');
  const actionAddress = await BlockchainConnector.getInstance().initializeActionAccount(
    params.action,
  );
  const authorityAddress = await BlockchainConnector.getInstance().initializeActionAccount(
    params.authority,
  );

  // TODO: make as option parameter with possibility to enable/disable by update command
  const enable = true;

  Printer.print('Creating TEE offer');

  TeeOffers.create(authorityAddress, params.offerInfo, externalId, enable, { from: actionAddress });

  const offerLoaderFn = () =>
    TeeOffers.getByExternalId({ externalId, creator: actionAddress }).then((event) => {
      if (event && event?.offerId !== '-1') {
        return event.offerId;
      }
      throw new Error("TEE offer wasn't created. Try increasing the gas price.");
    });

  const offerId = await doWithRetries(offerLoaderFn);

  return offerId;
};

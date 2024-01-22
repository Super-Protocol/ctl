import BlockchainConnector, { BlockchainId, OfferInfo, Offers } from '@super-protocol/sdk-js';
import crypto from 'crypto';
import Printer from '../printer';
import doWithRetries from './doWithRetries';
import checkBalanceToCreateOffer from './checkBalanceToCreateOffer';

export type CreateOfferParams = {
  authority: string;
  action: string;
  offerInfo: OfferInfo;
  contractAddress: string;
  enableAutoDeposit: boolean;
};

export default async (params: CreateOfferParams): Promise<BlockchainId> => {
  const externalId = crypto.randomBytes(8).toString('hex');
  const actionAddress = await BlockchainConnector.getInstance().initializeActionAccount(
    params.action,
  );
  const authorityAddress = await BlockchainConnector.getInstance().initializeActionAccount(
    params.authority,
  );
  // TODO: make as option parameter with possibility to enable/disable by update command
  const enable = true;

  await checkBalanceToCreateOffer({
    contractAddress: params.contractAddress,
    enableAutoDeposit: params.enableAutoDeposit,
    authorityAddress,
    offerType: 'value',
  });

  Printer.print('Creating value offer');

  await Offers.create(authorityAddress, params.offerInfo, externalId, enable, {
    from: actionAddress,
  });

  const offerLoaderFn = (): Promise<string> =>
    Offers.getByExternalId({ externalId, creator: actionAddress }).then((event) => {
      if (event && event?.offerId !== '-1') {
        return event.offerId;
      }
      throw new Error("Value offer wasn't created. Try increasing the gas price.");
    });

  const offerId = await doWithRetries(offerLoaderFn);

  return offerId;
};

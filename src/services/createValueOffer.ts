import {
  BlockchainConnector,
  BlockchainId,
  Offer,
  OfferInfo,
  Offers,
  OfferVersionInfo,
} from '@super-protocol/sdk-js';
import Printer from '../printer';
import doWithRetries from './doWithRetries';
import checkBalanceToCreateOffer from './checkBalanceToCreateOffer';
import { generateExternalId } from '../utils';
import addValueOfferVersion from './addValueOfferVersion';

export type CreateOfferParams = {
  authority: string;
  action: string;
  offerInfo: OfferInfo;
  versionInfo: OfferVersionInfo;
  contractAddress: string;
  enableAutoDeposit: boolean;
  enabled: boolean;
};

export default async (params: CreateOfferParams): Promise<BlockchainId> => {
  const externalId = generateExternalId();
  const actionAddress = await BlockchainConnector.getInstance().initializeActionAccount(
    params.action,
  );
  const authorityAddress = await BlockchainConnector.getInstance().initializeActionAccount(
    params.authority,
  );

  await checkBalanceToCreateOffer({
    contractAddress: params.contractAddress,
    enableAutoDeposit: params.enableAutoDeposit,
    actionAddress,
    authorityAddress,
    offerType: 'value',
  });

  Printer.print('Creating value offer');

  await Offers.create({
    providerAuthorityAccount: authorityAddress,
    offerInfo: params.offerInfo,
    externalId,
    transactionOptions: { from: actionAddress },
  });

  const offerLoaderFn = (): Promise<string> =>
    Offers.getByExternalId({ externalId, creator: actionAddress }).then((event) => {
      if (event && event?.offerId !== '-1') {
        return event.offerId;
      }
      throw new Error("Value offer wasn't created. Try increasing the gas price.");
    });

  const offerId = await doWithRetries(offerLoaderFn);
  await addValueOfferVersion({
    action: params.action,
    offerId,
    versionInfo: params.versionInfo,
    version: 1,
  });

  if (params.enabled) {
    const offer = new Offer(offerId);
    const isEnabled = await offer.isEnabled();
    if (!isEnabled) {
      await new Offer(offerId).enable({ from: actionAddress });
    }
  }

  return offerId;
};

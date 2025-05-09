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
import ensureSufficientOfferSecDeposit from './ensureSufficientOfferSecDeposit';
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

  await ensureSufficientOfferSecDeposit({
    contractAddress: params.contractAddress,
    enableAutoDeposit: params.enableAutoDeposit,
    actionAddress,
    authorityAddress,
    offerType: 'value',
    target: 'createOffer',
  });

  Printer.print('Creating value offer');
  const currentBlock = await BlockchainConnector.getInstance().getLastBlockInfo();

  await Offers.create({
    providerAuthorityAccount: authorityAddress,
    offerInfo: params.offerInfo,
    externalId,
    transactionOptions: { from: actionAddress },
  });

  const offerLoaderFn = (): Promise<string> =>
    Offers.getByExternalId(
      { externalId, creator: actionAddress },
      currentBlock.index,
      'latest',
    ).then((event) => {
      if (event && event?.offerId !== '-1') {
        return event.offerId;
      }
      throw new Error("Value offer wasn't created. Try increasing the gas price.");
    });

  const offerId = await doWithRetries(offerLoaderFn, 10, 5000);
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

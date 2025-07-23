import {
  BlockchainConnector,
  BlockchainId,
  Offer,
  OfferInfo,
  Offers,
  OfferVersionInfo,
} from '@super-protocol/sdk-js';
import Printer from '../printer';
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

  const offerId = await Offers.create({
    providerAuthorityAccount: authorityAddress,
    offerInfo: params.offerInfo,
    externalId,
    transactionOptions: { from: actionAddress },
  });

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

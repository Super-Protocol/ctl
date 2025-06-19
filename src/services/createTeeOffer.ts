import { BlockchainConnector, BlockchainId, TeeOfferInfo, TeeOffers } from '@super-protocol/sdk-js';
import Printer from '../printer';
import ensureSufficientOfferSecDeposit from './ensureSufficientOfferSecDeposit';
import { generateExternalId } from '../utils';

export type CreateTeeOfferParams = {
  authority: string;
  action: string;
  offerInfo: TeeOfferInfo;
  contractAddress: string;
  enableAutoDeposit: boolean;
};

export default async (params: CreateTeeOfferParams): Promise<BlockchainId> => {
  const externalId = generateExternalId();
  const actionAddress = await BlockchainConnector.getInstance().initializeActionAccount(
    params.action,
  );
  const authorityAddress = await BlockchainConnector.getInstance().initializeActionAccount(
    params.authority,
  );

  // TODO: make as option parameter with possibility to enable/disable by update command
  const enable = true;

  await ensureSufficientOfferSecDeposit({
    contractAddress: params.contractAddress,
    enableAutoDeposit: params.enableAutoDeposit,
    actionAddress,
    authorityAddress,
    offerType: 'tee',
    target: 'createOffer',
  });

  Printer.print('Creating TEE offer');

  const offerId = await TeeOffers.create(authorityAddress, params.offerInfo, externalId, enable, {
    from: actionAddress,
  });
  return offerId;
};

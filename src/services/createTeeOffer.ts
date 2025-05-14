import { BlockchainConnector, BlockchainId, TeeOfferInfo, TeeOffers } from '@super-protocol/sdk-js';
import Printer from '../printer';
import doWithRetries from './doWithRetries';
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

  const currentBlock = await BlockchainConnector.getInstance().getLastBlockInfo();

  Printer.print('Creating TEE offer');

  await TeeOffers.create(authorityAddress, params.offerInfo, externalId, enable, {
    from: actionAddress,
  });

  const offerLoaderFn = (): Promise<string> =>
    TeeOffers.getByExternalId(
      { externalId, creator: actionAddress },
      currentBlock.index,
      'latest',
    ).then((event) => {
      if (event && event?.offerId !== '-1') {
        return event.offerId;
      }
      throw new Error("TEE offer wasn't created. Try increasing the gas price.");
    });

  const offerId = await doWithRetries(offerLoaderFn, 10, 5000);

  return offerId;
};

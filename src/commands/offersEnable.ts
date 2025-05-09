import {
  Config as BlockchainConfig,
  Offer,
  Web3TransactionRevertedByEvmError,
} from '@super-protocol/sdk-js';
import { Wallet } from 'ethers';
import Printer from '../printer';
import ensureSufficientOfferSecDeposit from '../services/ensureSufficientOfferSecDeposit';
import initBlockchainConnectorService from '../services/initBlockchainConnector';
import { ErrorTxRevertedByEvm } from '../utils';

export type OffersEnableParams = {
  blockchainConfig: BlockchainConfig;
  actionAccountKey: string;
  authorityAccountKey: string;
  offerId: string;
  enableAutoDeposit: boolean;
};

export default async ({
  offerId,
  blockchainConfig,
  actionAccountKey,
  authorityAccountKey,
  enableAutoDeposit,
}: OffersEnableParams): Promise<void> => {
  Printer.print('Connecting to the blockchain');

  const authorityAddress = new Wallet(authorityAccountKey).address;
  const actionAddress = await initBlockchainConnectorService({
    blockchainConfig,
    actionAccountKey,
  });

  try {
    const offer = new Offer(offerId);

    if (await offer.isEnabled()) {
      Printer.print(`Offer ${offerId} is already enabled`);
      return;
    }

    await ensureSufficientOfferSecDeposit({
      actionAddress,
      contractAddress: blockchainConfig.contractAddress,
      enableAutoDeposit,
      authorityAddress,
      offerType: 'value',
      target: 'enableOffer',
    });

    await offer.enable();

    Printer.print(`Offer ${offerId} was enabled`);
  } catch (error: unknown) {
    if (error instanceof Web3TransactionRevertedByEvmError)
      throw ErrorTxRevertedByEvm(error.originalError);
    else throw error;
  }
};

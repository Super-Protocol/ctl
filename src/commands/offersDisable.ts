import {
  Config as BlockchainConfig,
  Offer,
  Web3TransactionRevertedByEvmError,
} from '@super-protocol/sdk-js';
import Printer from '../printer';
import initBlockchainConnectorService from '../services/initBlockchainConnector';
import { ErrorTxRevertedByEvm } from '../utils';

export type OffersDisableParams = {
  blockchainConfig: BlockchainConfig;
  actionAccountKey: string;
  offerId: string;
};

export default async ({
  blockchainConfig,
  actionAccountKey,
  offerId,
}: OffersDisableParams): Promise<void> => {
  Printer.print('Connecting to the blockchain');

  await initBlockchainConnectorService({
    blockchainConfig,
    actionAccountKey,
  });

  try {
    const offer = new Offer(offerId);

    const isEnabled = await offer.isEnabled();
    if (!isEnabled) {
      Printer.print(`Offer ${offerId} is already disabled`);
      return;
    }

    await offer.disable();

    Printer.print(`Offer ${offerId} was disabled`);
  } catch (error: unknown) {
    if (error instanceof Web3TransactionRevertedByEvmError)
      throw ErrorTxRevertedByEvm(error.originalError);
    else throw error;
  }
};

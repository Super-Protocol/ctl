import {
  Config as BlockchainConfig,
  TeeOffer,
  Web3TransactionRevertedByEvmError,
} from '@super-protocol/sdk-js';
import Printer from '../printer';
import initBlockchainConnectorService from '../services/initBlockchainConnector';
import { ErrorTxRevertedByEvm } from '../utils';

export type OffersDeleteOptionParams = {
  blockchainConfig: BlockchainConfig;
  actionAccountKey: string;
  offerId: string;
  optionId: string;
};

export default async (params: OffersDeleteOptionParams) => {
  Printer.print('Connecting to the blockchain');

  await initBlockchainConnectorService({
    blockchainConfig: params.blockchainConfig,
    actionAccountKey: params.actionAccountKey,
  });

  try {
    await new TeeOffer(params.offerId).deleteOption(params.optionId);

    Printer.print(`Option ${params.optionId} was deleted from offer ${params.offerId}`);
  } catch (error: any) {
    if (error instanceof Web3TransactionRevertedByEvmError)
      throw ErrorTxRevertedByEvm(error.originalError);
    else throw error;
  }
};

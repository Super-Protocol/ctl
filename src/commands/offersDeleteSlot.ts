import {
  Config as BlockchainConfig,
  Offer,
  TeeOffer,
  Web3TransactionRevertedByEvmError,
} from '@super-protocol/sdk-js';
import Printer from '../printer';
import initBlockchainConnectorService from '../services/initBlockchainConnector';
import { ErrorTxRevertedByEvm } from '../utils';

export type OffersDisableParams = {
  blockchainConfig: BlockchainConfig;
  actionAccountKey: string;
  offerId: string;
  type: 'tee' | 'value';
  slotId: string;
};

export default async (params: OffersDisableParams) => {
  Printer.print('Connecting to the blockchain');

  await initBlockchainConnectorService({
    blockchainConfig: params.blockchainConfig,
    actionAccountKey: params.actionAccountKey,
  });

  try {
    switch (params.type) {
      case 'tee':
        await new TeeOffer(params.offerId).deleteSlot(params.slotId);
        break;

      case 'value':
        await new Offer(params.offerId).deleteSlot(params.slotId);
        break;

      default:
        throw new Error(`Unknown offer type ${params.type} provided`);
    }

    Printer.print(`Slot ${params.slotId} was deleted from offer ${params.offerId}`);
  } catch (error: any) {
    if (error instanceof Web3TransactionRevertedByEvmError)
      throw ErrorTxRevertedByEvm(error.originalError);
    else throw error;
  }
};

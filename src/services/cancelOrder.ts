import { Order, Web3TransactionRevertedByEvmError } from '@super-protocol/sdk-js';
import { ErrorTxRevertedByEvm } from '../utils';

export type CancelOrderParams = {
  id: string;
};

export default async (params: CancelOrderParams): Promise<void> => {
  const order = new Order(params.id);
  try {
    await order.cancelOrder();
  } catch (error: unknown) {
    if (error instanceof Web3TransactionRevertedByEvmError)
      throw ErrorTxRevertedByEvm(error.originalError);
    else throw error;
  }
};

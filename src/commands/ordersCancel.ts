import { Config as BlockchainConfig } from '@super-protocol/sdk-js';
import Printer from '../printer';
import initBlockchainConnectorService from '../services/initBlockchainConnector';
import cancelOrderService from '../services/cancelOrder';
import checkOrderService from '../services/checkOrder';

export type OrderCancelParams = {
  blockchainConfig: BlockchainConfig;
  actionAccountKey: string;
  ids: string[];
};

export default async (params: OrderCancelParams) => {
  Printer.print('Connecting to the blockchain');
  await initBlockchainConnectorService({
    blockchainConfig: params.blockchainConfig,
    actionAccountKey: params.actionAccountKey,
  });

  for (let index = 0; index < params.ids.length; index++) {
    const id = params.ids[index];

    try {
      Printer.print(`Checking order ${id}`);
      await checkOrderService({ id });

      Printer.print(`Canceling order ${id}`);
      await cancelOrderService({ id });
      Printer.print(`Order ${id} was canceled successfully`);
    } catch (error: any) {
      Printer.print(`Order ${id} was not canceled: ${error?.message}`);
    }
  }
};

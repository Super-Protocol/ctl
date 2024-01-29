import Printer from '../printer';
import { OrderCancelParams } from './ordersCancel';
import initBlockchainConnectorService from '../services/initBlockchainConnector';
import checkOrderService from '../services/checkOrder';
import completeOrderService, {
  TerminatedOrderStatus,
  AVAILABLE_STATUSES,
} from '../services/completeOrder';
import { getObjectKey } from '../utils';
import { OrderStatus } from '@super-protocol/sdk-js';

export type OrderCompleteParams = OrderCancelParams & {
  accessToken: string;
  backendUrl: string;
  pccsApiUrl: string;
  resourcePath?: string;
  status: TerminatedOrderStatus;
};
export default async (params: OrderCompleteParams): Promise<void> => {
  Printer.print('Connecting to the blockchain');
  const consumerAddress = await initBlockchainConnectorService({
    blockchainConfig: params.blockchainConfig,
    actionAccountKey: params.actionAccountKey,
  });

  if (!consumerAddress) {
    throw Error('No account found linked to this key.');
  }

  const checkedOrders = async (ids: OrderCompleteParams['ids']): Promise<string[]> => {
    const result = await Promise.allSettled(
      ids.map((id) =>
        checkOrderService({
          id,
          statuses: AVAILABLE_STATUSES,
        }),
      ),
    );

    return result
      .map((result, index) => {
        if (result.status === 'fulfilled') {
          return ids[index];
        } else {
          Printer.print(`Order ${ids[index]} was not completed: ${result.reason}`);
          return '';
        }
      })
      .filter(Boolean);
  };

  const validOrdersIds = await checkedOrders(params.ids);
  await Promise.allSettled(
    validOrdersIds.map(async (id) => {
      try {
        await completeOrderService({
          id,
          status: params.status,
          resourcePath: params.resourcePath,
          pccsApiUrl: params.pccsApiUrl,
          backendUrl: params.backendUrl,
          accessToken: params.accessToken,
        });
        Printer.print(
          `Order ${id} has been completed successfully: status=${getObjectKey(
            params.status,
            OrderStatus,
          )}`,
        );
      } catch (err: unknown) {
        Printer.print(`Order ${id} was not completed: ${(err as Error).message}`);
      }
    }),
  );
};

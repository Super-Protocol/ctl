import { OrderInfo, Orders, OrderSlots } from '@super-protocol/sdk-js';
import doWithRetries from './doWithRetries';

export type CreateOrderParams = {
  consumerAddress: string;
  orderInfo: OrderInfo;
  slots: OrderSlots;
  deposit: string;
};

export default async (params: CreateOrderParams): Promise<string> => {
  const orderLoaderFn = async (): Promise<string> => {
    const event = await Orders.getByExternalId({
      externalId: params.orderInfo.externalId,
      consumer: params.consumerAddress,
    });

    if (event && event?.orderId !== '-1') {
      return event.orderId;
    }
    throw new Error("Order wasn't created. Try increasing the gas price.");
  };

  await Orders.createOrder(params.orderInfo, params.slots, params.deposit);

  return doWithRetries(orderLoaderFn, 10, 5000);
};

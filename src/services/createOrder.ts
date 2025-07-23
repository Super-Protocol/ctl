import { OrderInfo, Orders, OrderSlots } from '@super-protocol/sdk-js';

export type CreateOrderParams = {
  consumerAddress: string;
  orderInfo: OrderInfo;
  slots: OrderSlots;
  deposit: string;
};

export default async (params: CreateOrderParams): Promise<string> => {
  const orderId = await Orders.createOrder(params.orderInfo, params.slots, params.deposit);
  return orderId;
};

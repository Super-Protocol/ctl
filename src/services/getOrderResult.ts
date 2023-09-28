import { Order } from '@super-protocol/sdk-js';

export type GetOrderResultParams = {
  orderId: string;
};

const getOrderResult = async (params: GetOrderResultParams) => {
  const order = new Order(params.orderId);
  return order.getOrderResult();
};

export default getOrderResult;

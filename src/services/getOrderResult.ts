import { Order, OrderResult } from '@super-protocol/sdk-js';

export type GetOrderResultParams = {
  orderId: string;
};

export class OrderResultError extends Error {
  constructor(message: string) {
    const detailed = message ? ` Error: ${message}` : '';
    super(`Failed to get order result.${detailed}`);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

const getOrderResult = async (params: GetOrderResultParams): Promise<OrderResult> => {
  const order = new Order(params.orderId);
  try {
    return await order.getOrderResult();
  } catch (err) {
    throw new OrderResultError((err as Error).message);
  }
};

export default getOrderResult;

import { Order } from "@super-protocol/sp-sdk-js";

export type CancelOrderParams = {
    address: string;
};

export default async (params: CancelOrderParams) => {
    const order = new Order(params.address);
    await order.cancelOrder();
};

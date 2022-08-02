import { Order } from "@super-protocol/sdk-js";

export type CancelOrderParams = {
    id: string;
};

export default async (params: CancelOrderParams) => {
    const order = new Order(params.id);
    await order.cancelOrder();
};

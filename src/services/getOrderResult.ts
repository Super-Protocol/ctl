import { Order } from "@super-protocol/sp-sdk-js";

export type GetOrderResultParams = {
    orderId: string;
};

const getOrderResult = async (params: GetOrderResultParams) => {
    const order = new Order(params.orderId);
    return await order.getOrderResult();
};

export default getOrderResult;

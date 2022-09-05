import { Order, OrderStatus } from "@super-protocol/sdk-js";

export type CheckOrderParams = {
    id: string;
    statuses?: OrderStatus[];
};

const checkOrder = async (params: CheckOrderParams) => {
    const order = new Order(params.id);
    if (!(await order.isExist())) {
        throw Error("Order does not exist");
    }

    if (params.statuses?.length) {
        const info = await order.getOrderInfo();

        if (!params.statuses.includes(info.status)) {
            throw new Error("Can't execute in the current order status");
        }
    }
};

export default checkOrder;

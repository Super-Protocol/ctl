import { Order } from "@super-protocol/sdk-js";

export type CheckOrderParams = {
    id: string;
};

const checkOrder = async (params: CheckOrderParams) => {
    const order = new Order(params.id);
    if (!(await order.isExist())) {
        throw Error("Order does not exist");
    }
};

export default checkOrder;

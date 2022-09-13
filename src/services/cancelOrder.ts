import { Order } from "@super-protocol/sdk-js";
import { TX_REVERTED_BY_EVM_ERROR } from "../constants";
import { ErrorTxRevertedByEvm, ErrorWithCustomMessage } from "../utils";

export type CancelOrderParams = {
    id: string;
};

export default async (params: CancelOrderParams) => {
    const order = new Order(params.id);
    try {
        await order.cancelOrder();
    } catch (error: any) {
        if (error.message?.includes(TX_REVERTED_BY_EVM_ERROR)) throw ErrorTxRevertedByEvm(error);
        else throw error;
    }
};

import { Order } from "@super-protocol/sdk-js";
import { Web3TransactionRevertedByEvmError } from "@super-protocol/sdk-js/build/utils/TxManager";
import { ErrorTxRevertedByEvm } from "../utils";

export type CancelOrderParams = {
    id: string;
};

export default async (params: CancelOrderParams) => {
    const order = new Order(params.id);
    try {
        await order.cancelOrder();
    } catch (error: any) {
        if (error instanceof Web3TransactionRevertedByEvmError) throw ErrorTxRevertedByEvm(error);
        else throw error;
    }
};

import { Orders, SuperproToken } from "@super-protocol/sdk-js";
import { TX_REVERTED_BY_EVM_ERROR } from "../constants";
import { ErrorTxRevertedByEvm } from "../utils";

export type OrderReplenishDepositParams = {
    id: string;
    amount: string;
};

export default async (params: OrderReplenishDepositParams) => {
    try {
        await SuperproToken.approve(Orders.address, params.amount);
        await Orders.refillOrderDeposit(params.id, params.amount);
    } catch (error: any) {
        if (error.message?.includes(TX_REVERTED_BY_EVM_ERROR)) throw ErrorTxRevertedByEvm(error);
        else throw error;
    }
};

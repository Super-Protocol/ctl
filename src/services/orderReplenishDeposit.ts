import { Orders, SuperproToken, Web3TransactionRevertedByEvmError } from "@super-protocol/sdk-js";
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
        if (error instanceof Web3TransactionRevertedByEvmError) throw ErrorTxRevertedByEvm(error);
        else throw error;
    }
};

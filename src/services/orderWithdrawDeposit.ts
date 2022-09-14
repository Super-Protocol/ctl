import { Order } from "@super-protocol/sdk-js";
import { BigNumber } from "ethers";
import { TX_REVERTED_BY_EVM_ERROR } from "../constants";
import { ErrorTxRevertedByEvm } from "../utils";

export type OrderWithdrawDepositParams = {
    id: string;
};

export default async (params: OrderWithdrawDepositParams): Promise<BigNumber> => {
    const order = new Order(params.id);

    try {
        const unspentDeposit = BigNumber.from(await order.calculateTotalDepositUnspent());
        if (unspentDeposit.gt(0)) {
            await order.withdrawChange();
        }
        return unspentDeposit;
    } catch (error: any) {
        if (error.message?.includes(TX_REVERTED_BY_EVM_ERROR)) throw ErrorTxRevertedByEvm(error);
        else throw error;
    }
};

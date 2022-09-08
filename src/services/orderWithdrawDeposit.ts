import { Order, OrderStatus } from "@super-protocol/sdk-js";

export type OrderWithdrawDepositParams = {
    id: string;
};

export default async (params: OrderWithdrawDepositParams) => {
    const order = new Order(params.id);

    const unspentDeposit = await order.calculateTotalDepositUnspent();
    if (unspentDeposit === "0") {
        throw new Error("Nothing to withdraw. Unspent value is 0");
    }

    await order.withdrawChange();
};

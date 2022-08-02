import { OrdersFactory, SuperproToken } from "@super-protocol/sdk-js";

export type OrderReplenishDepositParams = {
    id: string;
    amount: string;
};

export default async (params: OrderReplenishDepositParams) => {
    await SuperproToken.approve(OrdersFactory.address, params.amount);
    await OrdersFactory.refillOrderDeposit(params.id, params.amount);
};

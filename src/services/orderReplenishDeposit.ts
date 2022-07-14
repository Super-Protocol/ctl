import { OrdersFactory, SuperproToken } from "@super-protocol/sp-sdk-js";

export type OrderReplenishDepositParams = {
    address: string;
    amount: string;
};

export default async (params: OrderReplenishDepositParams) => {
    await SuperproToken.approve(OrdersFactory.address, params.amount);
    await OrdersFactory.refillOrderDeposit(params.address, params.amount);
};

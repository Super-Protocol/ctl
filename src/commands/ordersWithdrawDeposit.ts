import { Config as BlockchainConfig, OrderStatus } from "@super-protocol/sdk-js";
import Printer from "../printer";
import initBlockchainConnectorService from "../services/initBlockchainConnector";
import orderWithdrawDepositService from "../services/orderWithdrawDeposit";
import checkOrderService from "../services/checkOrder";

export type OrderWithdrawDepositParams = {
    blockchainConfig: BlockchainConfig;
    actionAccountKey: string;
    id: string;
};

export default async (params: OrderWithdrawDepositParams) => {
    Printer.print("Connecting to the blockchain");
    await initBlockchainConnectorService({
        blockchainConfig: params.blockchainConfig,
        actionAccountKey: params.actionAccountKey,
    });

    Printer.print("Checking if order the exists");
    await checkOrderService({
        id: params.id,
        statuses: [OrderStatus.Canceled, OrderStatus.Done, OrderStatus.Error, OrderStatus.Canceling],
    });

    Printer.print("Withdrawing deposit");
    await orderWithdrawDepositService({
        id: params.id,
    });
    Printer.print(`Deposit for order ${params.id} has been withdrawn successfully`);
};

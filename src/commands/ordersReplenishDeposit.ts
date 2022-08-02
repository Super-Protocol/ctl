import { Config as BlockchainConfig } from "@super-protocol/sdk-js";
import Printer from "../printer";
import initBlockchainConnectorService from "../services/initBlockchainConnector";
import orderReplenishDepositService from "../services/orderReplenishDeposit";
import checkOrderService from "../services/checkOrder";

export type OrderReplenishDepositParams = {
    blockchainConfig: BlockchainConfig;
    actionAccountKey: string;
    id: string;
    amount: string;
};

export default async (params: OrderReplenishDepositParams) => {
    Printer.print("Connecting to blockchain...");
    await initBlockchainConnectorService({
        blockchainConfig: params.blockchainConfig,
        actionAccountKey: params.actionAccountKey,
    });

    Printer.print("Connected successfully, checking if order exists...");
    await checkOrderService({ id: params.id });

    Printer.print("Order found, replenishing order deposit...");
    await orderReplenishDepositService({
        id: params.id,
        amount: params.amount,
    });
    Printer.print(`Deposit for order ${params.id} has been replenished successfully by ${params.amount} tokens`);
};

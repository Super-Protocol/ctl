import { Config as BlockchainConfig } from "@super-protocol/sp-sdk-js";
import Printer from "../printer";
import initBlockchainConnectorService from "../services/initBlockchainConnector";
import orderReplenishDepositService from "../services/orderReplenishDeposit";
import checkOrderService from "../services/checkOrder";

export type OrderReplenishDepositParams = {
    blockchainConfig: BlockchainConfig;
    actionAccountKey: string;
    address: string;
    amount: string;
};

export default async (params: OrderReplenishDepositParams) => {
    Printer.print("Connecting to blockchain...");
    await initBlockchainConnectorService({
        blockchainConfig: params.blockchainConfig,
        actionAccountKey: params.actionAccountKey,
    });

    Printer.print("Connected successfully, checking if order exists...");
    await checkOrderService({ address: params.address });

    Printer.print("Order found, replenishing order deposit...");
    await orderReplenishDepositService({
        address: params.address,
        amount: params.amount,
    });
    Printer.print(`Deposit for order ${params.address} has been replenished successfully by ${params.amount} tokens`);
};

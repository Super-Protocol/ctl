import { Config as BlockchainConfig } from "@super-protocol/sp-sdk-js";
import Printer from "../printer";
import initBlockchainConnector from "../services/initBlockchainConnector";
import orderReplenishDeposit from "../services/orderReplenishDeposit";

export type OrderReplenishDepositParams = {
    blockchainConfig: BlockchainConfig;
    actionAccountKey: string;
    address: string;
    amount: number;
};

export default async (params: OrderReplenishDepositParams) => {
    Printer.print("Connecting to blockchain...");
    await initBlockchainConnector({
        blockchainConfig: params.blockchainConfig,
        actionAccountKey: params.actionAccountKey,
    });

    Printer.print("Connected successfully, replenishing order deposit...");
    await orderReplenishDeposit({
        address: params.address,
        amount: params.amount,
    });
    Printer.print(`Deposit for order ${params.address} has been replenished successfully by ${params.amount} tokens`);
};

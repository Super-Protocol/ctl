import { Config as BlockchainConfig } from "@super-protocol/sp-sdk-js";
import Printer from "../printer";
import initBlockchainConnector from "../services/initBlockchainConnector";
import cancelOrder from "../services/cancelOrder";

export type OrderCancelParams = {
    blockchainConfig: BlockchainConfig;
    actionAccountKey: string;
    address: string;
};

export default async (params: OrderCancelParams) => {
    Printer.print("Connecting to blockchain...");
    await initBlockchainConnector({
        blockchainConfig: params.blockchainConfig,
        actionAccountKey: params.actionAccountKey,
    });

    Printer.print("Connected successfully, canceling order...");
    await cancelOrder({ address: params.address });
    Printer.print(`Order ${params.address} has been successfully canceled`);
};

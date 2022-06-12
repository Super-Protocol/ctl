import { Config as BlockchainConfig } from "@super-protocol/sp-sdk-js";
import Printer from "../printer";
import initBlockchainConnectorService from "../services/initBlockchainConnector";
import cancelOrderService from "../services/cancelOrder";
import checkOrderService from "../services/checkOrder";

export type OrderCancelParams = {
    blockchainConfig: BlockchainConfig;
    actionAccountKey: string;
    address: string;
};

export default async (params: OrderCancelParams) => {
    Printer.print("Connecting to blockchain...");
    await initBlockchainConnectorService({
        blockchainConfig: params.blockchainConfig,
        actionAccountKey: params.actionAccountKey,
    });

    Printer.print("Connected successfully, checking if order exists...");
    await checkOrderService({ address: params.address });

    Printer.print("Order found, canceling order...");
    await cancelOrderService({ address: params.address });
    Printer.print(`Order ${params.address} has been successfully canceled`);
};

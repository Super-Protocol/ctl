import { Config as BlockchainConfig } from "@super-protocol/sp-sdk-js";
import Printer from "../printer";
import initBlockchainConnectorService from "../services/initBlockchainConnector";
import cancelOrderService from "../services/cancelOrder";
import checkOrderService from "../services/checkOrder";

export type OrderCancelParams = {
    blockchainConfig: BlockchainConfig;
    actionAccountKey: string;
    id: string;
};

export default async (params: OrderCancelParams) => {
    Printer.print("Connecting to the blockchain");
    await initBlockchainConnectorService({
        blockchainConfig: params.blockchainConfig,
        actionAccountKey: params.actionAccountKey,
    });

    Printer.print("Checking if the order exists");
    await checkOrderService({ id: params.id });

    Printer.print("Canceling order");
    await cancelOrderService({ id: params.id });
    Printer.print(`Order ${params.id} was canceled successfully`);
};

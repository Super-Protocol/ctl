import { Config as BlockchainConfig } from "@super-protocol/sdk-js";
import Printer from "../printer";
import initBlockchainConnectorService from "../services/initBlockchainConnector";
import orderReplenishDepositService from "../services/orderReplenishDeposit";
import checkOrderService from "../services/checkOrder";
import { etherToWei } from "../utils";

export type OrderReplenishDepositParams = {
    blockchainConfig: BlockchainConfig;
    actionAccountKey: string;
    id: string;
    amount: string;
};

export default async (params: OrderReplenishDepositParams) => {
    Printer.print("Connecting to the blockchain");
    await initBlockchainConnectorService({
        blockchainConfig: params.blockchainConfig,
        actionAccountKey: params.actionAccountKey,
    });

    Printer.print("Checking if the order exists");
    await checkOrderService({ id: params.id });

    Printer.print("Replenishing order deposit");
    await orderReplenishDepositService({
        id: params.id,
        amount: etherToWei(params.amount).toString(),
    });
    Printer.print(`Deposit for order ${params.id} was replenished with ${params.amount} tokens`);
};

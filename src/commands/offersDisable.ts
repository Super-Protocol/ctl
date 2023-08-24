import { Config as BlockchainConfig, Offer, Web3TransactionRevertedByEvmError } from "@super-protocol/sdk-js";
import Printer from "../printer";
import initBlockchainConnectorService from "../services/initBlockchainConnector";
import { ErrorTxRevertedByEvm } from "../utils";

export type OffersDisableParams = {
    blockchainConfig: BlockchainConfig;
    actionAccountKey: string;
    id: string;
};

export default async (params: OffersDisableParams) => {
    Printer.print("Connecting to the blockchain");

    await initBlockchainConnectorService({
        blockchainConfig: params.blockchainConfig,
        actionAccountKey: params.actionAccountKey,
    });

    try {
        await new Offer(params.id).disable();

        Printer.print(`Offer ${params.id} was disabled`);
    } catch (error: any) {
        if (error instanceof Web3TransactionRevertedByEvmError) throw ErrorTxRevertedByEvm(error);
        else throw error;
    }
};

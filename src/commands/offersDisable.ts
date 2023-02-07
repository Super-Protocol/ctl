import { Config as BlockchainConfig, Offer } from "@super-protocol/sdk-js";
import { TX_REVERTED_BY_EVM_ERROR } from "../constants";
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
        if (error.message?.includes(TX_REVERTED_BY_EVM_ERROR)) throw ErrorTxRevertedByEvm(error);
        else throw error;
    }
};

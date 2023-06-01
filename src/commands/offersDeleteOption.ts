import {
    Config as BlockchainConfig,
    TeeOffer,
} from "@super-protocol/sdk-js";
import { TX_REVERTED_BY_EVM_ERROR } from "../constants";
import Printer from "../printer";
import initBlockchainConnectorService from "../services/initBlockchainConnector";
import { ErrorTxRevertedByEvm } from "../utils";

export type OffersDeleteOptionParams = {
    blockchainConfig: BlockchainConfig;
    actionAccountKey: string;
    offerId: string;
    optionId: string;
};

export default async (params: OffersDeleteOptionParams) => {
    Printer.print("Connecting to the blockchain");

    await initBlockchainConnectorService({
        blockchainConfig: params.blockchainConfig,
        actionAccountKey: params.actionAccountKey,
    });

    try {
        await new TeeOffer(params.offerId).deleteOption(params.optionId);

        Printer.print(`Option ${params.optionId} was deleted from offer ${params.offerId}`);
    } catch (error: any) {
        if (error.message?.includes(TX_REVERTED_BY_EVM_ERROR))
            throw ErrorTxRevertedByEvm(error);
        else throw error;
    }
};

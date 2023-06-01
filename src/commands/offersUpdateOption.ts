import {
    Config as BlockchainConfig,
    TeeOffer,
} from "@super-protocol/sdk-js";
import Printer from "../printer";
import initBlockchainConnector from "../services/initBlockchainConnector";
import readOfferOption from "../services/readOfferOption";

export type OffersUpdateOptionParams = {
    offerId: string;
    optionId: string;
    optionPath: string;
    blockchainConfig: BlockchainConfig;
    actionAccountKey: string;
};

export default async (params: OffersUpdateOptionParams) => {
    await initBlockchainConnector({
        blockchainConfig: params.blockchainConfig,
        actionAccountKey: params.actionAccountKey,
    });

    const option = await readOfferOption({
        path: params.optionPath,
    });

    Printer.print("Option info file was read successfully, updating in blockchain");

    const teeOffer = new TeeOffer(params.offerId);
    await teeOffer.updateOption(
        params.optionId,
        option.optionInfo,
        option.optionUsage,
    );

    Printer.print(`Option ${params.optionId} was updated successfully`);
};

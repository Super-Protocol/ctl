import BlockchainConnector, { Config as BlockchainConfig, Offer, Provider, TeeOffer } from "@super-protocol/sdk-js";
import { TX_REVERTED_BY_EVM_ERROR } from "../constants";
import Printer from "../printer";
import initBlockchainConnectorService from "../services/initBlockchainConnector";
import readJsonFile from "../services/readJsonFile";
import { ErrorTxRevertedByEvm, preparePath } from "../utils";

export type OfferEnableAllParams = {
    blockchainConfig: BlockchainConfig;
    providersPath: string;
};

export default async (params: OfferEnableAllParams) => {
    Printer.print("Connecting to the blockchain");

    await initBlockchainConnectorService({
        blockchainConfig: params.blockchainConfig,
    });

    try {
        const providers: { actionKey: string; authorityAccount: string }[] = await readJsonFile({ path: preparePath(params.providersPath) });

        for (const { actionKey, authorityAccount } of providers) {
            Printer.print(`Enabling offers of authority account: ${authorityAccount}`);

            const actionAccount = await BlockchainConnector.getInstance().initializeActionAccount(actionKey);

            const provider = new Provider(authorityAccount);
            const valueOffers = await provider.getValueOffers();
            const teeOffers = await provider.getTeeOffers();

            if (valueOffers.length) {
                const results = await Promise.allSettled(valueOffers.map(offer => new Offer(offer).enable({ from: actionAccount })));
                results.forEach((res, index) => Printer.print(`Value offer ${valueOffers[index]} was ${res.status === "fulfilled" ? "" : "not "}enabled`))
            }
            if (teeOffers.length) {
                const results = await Promise.allSettled(teeOffers.map(offer => new TeeOffer(offer).enable({ from: actionAccount })));
                results.forEach((res, index) => Printer.print(`Tee offer ${teeOffers[index]} was ${res.status === "fulfilled" ? "" : "not "}enabled`))
            }
        }
    } catch (error: any) {
        if (error.message?.includes(TX_REVERTED_BY_EVM_ERROR)) throw ErrorTxRevertedByEvm(error);
        else throw error;
    }
};

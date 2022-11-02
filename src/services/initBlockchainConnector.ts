import BlockchainConnector, { Config as BlockchainConfig } from "@super-protocol/sdk-js";
import Printer from "../printer";
import { sleep } from "../utils";
import { MAX_ATTEMPT_WAITING_OLD_TXS, ATTEMPT_PERIOD_MS } from "../constants";

export type InitBlockchainConnectorParams = {
    blockchainConfig: BlockchainConfig;
    actionAccountKey?: string;
};

const pendingStatusChecker = async (pk: string): Promise<number> => {
    const address = BlockchainConnector.getInstance().getAddressByKey(pk);
    return (
        (await BlockchainConnector.getInstance().getTransactionCount(address, "pending")) -
        (await BlockchainConnector.getInstance().getTransactionCount(address, "latest"))
    );
};

const checkPendingLoop = async (pk: string): Promise<void> => {
    let attempt = 0;
    let pendingAmount = await pendingStatusChecker(pk);
    while (pendingAmount > 0) {
        Printer.progress(
            `Waiting for ${pendingAmount} pending transactions will be completed, before start`,
            MAX_ATTEMPT_WAITING_OLD_TXS,
            attempt
        );
        await sleep(ATTEMPT_PERIOD_MS);
        ++attempt;

        if (MAX_ATTEMPT_WAITING_OLD_TXS == attempt) {
            Printer.stopProgress();
            throw new Error(
                "Your private key may be in use by another application or the blockchain is overloaded, please try again later"
            );
        }

        pendingAmount = await pendingStatusChecker(pk);
    }
};

export default async (params: InitBlockchainConnectorParams): Promise<string | void> => {
    await BlockchainConnector.getInstance().initialize(params.blockchainConfig);

    if (params.actionAccountKey) {
        await checkPendingLoop(params.actionAccountKey);
        return BlockchainConnector.getInstance().initializeActionAccount(params.actionAccountKey);
    }
};

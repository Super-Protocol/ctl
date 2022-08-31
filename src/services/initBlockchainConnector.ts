import BlockchainConnector, { Config as BlockchainConfig } from "@super-protocol/sdk-js";
import Printer from "../printer";

export type InitBlockchainConnectorParams = {
    blockchainConfig: BlockchainConfig;
    actionAccountKey?: string;
};

const MAX_ATTEMPT = 20;
const ATTEMPT_PERIOD_MS = 3000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const pendingStatusChecker = async (pk: string): Promise<number> => {
    const address = BlockchainConnector.getAddressByKey(pk);
    return (
        (await BlockchainConnector.getTransactionCount(address, "pending")) -
        (await BlockchainConnector.getTransactionCount(address, "latest"))
    );
};

const checkPendingLoop = async (pk: string): Promise<void> => {
    let attempt = 0;
    let pendingAmount = await pendingStatusChecker(pk);
    while (pendingAmount > 0) {
        Printer.progress(
            `Waiting for ${pendingAmount} pending transactions will be completed, before start`,
            MAX_ATTEMPT,
            attempt
        );
        await sleep(ATTEMPT_PERIOD_MS);
        ++attempt;

        if (MAX_ATTEMPT == attempt) {
            Printer.stopProgress();
            throw new Error(
                "You may be using this private key in parallel in another app or the blockchain network is now overloaded. Please, try again later."
            );
        }

        pendingAmount = await pendingStatusChecker(pk);
    }
};

export default async (params: InitBlockchainConnectorParams): Promise<string | void> => {
    await BlockchainConnector.init(params.blockchainConfig);

    if (params.actionAccountKey) {
        await checkPendingLoop(params.actionAccountKey);
        return BlockchainConnector.initActionAccount(params.actionAccountKey);
    }
};

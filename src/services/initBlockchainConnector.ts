import BlockchainConnector, { Config as BlockchainConfig } from "@super-protocol/sdk-js";

export type InitBlockchainConnectorParams = {
    blockchainConfig: BlockchainConfig;
    actionAccountKey?: string;
};

export default async (params: InitBlockchainConnectorParams): Promise<string | void> => {
    await BlockchainConnector.init(params.blockchainConfig);
    if (params.actionAccountKey) {
        return BlockchainConnector.initActionAccount(params.actionAccountKey);
    }
};

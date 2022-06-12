import BlockchainConnector, { Config as BlockchainConfig } from "@super-protocol/sp-sdk-js";

export type InitBlockchainConnectorParams = {
    blockchainConfig: BlockchainConfig;
    actionAccountKey: string;
};

export default async (params: InitBlockchainConnectorParams): Promise<string> => {
    await BlockchainConnector.init(params.blockchainConfig);
    return BlockchainConnector.initActionAccount(params.actionAccountKey);
};

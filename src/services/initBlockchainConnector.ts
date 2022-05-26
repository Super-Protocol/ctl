import BlockchainConnector, { Config as BlockchainConfig } from "@super-protocol/sp-sdk-js";

export type InitBlockchainConnectorParams = {
    blockchainConfig: BlockchainConfig;
    actionAccountKey: string;
};

export default async (params: InitBlockchainConnectorParams) => {
    await BlockchainConnector.init(params.blockchainConfig);
    await BlockchainConnector.initActionAccount(params.actionAccountKey);
};

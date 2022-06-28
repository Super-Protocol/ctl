import { Wallet } from "ethers";
import getMumbaiBalanceService from "../services/getMumbaiBalance";
import getTeeBalanceService from "../services/getTeeBalance";
import Printer from "../printer";
import { Config as BlockchainConfig } from "@super-protocol/sp-sdk-js/build/BlockchainConnector";
import initBlockchainConnectorService from "../services/initBlockchainConnector";

export type TokensBalanceParams = {
    blockchainConfig: BlockchainConfig;
    actionAccountPrivateKey: string;
    balanceTee?: boolean;
    balanceMatic?: boolean;
};

export default async (params: TokensBalanceParams) => {
    if (!params.balanceTee && !params.balanceMatic) {
        Printer.print(
            "No token to request balance specified, please add flag --tee or --matic to request balance of specific token"
        );
        return;
    }

    const address = new Wallet(params.actionAccountPrivateKey).address;

    Printer.print("Connecting to blockchain...");
    await initBlockchainConnectorService({ blockchainConfig: params.blockchainConfig });

    if (params.balanceTee) {
        Printer.print("Fetching SuperProtocol TEE tokens balance...");
        const balance = await getTeeBalanceService({ address });
        Printer.print(`Balance of ${address} - ${balance} TEE`);
    }

    if (params.balanceMatic) {
        Printer.print("Fetching polygon mumbai matic tokens balance...");
        const balance = await getMumbaiBalanceService({ address });
        Printer.print(`Balance of ${address} - ${balance} MATIC`);
    }
};

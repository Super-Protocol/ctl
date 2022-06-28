import { Wallet } from "ethers";
import requestTeeService from "../services/requestTee";
import requestMaticService from "../services/requestMatic";
import Printer from "../printer";

export type TokensRequestParams = {
    actionAccountPrivateKey: string;
    backendUrl?: string;
    requestMatic?: boolean;
};

export default async (params: TokensRequestParams) => {
    if (!params.backendUrl && !params.requestMatic) {
        Printer.print("No tokens to request specified, please add flag --tee or --matic to request specific tokens");
        return;
    }

    const address = new Wallet(params.actionAccountPrivateKey).address;

    if (params.backendUrl) {
        Printer.print(`Requesting SuperProtocol TEE tokens on ${address}...`);
        await requestTeeService({
            backendUrl: params.backendUrl,
            address,
        });
        Printer.print(`SuperProtocol TEE tokens successfully requested on ${address}`);
    }

    if (params.requestMatic) {
        Printer.print(`Requesting polygon mumbai matic tokens on ${address}...`);
        await requestMaticService({ address });
        Printer.print(`Polygon mumbai matic tokens successfully requested on ${address}`);
    }
};

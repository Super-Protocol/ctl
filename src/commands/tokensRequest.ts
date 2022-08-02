import { Wallet } from "ethers";
import requestTeeService from "../services/requestTee";
import requestMaticService from "../services/requestMatic";
import Printer from "../printer";

export type TokensRequestParams = {
    actionAccountPrivateKey: string;
    backendUrl: string;
    accessToken: string;
    requestMatic?: boolean;
    requestTee?: boolean;
};

export default async (params: TokensRequestParams) => {
    if (!params.backendUrl && !params.requestMatic) {
        Printer.print("No tokens specified for request, please add --tee or --matic flag to request specific tokens");
        return;
    }

    const address = new Wallet(params.actionAccountPrivateKey).address;

    if (params.requestTee) {
        Printer.print(`Requesting SuperProtocol TEE tokens on ${address}...`);
        await requestTeeService({
            backendUrl: params.backendUrl,
            accessToken: params.accessToken,
        });
        Printer.print(`SuperProtocol TEE tokens successfully requested to ${address}`);
    }

    if (params.requestMatic) {
        Printer.print(`Requesting Polygon Mumbai MATIC tokens on ${address}...`);
        await requestMaticService({
            backendUrl: params.backendUrl,
            accessToken: params.accessToken,
        });
        Printer.print(`Polygon Mumbai MATIC tokens successfully requested on ${address}`);
    }
};

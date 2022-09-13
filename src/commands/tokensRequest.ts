import { Wallet } from "ethers";
import requestTeeService from "../services/requestTee";
import requestMaticService from "../services/requestMatic";
import Printer from "../printer";
import { program } from "commander";

export type TokensRequestParams = {
    actionAccountPrivateKey: string;
    backendUrl: string;
    accessToken: string;
    requestMatic?: boolean;
    requestTee?: boolean;
};

export default async (params: TokensRequestParams) => {
    if (!params.requestTee && !params.requestMatic) {
        Printer.print("No token type was specified, please add --tee or --matic flag to request specific tokens");
        program.help();
    }

    const address = new Wallet(params.actionAccountPrivateKey).address;

    if (params.requestTee) {
        Printer.print(`Requesting Super Protocol TEE tokens for ${address}`);
        await requestTeeService({
            backendUrl: params.backendUrl,
            accessToken: params.accessToken,
        });
        Printer.print(`TEE tokens will be transferred to ${address} shortly`);
    }

    if (params.requestMatic) {
        Printer.print(`Requesting Polygon Mumbai MATIC tokens for ${address}`);
        await requestMaticService({
            backendUrl: params.backendUrl,
            accessToken: params.accessToken,
        });
        Printer.print(`MATIC tokens will be transferred to ${address} shortly`);
    }
};

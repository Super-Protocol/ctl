import axios from "axios";
import { ErrorWithCustomMessage } from "../utils";

export type RequestMaticParams = {
    address: string;
};

export default async (params: RequestMaticParams) => {
    try {
        const response = await axios({
            method: "POST",
            url: "https://api.faucet.matic.network/transferTokens",
            data: {
                address: params.address,
                network: "mumbai",
                token: "maticToken",
            },
            transitional: {
                silentJSONParsing: true,
            },
        });

        if (response.data.error) throw { response };
    } catch (e: any) {
        let message = "Error during matic tokens request";
        if (e.response.data.duration)
            message += `\n Too many requests, try again in ${e.response.data.duration / 1000} seconds`;
        throw ErrorWithCustomMessage(message, (e.response?.data || e) as Error);
    }
};

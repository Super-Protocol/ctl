import fetchProviders from "../services/fetchProviders";
import Printer from "../printer";
import { snakeToCamel } from "../utils";

export type ProvidersGetParams = {
    backendUrl: string;
    fields: string[];
    id: string;
};

export default async (params: ProvidersGetParams) => {
    const providers = await fetchProviders({
        backendUrl: params.backendUrl,
        limit: 1,
        id: params.id,
    });

    const provider = providers.list[0];

    params.fields.forEach((key) => {
        // @ts-ignore
        Printer.print(`${key}: ${provider[snakeToCamel(key)]}`);
    });
};

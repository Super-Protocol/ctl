import fetchProviders from "../services/fetchProvidersGQL";
import Printer from "../printer";
import { snakeToCamel } from "../utils";

export type ProviderListParams = {
    backendUrl: string;
    fields: string[];
    id: string;
};

export default async (params: ProviderListParams) => {
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

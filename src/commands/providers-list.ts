import fetchProviders from "../services/fetchProvidersGQL";
import Printer from "../printer";
import { snakeToCamel } from "../utils";

export type ProviderListParams = {
    backendUrl: string;
    fields: string[];
    limit: number;
    cursor?: string;
};

export default async (params: ProviderListParams) => {
    const providers = await fetchProviders({
        backendUrl: params.backendUrl,
        limit: params.limit,
        cursor: params.cursor,
    });

    const rows = providers.list.map((item) => {
        const row: { [key: string]: any } = {};
        params.fields.forEach((key) => {
            // @ts-ignore keep only requested fields
            row[key] = item[snakeToCamel(key)];
        });
        return row;
    });

    Printer.table(rows);
    Printer.print("Last pagination cursor: " + providers.cursor);
};

import fetchProviders from "../services/fetchProviders";
import Printer from "../printer";
import { prepareObjectToPrint } from "../utils";

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

    const rows = providers.list.map((item) => prepareObjectToPrint(item, params.fields));

    Printer.table(rows);
    Printer.print("Last pagination cursor: " + providers.cursor);
};

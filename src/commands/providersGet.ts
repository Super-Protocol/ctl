import fetchProviders from "../services/fetchProviders";
import Printer from "../printer";
import { prepareObjectToPrint } from "../utils";

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

    if (!providers.list.length) {
        Printer.print(`Provider ${params.id} not found`);
        return;
    }

    const provider = prepareObjectToPrint(providers.list[0], params.fields);
    Printer.printObject(provider);
};

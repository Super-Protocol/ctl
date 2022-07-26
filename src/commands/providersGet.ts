import fetchProvidersService from "../services/fetchProviders";
import Printer from "../printer";
import { prepareObjectToPrint } from "../utils";

export type ProvidersGetParams = {
    backendUrl: string;
    accessToken: string;
    fields: string[];
    id: string;
};

export default async (params: ProvidersGetParams) => {
    const providers = await fetchProvidersService({
        backendUrl: params.backendUrl,
        accessToken: params.accessToken,
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

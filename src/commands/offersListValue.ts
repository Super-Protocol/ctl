import fetchOffersService from "../services/fetchOffers";
import Printer from "../printer";
import { prepareObjectToPrint } from "../utils";

export type OffersListValueParams = {
    backendUrl: string;
    accessToken: string;
    fields: string[];
    limit: number;
    cursor?: string;
};

export default async (params: OffersListValueParams) => {
    const offers = await fetchOffersService({
        backendUrl: params.backendUrl,
        accessToken: params.accessToken,
        limit: params.limit,
        cursor: params.cursor,
    });

    if (!offers.list.length) {
        Printer.print("No value offers found");
        return;
    }

    const rows = offers.list.map((item) => prepareObjectToPrint(item, params.fields));

    Printer.table(rows);
    Printer.print("Last pagination cursor: " + offers.cursor);
};

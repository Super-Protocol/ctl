import fetchTeeOffersService from "../services/fetchTeeOffers";
import Printer from "../printer";
import { prepareObjectToPrint } from "../utils";

export type OffersListTeeParams = {
    backendUrl: string;
    fields: string[];
    limit: number;
    cursor?: string;
};

export default async (params: OffersListTeeParams) => {
    const offers = await fetchTeeOffersService({
        backendUrl: params.backendUrl,
        limit: params.limit,
        cursor: params.cursor,
    });

    const rows = offers.list.map((item) => prepareObjectToPrint(item, params.fields));

    Printer.table(rows);
    Printer.print("Last pagination cursor: " + offers.cursor);
};

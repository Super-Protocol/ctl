import fetchOrdersService from "../services/fetchOrders";
import Printer from "../printer";
import { prepareObjectToPrint } from "../utils";

export type OrdersListParams = {
    backendUrl: string;
    accessToken: string;
    fields: string[];
    limit: number;
    cursor?: string;
};

export default async (params: OrdersListParams) => {
    const orders = await fetchOrdersService({
        backendUrl: params.backendUrl,
        accessToken: params.accessToken,
        limit: params.limit,
        cursor: params.cursor,
    });

    const rows = orders.list.map((item) => prepareObjectToPrint(item, params.fields));

    Printer.table(rows);
    Printer.print("Last pagination cursor: " + orders.cursor);
};

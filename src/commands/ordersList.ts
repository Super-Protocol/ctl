import fetchOrdersService from "../services/fetchOrders";
import Printer from "../printer";
import { prepareObjectToPrint } from "../utils";
import { Wallet } from "ethers";
import { OfferType } from "@super-protocol/sdk-js";

export type OrdersListParams = {
    backendUrl: string;
    accessToken: string;
    fields: string[];
    limit: number;
    cursor?: string;
    actionAccountKey?: string;
    offerType?: keyof OfferType;
};

export default async (params: OrdersListParams) => {
    const orders = await fetchOrdersService({
        backendUrl: params.backendUrl,
        accessToken: params.accessToken,
        limit: params.limit,
        cursor: params.cursor,
        customerAddress: params.actionAccountKey ? new Wallet(params.actionAccountKey).address : undefined,
        offerType: params.offerType,
    });

    if (!orders.list.length) {
        Printer.print("No orders found");
        return;
    }

    const rows = orders.list.map((item) => prepareObjectToPrint(item, params.fields));

    Printer.table(rows);
    Printer.print("Last pagination cursor: " + orders.cursor);
};

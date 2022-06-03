import fetchOrders from "../services/fetchOrders";
import Printer from "../printer";
import { prepareObjectToPrint, prepareObjectToPrint } from "../utils";

export type OrdersGetParams = {
    backendUrl: string;
    fields: string[];
    subOrdersFields: string[];
    id: string;
};

export default async (params: OrdersGetParams) => {
    const orders = await fetchOrders({
        backendUrl: params.backendUrl,
        limit: 1,
        id: params.id,
    });

    if (!orders.list.length) {
        Printer.print(`Order ${params.id} not found`);
        return;
    }

    let subOrders: { [key: string]: any }[] = [];
    if (params.subOrdersFields.length) {
        subOrders = orders.list[0].subOrders?.map((item) => filterObjectFields(item, params.subOrdersFields)) || [];
    }

    const order = prepareObjectToPrint(orders.list[0], params.fields);
    Printer.printObject(order);

    if (params.subOrdersFields.length) {
        if (subOrders.length) Printer.table(subOrders);
        else Printer.print(`There is no sub orders for order ${params.id}`);
    }
};

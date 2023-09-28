import fetchOrdersService from '../services/fetchOrders';
import Printer from '../printer';
import { prepareObjectToPrint } from '../utils';

export type OrdersGetParams = {
  backendUrl: string;
  accessToken: string;
  fields: string[];
  subOrdersFields: string[];
  id: string;
};

export default async (params: OrdersGetParams) => {
  const orders = await fetchOrdersService({
    backendUrl: params.backendUrl,
    accessToken: params.accessToken,
    limit: 1,
    id: params.id,
  });

  if (!orders.list.length) {
    Printer.print(`Order ${params.id} could not be found`);
    return;
  }

  const order = prepareObjectToPrint(orders.list[0], params.fields);
  Printer.printObject(order);

  if (params.subOrdersFields.length) {
    const subOrders =
      orders.list[0].subOrders?.map((item) => prepareObjectToPrint(item, params.subOrdersFields)) ||
      [];

    if (subOrders.length) Printer.table(subOrders);
    else Printer.print(`There are no sub-orders for order ${params.id}`);
  }
};

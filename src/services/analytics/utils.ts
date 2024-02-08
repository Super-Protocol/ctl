import fetchOrders, { OrderItem } from '../fetchOrders';
import { IAnalyticsOffer, IOrderEventProperties } from './types';

export type FethchedOrder = {
  id: NonNullable<OrderItem>['id'];
  offerType: NonNullable<OrderItem>['offerType'];
  selectedUsage: NonNullable<OrderItem>['selectedUsage'];
  subOrders: NonNullable<OrderItem>['subOrders'];
};
const getFetchedOrders = async (params: {
  backendUrl: string;
  accessToken: string;
  limit: number;
  ids: string[];
}): Promise<FethchedOrder[]> => {
  const result = await fetchOrders(params);

  return <FethchedOrder[]>result.list
    .filter((item) => Boolean(item))
    .map((item) => ({
      id: item?.id,
      offerType: item.type,
      selectedUsage: item.selectedUsage,
      subOrders: item.subOrders,
    }));
};

const getAnalyticsOffersFromOrder = (order?: FethchedOrder): IAnalyticsOffer[] => {
  if (!order) {
    return [];
  }

  const { optionIds, optionsCount } = order.selectedUsage || {};
  const options = (optionIds || []).map((id, index) => ({ id, count: optionsCount?.[index] || 0 }));
  return [
    {
      offer: order.id,
      offerType: order.offerType,
      ...(options.length && { options }),
    },
    ...(order.subOrders || [])
      .map((order) => getAnalyticsOffersFromOrder(order as unknown as FethchedOrder))
      .flat(),
  ];
};

export const getOrderEventPropertiesByOrder = async (params: {
  accessToken: string;
  backendUrl: string;
  orderId: string;
}): Promise<IOrderEventProperties> => {
  const { orderId, ...rest } = params;
  const result = await getFetchedOrders({
    ...rest,
    limit: 1,
    ids: [orderId],
  });

  if (result.length !== 1) {
    throw Error(`Order ${orderId} was not found.`);
  }

  return {
    orderId,
    offers: getAnalyticsOffersFromOrder(result[0]),
  };
};

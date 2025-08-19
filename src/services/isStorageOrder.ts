import { Offer, OfferType, Order } from '@super-protocol/sdk-js';

export const isStorageOrder = async (orderId: string): Promise<boolean> => {
  const order = new Order(orderId);
  if (!(await order.isExist())) {
    throw Error(`Order ${orderId} does not exist`);
  }

  const info = await order.getOrderInfo();
  const offer = new Offer(info.offerId);
  const offerType = await offer.getOfferType();

  return offerType === OfferType.Storage;
};

import {
  BlockchainId,
  OfferResources,
  OffersStorageAllocated,
  OffersStorageRequests,
  OfferStorageAllocated,
  OfferStorageRequest,
  Order,
  OrderStatus,
} from '@super-protocol/sdk-js';
import { getObjectKey } from '../../../../utils';

type GetStorageRegistrationStatusParams = {
  offerId: BlockchainId;
  offerVersion: number;
};

export type StorageRegistrationStatus = {
  isOfferStorageRequestCreated: boolean;
  orderId?: string;
  orderStatus?: string;
  replicasCreated?: number;
  replicationFactor: number;
};

const getOrderId = (params: {
  allocated?: OfferStorageAllocated;
  request?: OfferStorageRequest;
}): string | undefined => {
  const parseOrderId = (orderId: string | undefined): string | undefined =>
    orderId === '0' ? undefined : orderId;

  if (params.request) {
    return parseOrderId(params.request.orderId);
  }
  if (params.allocated) {
    return parseOrderId(params.allocated.storageOrderId);
  }

  return;
};

const getReplicationFactor = (params: {
  allocated?: OfferStorageAllocated;
  request?: OfferStorageRequest;
}): number => {
  if (params.request) {
    return params.request.replicationFactor;
  }
  if (params.allocated) {
    return params.allocated.distributionReplicationFactor;
  }

  return 0;
};

const getOrderStatus = async (orderId: BlockchainId): Promise<string | undefined> => {
  try {
    const { status } = await new Order(orderId).getOrderInfo();
    return getObjectKey(status, OrderStatus)?.toLowerCase();
  } catch {
    return;
  }
};

export const getStorageRegistrationStatus = async (
  params: GetStorageRegistrationStatusParams,
): Promise<StorageRegistrationStatus> => {
  const { offerId, offerVersion } = params;
  const [allocated, request, resources] = await Promise.all([
    OffersStorageAllocated.getByOfferVersion(offerId, offerVersion),
    OffersStorageRequests.getByOfferVersion(offerId, offerVersion),
    OfferResources.getByOfferVersion(offerId, offerVersion),
  ]);

  const orderId = getOrderId({ allocated, request });

  return {
    isOfferStorageRequestCreated: Boolean(request || allocated),
    ...(orderId && {
      orderId,
      orderStatus: await getOrderStatus(orderId),
      replicasCreated: resources.filter((r) => r.storageOrderId === orderId).length,
    }),
    replicationFactor: getReplicationFactor({ allocated, request }),
  };
};

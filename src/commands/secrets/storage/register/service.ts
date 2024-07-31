import {
  calculateReplicationFactor,
  calculateStorageOrderDeposit,
  CalculateStorageOrderDepositParams,
  findTeeOfferIssuerId,
} from '@super-protocol/distributed-secrets';
import {
  BlockchainId,
  OfferResources,
  OffersStorageAllocated,
  OffersStorageRequests,
  Order,
  OrderStatus,
} from '@super-protocol/sdk-js';
import Printer from '../../../../printer';
import doWithRetries from '../../../../services/doWithRetries';
import { getMostRecentlyActiveTeeOfferIds } from '../../utils';

export type RegisterStorageParams = CalculateStorageOrderDepositParams & {
  offerId: BlockchainId;
  offerVersion?: number;
  retryCount: number;
  retryInterval: number;
  pccsServiceApiUrl: string;
};

export const findStorageOrderId = async (
  params: Pick<RegisterStorageParams, 'offerId' | 'offerVersion'>,
): Promise<string | undefined> => {
  const { offerId, offerVersion } = params;
  const parseOrderId = (orderId: string | undefined): string | undefined =>
    orderId === '0' ? undefined : orderId;
  const allocated = await OffersStorageAllocated.getByOfferVersion(offerId, offerVersion);
  if (allocated) {
    return parseOrderId(allocated.storageOrderId);
  }

  const request = await OffersStorageRequests.getByOfferVersion(offerId, offerVersion);
  if (request) {
    return parseOrderId(request.orderId);
  }

  return;
};

export const registerStorage = async (
  params: RegisterStorageParams,
): Promise<BlockchainId | undefined> => {
  const {
    offerId,
    offerVersion,
    storageOfferId,
    storageSlotId,
    retryCount,
    retryInterval,
    pccsServiceApiUrl,
  } = params;

  const activeTeeOfferIds = await getMostRecentlyActiveTeeOfferIds({
    size: params.replicationFactor,
    pccsServiceApiUrl,
  });
  const teeOfferIssuerId = findTeeOfferIssuerId({ activeTeeOfferIds });
  if (!teeOfferIssuerId) {
    throw new Error('No available issuer for storage could be found');
  }

  const replicationFactor = calculateReplicationFactor({
    activeTeeOfferIds,
    replicationFactor: params.replicationFactor,
  });
  const deposit = await calculateStorageOrderDeposit(params);
  let count = 0;
  const checkRequest = async (): Promise<string> => {
    count++;
    const request = await OffersStorageRequests.getByOfferVersion(offerId, offerVersion);
    if (!request?.orderId || request.orderId === '0') {
      Printer.print(`Waiting for the storage request to be ready (attempt=${count})`);
      throw Error(`Offer storage request is not ready yet (offerId=${offerId})`);
    }

    return request.orderId;
  };

  await OffersStorageRequests.set({
    offerId,
    offerVersion,
    teeOfferIssuerId,
    storageOfferId,
    storageSlotId,
    replicationFactor,
    deposit,
    copyPreviousData: false,
  });

  const orderId = await doWithRetries(checkRequest, retryCount, retryInterval);

  count = 0;

  const checkOrderStatus = async (): Promise<void> => {
    count++;
    const { status } = await new Order(orderId).getOrderInfo();
    if (status !== OrderStatus.Processing) {
      Printer.print(
        `Waiting for storage order ${orderId} status to be ‘processing’ (attempt=${count})`,
      );
      throw Error(`Order (id=${orderId}) is not in "processing" status yet`);
    }
  };

  await doWithRetries(checkOrderStatus, retryCount, retryInterval);

  count = 0;
  const checkResourceAllocation = async (): Promise<boolean> => {
    count++;
    const resources = (await OfferResources.getByOfferVersion(offerId, offerVersion)).filter(
      (resource) => resource.storageOrderId === orderId,
    );
    if (count === retryCount && resources.length < replicationFactor) {
      return false;
    }
    if (resources.length < replicationFactor) {
      Printer.print(
        `Waiting for the allocation of resources. Created ${resources.length} replicas out of the ${replicationFactor} requested`,
      );
      throw Error(`All needed resources are not allocated yet (offerId=${offerId})`);
    }

    return true;
  };

  const success = await doWithRetries(checkResourceAllocation, retryCount, retryInterval);

  return success ? orderId : undefined;
};

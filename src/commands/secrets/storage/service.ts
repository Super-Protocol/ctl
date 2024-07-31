import {
  calculateReplicationFactor,
  calculateStorageOrderDeposit,
  CalculateStorageOrderDepositParams,
  findTeeOfferIssuerId,
} from '@super-protocol/distributed-secrets';
import {
  BlockchainId,
  Offer,
  OfferResources,
  OffersStorageRequests,
  OfferStorageRequest,
  OfferType,
  Order,
  OrderStatus,
} from '@super-protocol/sdk-js';
import doWithRetries from '../../../services/doWithRetries';
import { getMostRecentlyActiveTeeOfferIds } from '../utils';
import Printer from '../../../printer';

export type RegisterStorageParams = CalculateStorageOrderDepositParams & {
  offerId: BlockchainId;
  offerVersion?: number;
  copyPreviousData: boolean;
  retryCount: number;
  retryInterval: number;
  pccsServiceApiUrl: string;
};

export const checkParamsToRegisterStorage = async (params: {
  offerId: string;
  storageOfferId: string;
  storageSlotId: string;
}): Promise<void> => {
  const type = await new Offer(params.offerId).getOfferType();
  if (type !== OfferType.Solution) {
    throw Error(`Invalid solution offer id ${params.offerId}`);
  }

  const offerStorage = new Offer(params.storageOfferId);
  const offerStorageType = await offerStorage.getOfferType();
  if (offerStorageType !== OfferType.Storage) {
    throw Error(`Invalid storage offer id ${params.storageOfferId}`);
  }

  try {
    await offerStorage.getSlotById(params.storageSlotId);
  } catch {
    throw Error(`Invalid storage slot id ${params.storageSlotId}`);
  }
};

export const registerStorage = async (
  params: RegisterStorageParams,
): Promise<BlockchainId | undefined> => {
  const { offerId, offerVersion, retryCount, retryInterval } = params;
  const { replicationFactor } = await setOfferStorageRequest({
    ...params,
    offerVersion: 0,
  });

  const orderId = await doWithRetries(
    checkRequest({ offerId, offerVersion }),
    retryCount,
    retryInterval,
  );

  await doWithRetries(checkOrderStatus(orderId), retryCount, retryInterval);

  const success = await doWithRetries(
    checkResourceAllocation(
      {
        offerId,
        offerVersion,
        orderId,
        replicationFactor,
      },
      { retryCount },
    ),
    retryCount,
    retryInterval,
  );

  return success ? orderId : undefined;
};

const setOfferStorageRequest = async (params: {
  offerId: string;
  offerVersion: number;
  replicationFactor: number;
  copyPreviousData: boolean;
  storageOfferId: string;
  storageSlotId: string;
  storageOrderDepositDurationInHours: number;
  pccsServiceApiUrl: string;
}): Promise<Pick<OfferStorageRequest, 'replicationFactor'>> => {
  const {
    offerId,
    offerVersion,
    storageOfferId,
    storageSlotId,
    copyPreviousData,
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

  await OffersStorageRequests.set({
    offerId,
    offerVersion,
    teeOfferIssuerId,
    storageOfferId,
    storageSlotId,
    replicationFactor: calculateReplicationFactor({
      activeTeeOfferIds,
      replicationFactor,
    }),
    deposit: await calculateStorageOrderDeposit(params),
    copyPreviousData,
  });

  return { replicationFactor };
};

export const checkRequest = ({
  offerId,
  offerVersion = 0,
}: Pick<OfferStorageRequest, 'offerId' | 'offerVersion'>): (() => Promise<string>) => {
  let count = 0;

  return async function () {
    count++;
    const request = await OffersStorageRequests.getByOfferVersion(offerId, offerVersion);
    if (!request?.orderId || request.orderId === '0') {
      Printer.print(`Waiting for the storage request to be ready (attempt=${count})`);
      throw Error(`Offer storage request is not ready yet (offerId=${offerId})`);
    }
    return request.orderId;
  };
};

export const checkOrderStatus = (orderId: string): (() => Promise<void>) => {
  let count = 0;

  return async function () {
    count++;
    const { status } = await new Order(orderId).getOrderInfo();
    if (status !== OrderStatus.Processing) {
      Printer.print(
        `Waiting for storage order ${orderId} status to be ‘processing’ (attempt=${count})`,
      );
      throw Error(`Order (id=${orderId}) is not in "processing" status yet`);
    }
  };
};

export const checkResourceAllocation = (
  request: Pick<OfferStorageRequest, 'offerId' | 'offerVersion' | 'orderId' | 'replicationFactor'>,
  options: { retryCount: number },
): (() => Promise<boolean>) => {
  const { offerId, offerVersion, orderId, replicationFactor } = request;
  let count = 0;

  return async function () {
    count++;
    const resources = (await OfferResources.getByOfferVersion(offerId, offerVersion)).filter(
      (resource) => resource.storageOrderId === orderId,
    );
    if (count === options.retryCount && resources.length < replicationFactor) {
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
};

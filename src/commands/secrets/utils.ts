import {
  getMostActiveTeeOffers,
  validateSecret,
  validateSession,
} from '@super-protocol/distributed-secrets';
import {
  BlockchainId,
  LoaderSecretPublicKey,
  LoaderSecretsPublicKeys,
  LoaderSession,
  LoaderSessions,
  Offer,
  OfferResources,
  OffersStorageAllocated,
  OffersStorageRequests,
  OfferStorageRequest,
} from '@super-protocol/sdk-js';

export const validateKeys = async (
  keys: {
    session?: LoaderSession;
    secret?: LoaderSecretPublicKey;
  },
  pccsServiceApiUrl: string,
): Promise<boolean> => {
  const { session, secret } = keys;
  if (!session || !secret) {
    return false;
  }
  const isValidate = await Promise.all([
    validateSession(session, pccsServiceApiUrl),
    validateSecret({ session, secret }),
  ]);

  return isValidate.every(Boolean);
};

export const getMostRecentlyActiveTeeOfferIds = (params: {
  size: number;
  pccsServiceApiUrl: string;
}): Promise<BlockchainId[]> => {
  const { size, pccsServiceApiUrl } = params;

  return getMostActiveTeeOffers({
    size,
    async verifyOffer(offerId) {
      const [session, secret] = await Promise.all([
        LoaderSessions.get(offerId),
        LoaderSecretsPublicKeys.get(offerId),
      ]);

      return validateKeys({ session, secret }, pccsServiceApiUrl);
    },
  });
};

const parseOrderId = (orderId: string | undefined): string | undefined =>
  orderId === '0' ? undefined : orderId;

export const findAllocatedOrderId = async (
  params: Pick<Required<OfferStorageRequest>, 'offerId' | 'offerVersion'>,
): Promise<string | undefined> => {
  const { offerId, offerVersion } = params;
  const allocated = await OffersStorageAllocated.getByOfferVersion(offerId, offerVersion);

  if (allocated) {
    const resources = (await OfferResources.getByOfferVersion(offerId, offerVersion)).filter(
      (resource) => resource.storageOrderId === allocated.storageOrderId,
    );

    if (resources.length) {
      return parseOrderId(allocated.storageOrderId);
    }
  }

  return;
};

export const findRequestOrderId = async (
  params: Pick<Required<OfferStorageRequest>, 'offerId' | 'offerVersion'>,
): Promise<string | undefined> => {
  const { offerId, offerVersion } = params;
  const request = await OffersStorageRequests.getByOfferVersion(offerId, offerVersion);
  if (request) {
    return parseOrderId(request.orderId);
  }

  return;
};

export const findLastOfferVersion = async (
  params: Pick<OfferStorageRequest, 'offerId'>,
): Promise<number> => {
  const { offerId } = params;
  const lastVersionNumber = await new Offer(offerId).getLastVersionNumber();
  if (lastVersionNumber === null) {
    throw Error(`Last version number for offer ${offerId} not found`);
  }

  return lastVersionNumber;
};

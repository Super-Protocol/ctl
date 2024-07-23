import {
  validateSecret,
  validateSession,
  getMostActiveTeeOffers,
} from '@super-protocol/distributed-secrets';
import {
  BlockchainId,
  LoaderSecretPublicKey,
  LoaderSecretsPublicKeys,
  LoaderSession,
  LoaderSessions,
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

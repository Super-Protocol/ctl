import { Offer, OfferType } from '@super-protocol/sdk-js';
import { ResourceFile } from './readResourceFile';

export type ValidateOfferWorkflowParams = {
  offerId: string;
  restrictions: Offer[];
  tee: string;
  solutions: string[];
  data?: string[];
  solutionArgs: ResourceFile[];
  dataArgs: ResourceFile[];
};

export default async (params: ValidateOfferWorkflowParams) => {
  const offer = new Offer(params.offerId);

  await Promise.all([
    (async () => {
      if (!(await offer.isRestrictionsPermitThatOffer(params.tee))) {
        throw Error(
          `Offer ${params.offerId} permission settings do not allow TEE offer ${params.tee}`,
        );
      }
    })(),
    (async () => {
      await Promise.all(
        params.restrictions.map(async (allowedOffer) => {
          const type = allowedOffer.type ?? (await allowedOffer.getOfferType());
          if (type === OfferType.Solution && params.solutionArgs.length) {
            throw Error(
              `Offer ${params.offerId} permission settings do not allow custom solution arguments`,
            );
          }
          if (type === OfferType.Data && params.dataArgs.length) {
            throw Error(
              `Offer ${params.offerId} permission settings do not allow custom data arguments`,
            );
          }
        }),
      );
    })(),
    /**
     * If offer has any solution offers in restrictions then params.solutions should be included into restrictions
     */
    Promise.all(
      params.solutions.map(async (solutionId) => {
        if (!(await offer.isRestrictionsPermitThatOffer(solutionId))) {
          const allowedOffers = filterOffersByType(params.restrictions, OfferType.Solution).map(
            (o) => o.id,
          );
          throw Error(
            `Offer ${params.offerId} must be used in conjunction with the following solutions: ${allowedOffers} but used: ${solutionId}`,
          );
        }
      }),
    ),
    /**
     * If offer has any data offers in restrictions then params.data should be included into restrictions
     */
    params.data &&
      Promise.all(
        params.data.map(async (dataId) => {
          if (!(await offer.isRestrictionsPermitThatOffer(dataId))) {
            const allowedOffers = filterOffersByType(params.restrictions, OfferType.Data).map(
              (o) => o.id,
            );
            throw Error(
              `Offer ${params.offerId} must be used in conjunction with the following data offers: ${allowedOffers}`,
            );
          }
        }),
      ),
    /**
     * Checks if offer has (at least one of):
     * - Restriction on type Soultion,
     * - Has some solution offers in restrictions;
     * And neither of (other) solutions passed in params
     */
    (async () => {
      const otherSolutions = params.solutions.filter((solution) => solution !== params.offerId);
      if (
        (await offer.isRestrictedByOfferType(OfferType.Solution)) &&
        !otherSolutions.length &&
        !params.solutionArgs.length
      ) {
        const allowedOffers = filterOffersByType(params.restrictions, OfferType.Solution).map(
          (o) => o.id,
        );
        if (allowedOffers.length) {
          throw Error(
            `Offer ${
              params.offerId
            } must be used in conjunction with one of the following solutions: ${allowedOffers.join(
              ', ',
            )}`,
          );
        } else {
          throw Error(
            `Offer ${params.offerId} must be used in conjunction with at least one solution`,
          );
        }
      }
    })(),
    /**
     * Checks if offer has (at least one of):
     * - Restriction on type Data,
     * - Has some data offers in restrictions;
     * And neither of (other) data passed in params
     */
    (async () => {
      if (!params.data) return;
      const otherData = params.data.filter((data) => data !== params.offerId);
      if (
        (await offer.isRestrictedByOfferType(OfferType.Data)) &&
        !otherData.length &&
        !params.dataArgs.length
      ) {
        const allowedOffers = filterOffersByType(params.restrictions, OfferType.Data).map(
          (o) => o.id,
        );
        if (allowedOffers.length) {
          throw Error(
            `Offer ${
              params.offerId
            } must be used in conjunction with the following datas: ${allowedOffers.join(', ')}`,
          );
        } else {
          throw Error(`Offer ${params.offerId} must be used in conjunction with at least one data`);
        }
      }
    })(),
  ]);
};

const filterOffersByType = (offers: Offer[], offerType: OfferType) => {
  return offers.filter(async (offer) => {
    const type = offer.type ?? (await offer.getOfferType());
    return type === offerType;
  });
};

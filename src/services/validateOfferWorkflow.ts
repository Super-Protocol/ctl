import { Offer, OfferType } from "@super-protocol/sdk-js";
import { ResourceFile } from "./readResourceFile";

export type ValidateOfferWorkflowParams = {
    offerId: string;
    restrictions: string[];
    tee: string;
    solutions: string[];
    data?: string[];
    solutionArgs: ResourceFile[];
    dataArgs: ResourceFile[];
};

export default async (params: ValidateOfferWorkflowParams) => {
    const offer = new Offer(params.offerId);
    const restrictionOffers = params.restrictions.map(id => new Offer(id));

    await Promise.all([
        (async () => {
            if (!(await offer.isRestrictionsPermitThatOffer(params.tee))) {
                throw Error(`Offer ${params.offerId} permission settings do not allow TEE offer ${params.tee}`);
            }
        })(),
        (async () => {
            await Promise.all(
                restrictionOffers.map(async (allowedOffer) => {
                    let type = allowedOffer.type ?? await allowedOffer.getOfferType();
                    if (type === OfferType.Solution && params.solutionArgs.length) {
                        throw Error(
                            `Offer ${params.offerId} permission settings do not allow custom solution arguments`
                        );
                    }
                    if (type === OfferType.Data && params.dataArgs.length) {
                        throw Error(`Offer ${params.offerId} permission settings do not allow custom data arguments`);
                    }
                })
            );
        })(),
        Promise.all(
            params.solutions.map(async (solutionId) => {
                if (!(await offer.isRestrictionsPermitThatOffer(solutionId))) {
                    throw Error(
                        `Offer ${params.offerId} permission settings do not allow solution offer ${solutionId}`
                    );
                }
            })
        ),
        params.data &&
            Promise.all(
                params.data.map(async (dataId) => {
                    if (!(await offer.isRestrictionsPermitThatOffer(dataId))) {
                        throw Error(`Offer ${params.offerId} permission settings do not allow data offer ${dataId}`);
                    }
                })
            ),
        (async () => {
            const otherSolutions = params.solutions.filter((solution) => solution !== params.offerId);
            if (
                (await offer.isRestrictedByOfferType(OfferType.Solution)) &&
                !otherSolutions.length &&
                !params.solutionArgs.length
            ) {
                const allowedOffers = restrictionOffers.filter(async allowedOffer => {
                    const type = allowedOffer.type ?? await allowedOffer.getOfferType();
                    return type === OfferType.Solution;
                }).map(o => o.id);
                throw Error(`Offer ${params.offerId} must be used in conjunction with one of the following solutions: ${allowedOffers.join(", ")}`);
            }
        })(),
        (async () => {
            if (!params.data) return;
            const otherData = params.data.filter((data) => data !== params.offerId);
            if ((await offer.isRestrictedByOfferType(OfferType.Data)) && !otherData.length && !params.dataArgs.length) {
                const allowedOffers = restrictionOffers.filter(async offer => {
                    const type = offer.type ?? await offer.getOfferType();
                    return type === OfferType.Solution;
                }).map(o => o.id);
                throw Error(`Offer ${params.offerId} must be used in conjunction with one of the following data offers: ${allowedOffers.join(", ")}`);
            }
        })(),
    ]);
};

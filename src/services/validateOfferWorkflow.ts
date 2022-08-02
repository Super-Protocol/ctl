import { Offer, OfferType } from "@super-protocol/sdk-js";
import { ResourceFile } from "./readResourceFile";

export type ValidateOfferWorkflowParams = {
    offerAddress: string;
    tee: string;
    solutions: string[];
    data?: string[];
    solutionArgs: ResourceFile[];
    dataArgs: ResourceFile[];
};

export default async (params: ValidateOfferWorkflowParams) => {
    const offer = new Offer(params.offerAddress);

    await Promise.all([
        (async () => {
            if (!(await offer.isRestrictionsPermitThatOffer(params.tee))) {
                throw Error(`Offer ${params.offerAddress} permissions settings doesn't permit TEE offer ${params.tee}`);
            }
        })(),
        (async () => {
            const offerInfo = await offer.getInfo();
            await Promise.all(
                offerInfo.restrictions.offers.map(async (offerId) => {
                    const allowedOffer = new Offer(offerId);
                    let type = await allowedOffer.getOfferType();

                    if (type === OfferType.Solution && params.solutionArgs.length) {
                        throw Error(
                            `Offer ${params.offerAddress} permissions settings doesn't permit custom solution arguments`
                        );
                    }
                    if (type === OfferType.Data && params.dataArgs.length) {
                        throw Error(
                            `Offer ${params.offerAddress} permissions settings doesn't permit custom data arguments`
                        );
                    }
                })
            );
        })(),
        Promise.all(
            params.solutions.map(async (solutionAddress) => {
                if (!(await offer.isRestrictionsPermitThatOffer(solutionAddress))) {
                    throw Error(
                        `Offer ${params.offerAddress} permissions settings doesn't permit solution offer ${solutionAddress}`
                    );
                }
            })
        ),
        params.data &&
            Promise.all(
                params.data.map(async (dataAddress) => {
                    if (!(await offer.isRestrictionsPermitThatOffer(dataAddress))) {
                        throw Error(
                            `Offer ${params.offerAddress} permissions settings doesn't permit data offer ${dataAddress}`
                        );
                    }
                })
            ),
        (async () => {
            const otherSolutions = params.solutions.filter((solution) => solution !== params.offerAddress);
            if (
                (await offer.isRestrictedByOfferType(OfferType.Solution)) &&
                !otherSolutions.length &&
                !params.solutionArgs.length
            ) {
                throw Error(`Offer ${params.offerAddress} permissions settings requires solution`);
            }
        })(),
        (async () => {
            if (!params.data) return;
            const otherData = params.data.filter((data) => data !== params.offerAddress);
            if ((await offer.isRestrictedByOfferType(OfferType.Data)) && !otherData.length && !params.dataArgs.length) {
                throw Error(`Offer ${params.offerAddress} permissions settings requires data`);
            }
        })(),
    ]);
};

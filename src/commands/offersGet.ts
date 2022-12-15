import { OfferType } from "@super-protocol/sdk-js";
import Printer from "../printer";
import fetchOffers from "../services/fetchOffers";
import fetchTeeOffers from "../services/fetchTeeOffers";
import { formatDate, getObjectKey, prepareObjectToPrint, weiToEther } from "../utils";

export type OffersGetParams = {
    backendUrl: string;
    accessToken: string;
    type: "tee" | "value";
    fields: string[];
    id: string;
};

export default async (params: OffersGetParams) => {
    let offers: any[];
    switch (params.type) {
        case "tee":
            offers = await fetchTeeOffers({
                backendUrl: params.backendUrl,
                accessToken: params.accessToken,
                limit: 1,
                id: params.id,
            }).then(({ list }) => list.map((item) => ({
                id: item.node?.id,
                name: item.node?.teeOfferInfo?.name,
                description: item.node?.teeOfferInfo?.description,
                providerName: item.node?.providerInfo.name,
                providerAddress: item.node?.origins?.createdBy,
                totalCores: item.node?.teeOfferInfo.slots,
                freeCores: item.node?.stats?.freeCores,
                ordersInQueue: (item.node?.stats?.new || 0) + (item.node?.stats?.processing || 0),
                cancelable: false,
                modifiedDate: formatDate(item.node?.origins?.modifiedDate),
            })));
            break;
        case "value":
            offers = await fetchOffers({
                backendUrl: params.backendUrl,
                accessToken: params.accessToken,
                limit: 1,
                id: params.id,
            }).then(({ list }) => list.map((item) => ({
                id: item.node?.id,
                name: item.node?.offerInfo?.name,
                description: item.node?.offerInfo?.description,
                type: getObjectKey(item.node?.offerInfo.offerType, OfferType),
                cost: weiToEther(item.node?.offerInfo.holdSum),
                providerName: item.node?.providerInfo.name,
                providerAddress: item.node?.origins?.createdBy,
                cancelable: item.node?.offerInfo?.cancelable,
                modifiedDate: formatDate(item.node?.origins?.modifiedDate),
                dependsOnOffers: item.node?.offerInfo.restrictions?.offers || [],
            })));
            break;

        default:
            throw new Error(`Unknown offer type ${params.type} provided`);
    }

    if (!offers.length) {
        Printer.print(`Offer ${params.id} could not be found`);
        return;
    }

    const offer = prepareObjectToPrint(offers[0], params.fields);
    Printer.printObject(offer);
};

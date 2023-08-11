import { promises as fs } from "fs";
import path from "path";
import Printer from "../printer";
import fetchOffers from "../services/fetchOffers";
import fetchTeeOffers from "../services/fetchTeeOffers";

export type OffersGetInfoParams = {
    backendUrl: string;
    accessToken: string;
    type: "tee" | "value";
    id: string;
};

export default async (params: OffersGetInfoParams) => {
    let offer: any;
    switch (params.type) {
        case "tee":
            offer = await fetchTeeOffers({
                backendUrl: params.backendUrl,
                accessToken: params.accessToken,
                limit: 1,
                id: params.id,
            }).then(({ list }) => list[0]?.node?.teeOfferInfo);
            break;
        case "value":
            offer = await fetchOffers({
                backendUrl: params.backendUrl,
                accessToken: params.accessToken,
                limit: 1,
                id: params.id,
            }).then(({ list }) => list[0]?.node?.offerInfo);
            break;

        default:
            throw new Error(`Unknown offer type ${params.type} provided`);
    }

    if (!offer) {
        Printer.print(`Offer ${params.id} could not be found`);
        return;
    }

    Printer.printObject(offer);
    await fs.writeFile(path.join(process.cwd(), `offerInfo.json`), JSON.stringify(offer));
};

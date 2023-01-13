import BlockchainConnector, { OfferInfo, OffersFactory } from "@super-protocol/sdk-js";
import crypto from "crypto";
import { ATTEMPT_PERIOD_MS, MAX_ATTEMPT_WAITING_NEW_TX } from "../constants";
import Printer from "../printer";
import { sleep } from "../utils";

export type CreateOfferParams = {
    authority: string;
    action: string;
    offerInfo: OfferInfo;
};

export default async (params: CreateOfferParams): Promise<string> => {
    const externalId = crypto.randomBytes(8).toString("hex");
    const actionAddress = await BlockchainConnector.getInstance().initializeActionAccount(params.action);
    const authorityAddress = await BlockchainConnector.getInstance().initializeActionAccount(params.authority);
    // TODO: make as option parameter with possibility to enable/disable by update command
    const enable = true;

    Printer.print("Creating value offer");

    OffersFactory.createOffer(authorityAddress, params.offerInfo, externalId, enable,{ from: actionAddress });

    let attempt = 0;
    let offerId = "-1";
    while (offerId === "-1") {
        sleep(ATTEMPT_PERIOD_MS);
        const events = await OffersFactory.getOffer(actionAddress, externalId);
        offerId = events.offerId;

        if (offerId == "-1" && attempt == MAX_ATTEMPT_WAITING_NEW_TX) {
            throw new Error(
                `Value offer wasn't created within ${
                    (MAX_ATTEMPT_WAITING_NEW_TX * ATTEMPT_PERIOD_MS) / 1000
                } seconds. Try increasing the gas price.`
            );
        }
    }
    return offerId;
}

import { Offer } from "@super-protocol/sdk-js";
import { Resource } from "@super-protocol/dto-js";
import { ErrorWithCustomMessage } from "../utils";

export type GetOfferResultParams = {
    offerId: string;
};

const getOfferResult = async (params: GetOfferResultParams): Promise<Resource | null> => {
    const order = new Offer(params.offerId);
    if (!(await order.isOfferExists())) throw Error(`Offer ${params.offerId} not found`);

    const info = await order.getInfo();
    if (!info.resultResource?.trim()) return null;

    try {
        return JSON.parse(info.resultResource);
    } catch (error) {
        throw ErrorWithCustomMessage("Unable to parse offer result", error as Error);
    }
};

export default getOfferResult;

import {
    Crypto,
    OrderInfo,
    Orders,
    OrderStatus,
    TeeOffer,
} from "@super-protocol/sdk-js";
import { Encryption } from "@super-protocol/dto-js";
import Printer from "../printer";
import { generateExternalId, sleep } from "../utils";
import { MAX_ATTEMPT_WAITING_NEW_TX, ATTEMPT_PERIOD_MS } from "../constants";

export type TeeOfferParams = {
    id: string;
    slotId: string;
    slotCount: string;
    optionsIds: string[];
    optionsCount: string[];
};

export type ValueOfferParams = {
    id: string;
    slotId: string;
};

export type CreateWorkflowParams = {
    teeOffer: TeeOfferParams;
    storageOffer: ValueOfferParams;
    inputOffers: ValueOfferParams[];
    resultPublicKey: Encryption;
    argsToEncrypt: string;
    holdDeposit: string;
    consumerAddress: string;
};

export default async (params: CreateWorkflowParams): Promise<string> => {
    Printer.print("Fetching TEE offer");
    const teeOffer = new TeeOffer(params.teeOffer.id);
    const offerInfo = await teeOffer.getInfo();

    Printer.print("Encrypting arguments");
    const encryptedArgs = await Crypto.encrypt(
        params.argsToEncrypt,
        JSON.parse(offerInfo.argsPublicKey)
    );

    const externalId = generateExternalId();

    const parentOrderInfo: OrderInfo = {
        offerId: params.teeOffer.id,
        externalId: externalId,
        status: OrderStatus.New,
        args: {
            inputOffers: params.inputOffers.map((offer) => offer.id),
            outputOffer: params.storageOffer.id,
        },
        encryptedArgs: JSON.stringify(encryptedArgs),
        resultPublicKey: JSON.stringify(params.resultPublicKey),
        encryptedRequirements: "",
        slots: {
            slotId: params.teeOffer.slotId,
            slotCount: params.teeOffer.slotCount,
            optionsIds: params.teeOffer.optionsIds,
            optionsCount: params.teeOffer.optionsCount,
        },
    };

    const subOrdersInfo: OrderInfo[] = params.inputOffers.map(
        (subOrderParams) => ({
            offerId: subOrderParams.id,
            externalId: generateExternalId(),
            status: OrderStatus.New,
            args: {
                inputOffers: [],
                outputOffer: params.storageOffer.id,
            },
            resultPublicKey: "",
            encryptedArgs: "",
            encryptedRequirements: "",
            slots: {
                slotId: subOrderParams.slotId,
                slotCount: "0",
                optionsIds: [],
                optionsCount: [],
            },
        })
    );

    await Orders.createWorkflow(
        parentOrderInfo,
        subOrdersInfo,
        params.holdDeposit,
        { from: params.consumerAddress }
    );

    let { orderId } = await Orders.getByExternalId(
        params.consumerAddress,
        externalId
    );
    let attempt = 0;
    while (orderId === "-1") {
        await sleep(ATTEMPT_PERIOD_MS);
        const events = await Orders.getByExternalId(
            params.consumerAddress,
            externalId
        );
        orderId = events.orderId;

        if (orderId == "-1" && attempt == MAX_ATTEMPT_WAITING_NEW_TX) {
            throw new Error(
                `TEE order wasn't created within ${
                    (MAX_ATTEMPT_WAITING_NEW_TX * ATTEMPT_PERIOD_MS) / 1000
                } seconds. Try increasing the gas price.`
            );
        }
    }

    return orderId;
};

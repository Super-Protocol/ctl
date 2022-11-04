import { Crypto, OrderInfo, OrdersFactory, OrderStatus, TeeOffer } from "@super-protocol/sdk-js";
import { Encryption } from "@super-protocol/dto-js";
import Printer from "../printer";
import { generateExternalId, sleep } from "../utils";
import { MAX_ATTEMPT_WAITING_NEW_TX, ATTEMPT_PERIOD_MS } from "../constants";

export type CreateWorkflowParams = {
    teeOffer: string;
    storageOffer: string;
    inputOffers: string[];
    resultPublicKey: Encryption;
    argsToEncrypt: string;
    holdDeposit: string;
    consumerAddress: string;
};

export default async (params: CreateWorkflowParams): Promise<string> => {
    Printer.print("Fetching TEE offer");
    const teeOffer = new TeeOffer(params.teeOffer);
    const offerInfo = await teeOffer.getInfo();

    Printer.print("Encrypting arguments");
    const encryptedArgs = await Crypto.encrypt(params.argsToEncrypt, JSON.parse(offerInfo.argsPublicKey));

    const id = generateExternalId();

    const parentOrderInfo: OrderInfo = {
        offer: params.teeOffer,
        externalId: id,
        status: OrderStatus.New,
        args: {
            inputOffers: params.inputOffers,
            selectedOffers: [params.storageOffer],
            slots: 4,
        },
        encryptedArgs: JSON.stringify(encryptedArgs),
        resultPublicKey: JSON.stringify(params.resultPublicKey),
        encryptedRequirements: "",
    };
    const subOrdersInfo: OrderInfo[] = params.inputOffers.map(offerId => ({
        offer: offerId,
        externalId: generateExternalId(),
        status: OrderStatus.New,
        args: {
            inputOffers: [],
            selectedOffers: (params.storageOffer ? [params.storageOffer] : [])
            .concat(params.teeOffer),
            slots: 0,
        },
        resultPublicKey: "",
        encryptedArgs: "",
        encryptedRequirements: "",
    }));

    await OrdersFactory.createWorkflow(
        parentOrderInfo,
        subOrdersInfo,
        params.holdDeposit,
        { from: params.consumerAddress },
    );

    let { orderId } = await OrdersFactory.getOrder(params.consumerAddress, id);
    let attempt = 0;
    while (orderId === "-1") {
        sleep(ATTEMPT_PERIOD_MS);
        const events = await OrdersFactory.getOrder(params.consumerAddress, id);
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

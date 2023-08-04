import BlockchainConnector, {
    Crypto,
    OrderInfo,
    Orders,
    OrderStatus,
    TeeOffer,
} from "@super-protocol/sdk-js";
import { Encryption } from "@super-protocol/dto-js";
import Web3 from "web3";
import Printer from "../printer";
import { generateExternalId } from "../utils";
import doWithRetries from "./doWithRetries";

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
        expectedPrice:  Web3.utils.toWei("1", "ether"),
        maxPriceSlippage: Web3.utils.toWei("1", "ether"),
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
            expectedPrice:  Web3.utils.toWei("1", "ether"),
            maxPriceSlippage: Web3.utils.toWei("1", "ether"),
        })
    );

    const workflowCreationBLock =
        await BlockchainConnector.getInstance().getLastBlockInfo();

    await Orders.createWorkflow(
        parentOrderInfo,
        subOrdersInfo,
        params.holdDeposit,
        { from: params.consumerAddress }
    );

    const orderLoaderFn = () =>
        Orders.getByExternalId(
            params.consumerAddress,
            externalId,
            workflowCreationBLock.index
        ).then((event) => {
            if (event?.orderId !== "-1") {
                return event.orderId;
            }
            throw new Error(
                "TEE order wasn't created. Try increasing the gas price."
            );
        });

    const orderId = await doWithRetries(orderLoaderFn);

    return orderId;
};

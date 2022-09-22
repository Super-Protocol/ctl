import { Crypto, Order, OrdersFactory, OrderStatus, TeeOffer } from "@super-protocol/sdk-js";
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
    const suspended = !!params.inputOffers.length;

    Printer.print("Creating TEE order");
    const id = generateExternalId();

    await OrdersFactory.createOrder(
        {
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
        },
        params.holdDeposit,
        suspended,
        { from: params.consumerAddress }
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
    Printer.print("TEE order created successfully, fetching created order...");
    const teeOrder = new Order(orderId.toString());

    try {
        if (suspended) {
            Printer.print(`Creating ${params.inputOffers.length} sub-orders`);
            for (let index in params.inputOffers) {
                await teeOrder.createSubOrder(
                    {
                        offer: params.inputOffers[index],
                        externalId: id,
                        status: OrderStatus.New,
                        args: {
                            inputOffers: [],
                            selectedOffers: [],
                            slots: 4,
                        },
                        resultPublicKey: offerInfo.argsPublicKey,
                        encryptedArgs: "",
                        encryptedRequirements: "",
                    },
                    true,
                    undefined,
                    { from: params.consumerAddress }
                );
            }

            Printer.print("Starting TEE order");
            await teeOrder.start({ from: params.consumerAddress });
        }
    } catch (e) {
        Printer.error("Error occurred during the creation of sub-orders, canceling all created orders");
        try {
            const subOrders = await teeOrder.getSubOrders();

            for (let index in subOrders) {
                try {
                    const subOrder = new Order(subOrders[index]);
                    await subOrder.cancelOrder({ from: params.consumerAddress });
                } catch (error) {
                    Printer.error(
                        `Error occurred when canceling created order ${subOrders[index]}, the order was not canceled`
                    );
                }
            }

            try {
                await teeOrder.cancelOrder({ from: params.consumerAddress });
            } catch (error) {
                Printer.error(
                    `Error occurred when canceling created TEE order ${params.consumerAddress}, the order was not canceled`
                );
            }

            Printer.error("Created orders were canceled");
        } catch (e) {
            Printer.error("Error occurred when canceling created orders, no orders were canceled");
        }
        throw e;
    }

    return teeOrder.id;
};

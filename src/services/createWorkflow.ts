import { Crypto, Order, OrdersFactory, OrderStatus, TeeOffer } from "@super-protocol/sdk-js";
import { Encryption } from "@super-protocol/dto-js";
import Printer from "../printer";
import { generateExternalId } from "../utils";

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
            status: OrderStatus.New,
            args: {
                inputOffers: params.inputOffers,
                selectedOffers: [params.storageOffer],
                slots: 1,
            },
            encryptedArgs: JSON.stringify(encryptedArgs),
            resultPublicKey: JSON.stringify(params.resultPublicKey),
            encryptedRequirements: "",
        },
        params.holdDeposit,
        suspended,
        id,
        { from: params.consumerAddress }
    );

    Printer.print("Fetching created order");
    const action = await OrdersFactory.getOrder(params.consumerAddress, id);
    const teeOrder = new Order(action.orderId.toString());
    Printer.print("TEE order was found");

    try {
        if (suspended) {
            Printer.print(`Creating ${params.inputOffers.length} sub-orders`);
            for (let index in params.inputOffers) {
                await teeOrder.createSubOrder(
                    {
                        offer: params.inputOffers[index],
                        status: OrderStatus.New,
                        args: {
                            inputOffers: [],
                            selectedOffers: [],
                            slots: 1,
                        },
                        resultPublicKey: offerInfo.argsPublicKey,
                        encryptedArgs: "",
                        encryptedRequirements: "",
                    },
                    true,
                    undefined,
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

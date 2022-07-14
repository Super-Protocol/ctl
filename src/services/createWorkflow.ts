import { Crypto, Order, OrdersFactory, OrderStatus, SuperproToken, TeeOffer } from "@super-protocol/sp-sdk-js";
import { Encryption } from "@super-protocol/sp-dto-js";
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
    Printer.print("Fetching root TEE offer...");
    const teeOffer = new TeeOffer(params.teeOffer);
    const offerInfo = await teeOffer.getInfo();

    Printer.print("TEE offer found, encrypting arguments...");
    const encryptedArgs = await Crypto.encrypt(params.argsToEncrypt, JSON.parse(offerInfo.argsPublicKey));
    const suspended = !!params.inputOffers.length;

    Printer.print("Arguments are ready, creating root TEE order...");
    const id = generateExternalId();
    await SuperproToken.approve(OrdersFactory.address, params.holdDeposit, { from: params.consumerAddress });
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

    Printer.print("TEE order created successfully, fetching created order...");
    const action = await OrdersFactory.getOrder(params.consumerAddress, id);
    const teeOrder = new Order(action.orderId.toString());
    Printer.print("TEE order found");

    try {
        if (suspended) {
            Printer.print(`Creating ${params.inputOffers.length} sub orders...`);
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

            Printer.print("Done, starting TEE order...");
            await teeOrder.start({ from: params.consumerAddress });
        }
    } catch (e) {
        Printer.error("Error during sub orders creation, canceling all created orders...");
        try {
            const subOrders = await teeOrder.getSubOrders();

            for (let index in subOrders) {
                try {
                    const subOrder = new Order(subOrders[index]);
                    await subOrder.cancelOrder({ from: params.consumerAddress });
                } catch (error) {
                    Printer.error(`Error when canceling created order ${subOrders[index]}, order not canceled`);
                }
            }

            try {
                await teeOrder.cancelOrder({ from: params.consumerAddress });
            } catch (error) {
                Printer.error(`Error when canceling created TEE order ${params.consumerAddress}, order not canceled`);
            }

            Printer.error("Created orders have been canceled");
        } catch (e) {
            Printer.error("Error when canceling created orders, no orders canceled");
        }
        throw e;
    }

    return teeOrder.id;
};

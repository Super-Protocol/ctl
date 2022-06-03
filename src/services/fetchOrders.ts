import { getSdk } from "../gql";
import { GraphQLClient } from "graphql-request";
import { OrderStatus } from "@super-protocol/sp-sdk-js";
import { formatDate, getObjectKey } from "../utils";

export type FetchOrdersParams = {
    backendUrl: string;
    limit: number;
    cursor?: string;
    id?: string;
};

export default async (params: FetchOrdersParams) => {
    const sdk = getSdk(new GraphQLClient(params.backendUrl));

    const { result } = await sdk.Orders({
        pagination: {
            first: params.limit,
            after: params.cursor,
        },
        filter: { address: params.id },
    });

    return {
        list:
            result.page.edges?.map((item) => ({
                id: item.node?.address,
                offerName: item.node?.offerInfo?.name || item.node?.teeOfferInfo?.name,
                offerDescription: item.node?.offerInfo?.description || item.node?.teeOfferInfo?.description,
                type: item.node?.offerType,
                status: getObjectKey(item.node?.orderInfo.status, OrderStatus),
                offerId: item.node?.orderInfo.offer,
                consumerAddress: item.node?.consumer,
                parentOrderId: item.node?.parentOrder?.address,
                totalDeposit: item.node?.orderHoldDeposit,
                unspentDeposit:
                    (item.node?.orderHoldDeposit || NaN) - (item.node?.depositSpent ? +item.node?.depositSpent : 0),
                cancelebel: item.node?.offerInfo?.cancelable || false,
                modifiedDate: formatDate(item.node?.origins?.modifiedDate),
                subOrdersCount: item.node?.subOrders?.length,
                subOrders: item.node?.subOrders?.map((subItem) => ({
                    id: subItem.address,
                    type: subItem.offerType,
                    status: getObjectKey(subItem.orderInfo.status, OrderStatus),
                    offerName: subItem.offerInfo?.name || subItem.teeOfferInfo?.name,
                    offerDescription: subItem.offerInfo?.description || subItem.teeOfferInfo?.description,
                    cancelebel: subItem.offerInfo?.cancelable || false,
                    actualCost: subItem.depositSpent,
                    modifiedDate: formatDate(subItem.origins?.modifiedDate),
                })),
            })) || [],
        cursor: result.page.pageInfo!.endCursor,
    };
};

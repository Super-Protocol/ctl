import { getSdk } from "../gql";
import { GraphQLClient } from "graphql-request";
import { OrderStatus } from "@super-protocol/sdk-js";
import { formatDate, getObjectKey, weiToEther } from "../utils";
import { BigNumber } from "ethers";
import getGqlHeaders from "./gqlHeaders";

export type FetchOrdersParams = {
    backendUrl: string;
    accessToken: string;
    limit: number;
    cursor?: string;
    id?: string;
};

export default async (params: FetchOrdersParams) => {
    const sdk = getSdk(new GraphQLClient(params.backendUrl));
    const headers = getGqlHeaders(params.accessToken);

    const { result } = await sdk.Orders(
        {
            pagination: {
                first: params.limit,
                after: params.cursor,
                sortDir: "DESC",
                sortBy: "origins.createdDate",
            },
            filter: { id: params.id },
        },
        headers
    );

    return {
        list:
            result.page.edges?.map((item) => ({
                id: item.node?.id,
                offerName: item.node?.offerInfo?.name || item.node?.teeOfferInfo?.name,
                offerDescription: item.node?.offerInfo?.description || item.node?.teeOfferInfo?.description,
                type: item.node?.offerType,
                status: getObjectKey(item.node?.orderInfo.status, OrderStatus),
                offerId: item.node?.orderInfo.offer,
                consumerAddress: item.node?.consumer,
                parentOrderId: item.node?.parentOrder?.id,
                totalDeposit: weiToEther(item.node?.orderHoldDeposit),
                unspentDeposit: weiToEther(
                    BigNumber.from(item.node?.orderHoldDeposit).sub(item.node?.depositSpent ?? 0)
                ),
                cancelable: item.node?.offerInfo?.cancelable || false,
                modifiedDate: formatDate(item.node?.origins?.modifiedDate),
                subOrdersCount: item.node?.subOrders?.length,
                subOrders: item.node?.subOrders?.map((subItem) => ({
                    id: subItem.id,
                    type: subItem.offerType,
                    status: getObjectKey(subItem.orderInfo.status, OrderStatus),
                    offerName: subItem.offerInfo?.name || subItem.teeOfferInfo?.name,
                    offerDescription: subItem.offerInfo?.description || subItem.teeOfferInfo?.description,
                    cancelable: subItem.offerInfo?.cancelable || false,
                    actualCost: weiToEther(subItem.depositSpent),
                    modifiedDate: formatDate(subItem.origins?.modifiedDate),
                })),
            })) || [],
        cursor: result.page.pageInfo!.endCursor,
    };
};

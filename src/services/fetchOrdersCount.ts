import { GraphQLClient } from "graphql-request";
import { OrderStatus } from "@super-protocol/sdk-js";
import { getSdk, TOfferType } from "../gql";
import getGqlHeaders from "./gqlHeaders";

export type FetchOrdersCountParams = {
    backendUrl: string;
    accessToken: string;
    includeStatuses: OrderStatus[];
    consumer: string;
    offerType: TOfferType;
};

export default async (params: FetchOrdersCountParams): Promise<number> => {
    const sdk = getSdk(new GraphQLClient(params.backendUrl));
    const headers = getGqlHeaders(params.accessToken);

    const { result } = await sdk.OrdersCount(
        {
            filter: {
                includeStatuses: params.includeStatuses,
                consumer: params.consumer,
                offerType: params.offerType,
            },
        },
        headers
    );

    return result.pageData?.count || 0;
};

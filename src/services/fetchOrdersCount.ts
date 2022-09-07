import { GraphQLClient } from "graphql-request";
import { OrderStatus } from "@super-protocol/sdk-js";
import { getSdk, TOfferType } from "../gql";
import getGqlHeaders from "./gqlHeaders";
import { ErrorWithCustomMessage } from "../utils";

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

    try {
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
    } catch (error: any) {
        let message = "Fetching orders count error";
        if (error?.response?.errors[0]?.message) message += ": " + error.response.errors[0].message;
        throw ErrorWithCustomMessage(message, error);
    }
};

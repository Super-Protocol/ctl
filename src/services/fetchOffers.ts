import { getSdk } from "../gql";
import { GraphQLClient } from "graphql-request";
import { ErrorWithCustomMessage, formatDate, getObjectKey, weiToEther } from "../utils";
import getGqlHeaders from "./gqlHeaders";
import { OfferType } from "@super-protocol/sdk-js";

export type FetchOffersParams = {
    backendUrl: string;
    accessToken: string;
    limit: number;
    cursor?: string;
    id?: string;
    ids?: string[];
};

export type OfferDto = {
    id: string | undefined;
    name: string | undefined;
    description: string | undefined;
    type: string | undefined;
    cost: string | undefined;
    providerName: string | undefined;
    providerAddress: string | undefined;
    cancelable: boolean | undefined;
    modifiedDate: string | undefined;
    dependsOnOffers: string[];
};

export default async (params: FetchOffersParams) => {
    const sdk = getSdk(new GraphQLClient(params.backendUrl));
    const headers = getGqlHeaders(params.accessToken);

    try {
        const { result } = await sdk.Offers(
            {
                pagination: {
                    first: params.limit,
                    after: params.cursor,
                    sortDir: "DESC",
                    sortBy: "origins.createdDate",
                },
                filter: { id: params.id, ids: params.ids },
            },
            headers
        );

        return {
            list: result.page.edges?.map((item) => item) || [],
            cursor: result.page.pageInfo!.endCursor,
        };
    } catch (error: any) {
        let message = "Fetching offers error";
        if (error?.response?.errors[0]?.message) message += ": " + error.response.errors[0].message;
        throw ErrorWithCustomMessage(message, error);
    }
};

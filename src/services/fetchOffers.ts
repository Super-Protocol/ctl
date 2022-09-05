import { getSdk } from "../gql";
import { GraphQLClient } from "graphql-request";
import { formatDate, weiToEther } from "../utils";
import getGqlHeaders from "./gqlHeaders";

export type FetchOffersParams = {
    backendUrl: string;
    accessToken: string;
    limit: number;
    cursor?: string;
    id?: string;
};

export default async (params: FetchOffersParams) => {
    const sdk = getSdk(new GraphQLClient(params.backendUrl));
    const headers = getGqlHeaders(params.accessToken);

    const { result } = await sdk.Offers(
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
                name: item.node?.offerInfo?.name,
                description: item.node?.offerInfo?.description,
                type: item.node?.offerInfo.offerType,
                holdSum: weiToEther(item.node?.offerInfo.holdSum),
                providerName: item.node?.providerInfo.name,
                providerId: item.node?.origins?.createdBy,
                cancelebel: item.node?.offerInfo?.cancelable,
                modifiedDate: formatDate(item.node?.origins?.modifiedDate),
            })) || [],
        cursor: result.page.pageInfo!.endCursor,
    };
};

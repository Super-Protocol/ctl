import { getSdk } from "../gql";
import { GraphQLClient } from "graphql-request";
import { formatDate } from "../utils";

export type FetchOffersParams = {
    backendUrl: string;
    limit: number;
    cursor?: string;
    id?: string;
};

export default async (params: FetchOffersParams) => {
    const sdk = getSdk(new GraphQLClient(params.backendUrl));

    const { result } = await sdk.Offers({
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
                name: item.node?.offerInfo?.name,
                description: item.node?.offerInfo?.description,
                type: item.node?.offerInfo.offerType,
                holdSum: item.node?.offerInfo.holdSum,
                providerName: item.node?.providerInfo.name,
                providerId: item.node?.origins?.createdBy,
                cancelebel: item.node?.offerInfo?.cancelable,
                modifiedDate: formatDate(item.node?.origins?.modifiedDate),
            })) || [],
        cursor: result.page.pageInfo!.endCursor,
    };
};

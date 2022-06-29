import { getSdk } from "../gql";
import { GraphQLClient } from "graphql-request";
import { formatDate } from "../utils";

export type FetchTeeOffersParams = {
    backendUrl: string;
    limit: number;
    cursor?: string;
    id?: string;
};

export default async (params: FetchTeeOffersParams) => {
    const sdk = getSdk(new GraphQLClient(params.backendUrl));

    const { result } = await sdk.TeeOffers({
        pagination: {
            first: params.limit,
            after: params.cursor,
            sortDir: "DESC",
            sortBy: "origins.createdDate",
        },
        filter: { address: params.id },
    });

    return {
        list:
            result.page.edges?.map((item) => ({
                id: item.node?.address,
                name: item.node?.teeOfferInfo?.name,
                description: item.node?.teeOfferInfo?.description,
                providerName: item.node?.providerInfo.name,
                providerAddress: item.node?.origins?.createdBy,
                totalCores: item.node?.teeOfferInfo.slots,
                freeCores: item.node?.stats?.freeCores,
                ordersInQueue: item.node?.stats?.ordersInQueue,
                cancelebel: false,
                modifiedDate: formatDate(item.node?.origins?.modifiedDate),
            })) || [],
        cursor: result.page.pageInfo!.endCursor,
    };
};

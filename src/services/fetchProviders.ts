import { getSdk, Sdk } from "../gql";
import { GraphQLClient } from "graphql-request";

export type FetchProviderParams = {
    backendUrl: string;
    limit: number;
    cursor?: string;
    id?: string;
};

export default async (params: FetchProviderParams) => {
    const sdk = getSdk(new GraphQLClient(params.backendUrl));

    const { result } = await sdk.Providers({
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
                name: item.node?.providerInfo.name,
                description: item.node?.providerInfo.description,
                authorityAccount: item.node?.authority,
                actionAccount: item.node?.providerInfo.actionAccount,
                modifiedDate: item.node?.origins?.modifiedDate,
            })) || [],
        cursor: result.page.pageInfo!.endCursor,
    };
};

import { getSdk } from "../gql";
import { GraphQLClient } from "graphql-request";
import { formatDate } from "../utils";
import getGqlHeaders from "./gqlHeaders";

export type FetchProviderParams = {
    backendUrl: string;
    limit: number;
    accessToken: string;
    cursor?: string;
    id?: string;
};

export default async (params: FetchProviderParams) => {
    const sdk = getSdk(new GraphQLClient(params.backendUrl));
    const headers = getGqlHeaders(params.accessToken);

    const { result } = await sdk.Providers(
        {
            pagination: {
                first: params.limit,
                after: params.cursor,
                sortDir: "DESC",
                sortBy: "origins.createdDate",
            },
            filter: { address: params.id },
        },
        headers
    );

    return {
        list:
            result.page.edges?.map((item) => ({
                id: item.node?.address,
                name: item.node?.providerInfo.name,
                description: item.node?.providerInfo.description,
                authorityAccount: item.node?.authority,
                actionAccount: item.node?.providerInfo.actionAccount,
                modifiedDate: formatDate(item.node?.origins?.modifiedDate),
            })) || [],
        cursor: result.page.pageInfo!.endCursor,
    };
};

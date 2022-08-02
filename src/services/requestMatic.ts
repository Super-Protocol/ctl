import { getSdk } from "../gql";
import { GraphQLClient } from "graphql-request";
import getGqlHeaders from "./gqlHeaders";

export type RequestTeeParams = {
    backendUrl: string;
    accessToken: string;
};

export default async (params: RequestTeeParams) => {
    const sdk = getSdk(new GraphQLClient(params.backendUrl));
    const headers = getGqlHeaders(params.accessToken);

    await sdk.Transfer({}, headers);
};

import { getSdk } from "../gql";
import { GraphQLClient } from "graphql-request";

export type RequestTeeParams = {
    backendUrl: string;
    address: string;
};

export default async (params: RequestTeeParams) => {
    const sdk = getSdk(new GraphQLClient(params.backendUrl));
    await sdk.TeeTransfer({ transfer: { to: params.address } });
};

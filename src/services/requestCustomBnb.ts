import { getSdk } from '../gql';
import { GraphQLClient } from 'graphql-request';
import getGqlHeaders from './gqlHeaders';
import { ErrorWithCustomMessage } from '../utils';

export type RequestTeeParams = {
  backendUrl: string;
  accessToken: string;
  destinationAddress?: string;
};

export default async (params: RequestTeeParams): Promise<void> => {
  const sdk = getSdk(new GraphQLClient(params.backendUrl));
  const headers = getGqlHeaders(params.accessToken);

  try {
    await sdk.CustomTransfer(
      {
        ...(params.destinationAddress && { destinationAddress: params.destinationAddress }),
      },
      headers,
    );
  } catch (error: any) {
    throw ErrorWithCustomMessage(
      error?.response?.errors[0]?.message || 'BNB tokens request error',
      error,
    );
  }
};

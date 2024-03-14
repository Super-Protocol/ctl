import { getSdk } from '../gql';
import { GraphQLClient } from 'graphql-request';
import getGqlHeaders from './gqlHeaders';
import { ErrorWithCustomMessage } from '../utils';

export type RequestCustomTeeParams = {
  backendUrl: string;
  accessToken: string;
  destinationAddress?: string;
};

export default async (params: RequestCustomTeeParams): Promise<void> => {
  const sdk = getSdk(new GraphQLClient(params.backendUrl));
  const headers = getGqlHeaders(params.accessToken);

  try {
    await sdk.TeeCustomTransfer(
      {
        ...(params.destinationAddress && { destinationAddress: params.destinationAddress }),
      },
      headers,
    );
  } catch (error: any) {
    throw ErrorWithCustomMessage(
      error?.response?.errors[0]?.message || 'TEE tokens request error',
      error,
    );
  }
};

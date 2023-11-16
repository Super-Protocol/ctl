import { GraphQLClient } from 'graphql-request';
import { getSdk, MinimalConfigurationQuery } from '../gql';
import getGqlHeaders from './gqlHeaders';
import { ErrorWithCustomMessage } from '../utils';

export type FetchMinConfigurationParams = {
  backendUrl: string;
  accessToken: string;
  valueOffers: [string, string][];
};

export type MinConfiguration = Omit<MinimalConfigurationQuery['result'], '__typename'>;

export default async (params: FetchMinConfigurationParams): Promise<MinConfiguration> => {
  const sdk = getSdk(new GraphQLClient(params.backendUrl));
  const headers = getGqlHeaders(params.accessToken);

  try {
    const { result } = await sdk.MinimalConfiguration(
      {
        offers: params.valueOffers,
      },
      headers,
    );

    return result;
  } catch (error: any) {
    let message = 'Fetching minimum configuration error';
    if (error?.response?.errors[0]?.message) message += ': ' + error.response.errors[0].message;
    throw ErrorWithCustomMessage(message, error);
  }
};

import { GraphQLClient } from 'graphql-request';
import { GetMatchingTeeSlotsQuery, getSdk, TeeOfferFilter } from '../gql';
import getGqlHeaders from './gqlHeaders';
import { ErrorWithCustomMessage } from '../utils';

export type FetchMatchingTeeSlotsParams = {
  backendUrl: string;
  accessToken: string;
  filter: TeeOfferFilter;
  limit: number;
  cursor?: string;
};

export type MatchingTeeSlots = NonNullable<GetMatchingTeeSlotsQuery['result']['page']>['edges'];
export type MatchingTeeSlot = NonNullable<MatchingTeeSlots>[number]['node'];

export default async (params: FetchMatchingTeeSlotsParams): Promise<MatchingTeeSlots> => {
  const sdk = getSdk(new GraphQLClient(params.backendUrl));
  const headers = getGqlHeaders(params.accessToken);

  try {
    const { result } = await sdk.GetMatchingTeeSlots(
      {
        filter: {
          inactive: false,
          ...params.filter,
        },
        pagination: {
          first: params.limit,
          after: params.cursor,
        },
      },
      headers,
    );

    return result.page.edges || [];
  } catch (error: any) {
    let message = 'Fetching matching tee slots error';
    if (error?.response?.errors[0]?.message) message += ': ' + error.response.errors[0].message;
    throw ErrorWithCustomMessage(message, error);
  }
};

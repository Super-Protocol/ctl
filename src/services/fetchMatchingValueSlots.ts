import { getSdk, OfferSlotPair } from '../gql';
import { GraphQLClient } from 'graphql-request';
import getGqlHeaders from './gqlHeaders';
import { ErrorWithCustomMessage } from '../utils';

export type FetchMatchingValueSlotsParams = {
  backendUrl: string;
  accessToken: string;
  offerIds: string[];
  minRentMinutes?: number;
};

type MatchingValueSlots = OfferSlotPair[];
export default async (params: FetchMatchingValueSlotsParams): Promise<MatchingValueSlots> => {
  const sdk = getSdk(new GraphQLClient(params.backendUrl));
  const headers = getGqlHeaders(params.accessToken);

  try {
    const { result } = await sdk.autoSelectValueSlots(
      {
        offerIds: params.offerIds,
        minTimeMinutes: params.minRentMinutes,
      },
      headers,
    );

    return result;
  } catch (err: any) {
    const message = 'Fetching matching value slots error';
    const errMessage = err?.response?.errors[0]?.message
      ? `${message}: ${err.response.errors[0].message}`
      : message;

    throw ErrorWithCustomMessage(message, errMessage);
  }
};

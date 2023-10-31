import { OffersQuery, getSdk } from '../gql';
import { GraphQLClient } from 'graphql-request';
import { ErrorWithCustomMessage, formatDate, getObjectKey } from '../utils';
import getGqlHeaders from './gqlHeaders';
import { OfferType } from '@super-protocol/sdk-js';

export type FetchOffersParams = {
  backendUrl: string;
  accessToken: string;
  limit: number;
  cursor?: string;
  id?: string;
  ids?: string[];
};

export type OfferDto = {
  id: string | undefined;
  name: string | undefined;
  description: string | undefined;
  type: string | undefined;
  providerName: string | undefined;
  providerAddress: string | undefined;
  cancelable: boolean | undefined;
  modifiedDate: string | undefined;
  dependsOnOffers: string[];
  enabled?: boolean;
};

export type OfferItem = NonNullable<OffersQuery['result']['page']['edges']>[number]['node'];

export type OfferItemSlots = NonNullable<OfferItem>['slots'];

export const formatFetchedOffer = (item: OfferItem): OfferDto => {
  return {
    id: item?.id,
    name: item?.offerInfo?.name,
    description: item?.offerInfo?.description,
    type: getObjectKey(item?.offerInfo.offerType, OfferType),
    providerName: item?.providerInfo.name,
    providerAddress: item?.origins?.createdBy,
    cancelable: item?.offerInfo?.cancelable,
    modifiedDate: formatDate(item?.origins?.modifiedDate),
    dependsOnOffers: item?.offerInfo.restrictions?.offers || [],
    enabled: item?.enabled,
  };
};

export default async (
  params: FetchOffersParams,
): Promise<{ list: OfferItem[]; cursor: string }> => {
  const sdk = getSdk(new GraphQLClient(params.backendUrl));
  const headers = getGqlHeaders(params.accessToken);

  try {
    const { result } = await sdk.Offers(
      {
        pagination: {
          first: params.limit,
          after: params.cursor,
          sortDir: 'DESC',
          sortBy: 'origins.createdDate',
        },
        filter: { id: params.id, ids: params.ids },
      },
      headers,
    );

    return {
      list: result.page.edges?.map((item) => item.node) || [],
      cursor: result.page.pageInfo?.endCursor || '',
    };
  } catch (error: any) {
    let message = 'Fetching offers error';
    if (error?.response?.errors[0]?.message) message += ': ' + error.response.errors[0].message;
    throw ErrorWithCustomMessage(message, error);
  }
};

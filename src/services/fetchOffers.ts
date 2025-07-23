import { OffersQuery, getSdk } from '../gql';
import { GraphQLClient } from 'graphql-request';
import { ErrorWithCustomMessage, formatDate, getObjectKey } from '../utils';
import getGqlHeaders from './gqlHeaders';
import { OfferType } from '@super-protocol/sdk-js';
import doWithRetries from './doWithRetries';
import { getErrorMessage } from '../error.utils';

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
  providerAddress: string | null | undefined;
  cancelable: boolean | undefined;
  modifiedDate: string | undefined;
  dependsOnOffers: string[];
  slots: string[];
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
    providerAddress: item?.authority,
    cancelable: item?.offerInfo?.cancelable,
    modifiedDate: formatDate(item?.origins?.modifiedDate),
    dependsOnOffers: item?.offerInfo.restrictions?.offers?.map((o) => o.id!) || [],
    slots: item?.slots.map((slot) => slot.id) || [],
    enabled: item?.enabled,
  };
};

export default async (
  params: FetchOffersParams,
): Promise<{ list: OfferItem[]; cursor: string }> => {
  const sdk = getSdk(new GraphQLClient(params.backendUrl));
  const headers = getGqlHeaders(params.accessToken);

  try {
    const { result } = await doWithRetries(() =>
      sdk.Offers(
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
      ),
    );

    return {
      list: result.page.edges?.map((item) => item.node) || [],
      cursor: result.page.pageInfo?.endCursor || '',
    };
  } catch (error: unknown) {
    throw ErrorWithCustomMessage(getErrorMessage(error, 'Fetching offers error'), error);
  }
};

import { TeeOfferFilter, TeeOffersQuery, getSdk } from '../gql';
import { GraphQLClient } from 'graphql-request';
import { ErrorWithCustomMessage, formatDate } from '../utils';
import getGqlHeaders from './gqlHeaders';
import { TeeOfferSlot } from '@super-protocol/sdk-js';

export type FetchTeeOffersParams = {
  backendUrl: string;
  accessToken: string;
  limit: number;
  cursor?: string;
  filter?: TeeOfferFilter;
};

export type TeeOfferDto = {
  id?: string;
  name?: string;
  description?: string;
  providerName?: string;
  providerAddress?: string;
  totalCores?: number;
  freeCores?: number | null;
  slots?: TeeOfferSlot[];
  ordersInQueue?: number;
  cancelable?: boolean;
  modifiedDate?: string;
  enabled?: boolean;
};

export type TeeOfferItem = NonNullable<TeeOffersQuery['result']['page']['edges']>[number]['node'];

export type TeeOfferItemSlots = NonNullable<TeeOfferItem>['slots'];
export type TeeOfferItemOptions = NonNullable<TeeOfferItem>['options'];

export const formatFetchedTeeOffer = (item: TeeOfferItem): TeeOfferDto => {
  return {
    id: item?.id,
    name: item?.teeOfferInfo?.name,
    description: item?.teeOfferInfo?.description,
    providerName: item?.providerInfo.name,
    providerAddress: item?.authority,
    totalCores: item?.teeOfferInfo?.hardwareInfo?.slotInfo?.cpuCores,
    freeCores: item?.stats?.freeCores,
    slots: item?.slots,
    ordersInQueue: (item?.stats?.new || 0) + (item?.stats?.processing || 0),
    cancelable: false,
    modifiedDate: formatDate(item?.origins?.modifiedDate),
    enabled: item?.enabled,
  };
};

export default async (
  params: FetchTeeOffersParams,
): Promise<{ list: TeeOfferItem[]; cursor: string }> => {
  const sdk = getSdk(new GraphQLClient(params.backendUrl));
  const headers = getGqlHeaders(params.accessToken);

  try {
    const { result } = await sdk.TeeOffers(
      {
        pagination: {
          first: params.limit,
          after: params.cursor,
          sortDir: 'DESC',
          sortBy: 'origins.createdDate',
        },
        filter: params.filter,
      },
      headers,
    );

    return {
      list: result.page.edges?.map((item) => item.node) || [],
      cursor: result.page.pageInfo?.endCursor || '',
    };
  } catch (error: any) {
    let message = 'Fetching tee offers error';
    if (error?.response?.errors[0]?.message) message += ': ' + error.response.errors[0].message;
    throw ErrorWithCustomMessage(message, error);
  }
};

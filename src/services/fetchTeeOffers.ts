import { TeeOffersQuery, getSdk } from '../gql';
import { GraphQLClient } from 'graphql-request';
import { ErrorWithCustomMessage, formatDate } from '../utils';
import getGqlHeaders from './gqlHeaders';
import { TeeOfferSlot } from '@super-protocol/sdk-js';

export type FetchTeeOffersParams = {
  backendUrl: string;
  accessToken: string;
  limit: number;
  cursor?: string;
  id?: string;
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

export type TeeOfferItem = NonNullable<TeeOffersQuery['result']['page']['edges']>[number];

export type TeeOfferItemOptions = NonNullable<TeeOfferItem['node']>['options'];

export const formatFetchedTeeOffer = (item: TeeOfferItem): TeeOfferDto => {
  return {
    id: item.node?.id,
    name: item.node?.teeOfferInfo?.name,
    description: item.node?.teeOfferInfo?.description,
    providerName: item.node?.providerInfo.name,
    providerAddress: item.node?.origins?.createdBy,
    totalCores: item.node?.teeOfferInfo?.hardwareInfo?.slotInfo?.cpuCores,
    freeCores: item.node?.stats?.freeCores,
    slots: item.node?.slots,
    ordersInQueue: (item.node?.stats?.new || 0) + (item.node?.stats?.processing || 0),
    cancelable: false,
    modifiedDate: formatDate(item.node?.origins?.modifiedDate),
    enabled: item.node?.enabled,
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
        filter: { id: params.id },
      },
      headers,
    );

    return {
      list: result.page.edges?.map((item) => item) || [],
      cursor: result.page.pageInfo?.endCursor || '',
    };
  } catch (error: any) {
    let message = 'Fetching tee offers error';
    if (error?.response?.errors[0]?.message) message += ': ' + error.response.errors[0].message;
    throw ErrorWithCustomMessage(message, error);
  }
};

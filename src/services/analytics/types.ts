import { IAnalyticsConfig } from '../../config';
import { TOfferType } from '../../gql';

export interface IAnalyticsOption extends IAnalyticsConfig {
  userId: string;
}

export enum Platform {
  web = 'web',
  cli = 'cli',
  oracle = 'oracle',
}

export enum AnalyticEvent {
  ORDER_CREATED = 'order_created',
  TEE_TOKENS_REPLENISHED = 'get_tee',
  MATIC_TOKENS_REPLENISHED = 'get_matic',
  FILE_UPLOAD = 'order_creation_file_upload',
  ORDER_RESULT_DOWNLOAD = 'order_result_download',
}
export interface ISlot {
  id: string;
  count: number;
}
export interface IOption {
  id: string;
  count: number;
}
export interface IAnalyticsOffer {
  offer?: string;
  slot?: ISlot | null;
  options?: IOption[] | null;
  offerType: TOfferType;
}
export interface IOrderEventProperties {
  orderId: string;
  offers: IAnalyticsOffer[];
}

export interface IEventProperties {
  result: string;
  error?: string;
}

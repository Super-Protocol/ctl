import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type Attestation = {
  __typename?: 'Attestation';
  solutions: Array<Solution>;
};

export type BaseOrder = {
  __typename?: 'BaseOrder';
  /** system identifier */
  _id: Scalars['String'];
  accumulatedOptionsInfo: OptionInfo;
  accumulatedSlotInfo: SlotInfo;
  accumulatedSlotUsage: SlotUsage;
  authority?: Maybe<Scalars['String']>;
  awaitingPayment: Scalars['Boolean'];
  consumer: Scalars['String'];
  depositSpent?: Maybe<Scalars['String']>;
  /** blockchain id */
  id: Scalars['String'];
  offerInfo?: Maybe<OfferInfo>;
  offerType: TOfferType;
  orderDeposit?: Maybe<Scalars['String']>;
  orderInfo: OrderInfo;
  orderOutputReserve?: Maybe<Scalars['String']>;
  orderResult: OrderResult;
  origins?: Maybe<Origins>;
  selectedUsage?: Maybe<OrderUsage>;
  startDate: Scalars['Float'];
  teeOfferInfo?: Maybe<TeeOfferInfo>;
  totalDeposit?: Maybe<Scalars['String']>;
  totalDepositSpent?: Maybe<Scalars['String']>;
  totalDepositUnspent?: Maybe<Scalars['String']>;
};

export type BaseOrderInputType = {
  accumulatedOptionsInfo: OptionInfoInput;
  accumulatedSlotInfo: SlotInfoInput;
  accumulatedSlotUsage: SlotUsageInput;
  awaitingPayment: Scalars['Boolean'];
  consumer: Scalars['String'];
  depositSpent?: InputMaybe<Scalars['String']>;
  offerInfo?: InputMaybe<OfferInfoInput>;
  offerType: TOfferType;
  orderDeposit?: InputMaybe<Scalars['String']>;
  orderInfo: OrderInfoInput;
  orderOutputReserve?: InputMaybe<Scalars['String']>;
  orderResult: OrderResultInput;
  selectedUsage?: InputMaybe<OrderUsageInput>;
  startDate: Scalars['Float'];
  teeOfferInfo?: InputMaybe<TeeOfferInfoInput>;
  totalDeposit?: InputMaybe<Scalars['String']>;
  totalDepositSpent?: InputMaybe<Scalars['String']>;
  totalDepositUnspent?: InputMaybe<Scalars['String']>;
};

export type Config = {
  __typename?: 'Config';
  /** system identifier */
  _id: Scalars['String'];
  name: Scalars['String'];
  updatedAt?: Maybe<Scalars['DateTime']>;
  value: ValueObject;
};

export type ConfigConnection = {
  __typename?: 'ConfigConnection';
  edges?: Maybe<Array<ConfigEdge>>;
  pageInfo?: Maybe<ConfigPageInfo>;
};

export type ConfigEdge = {
  __typename?: 'ConfigEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Config>;
};

export type ConfigFilter = {
  /** filter by config name */
  name?: InputMaybe<Scalars['String']>;
};

export type ConfigInputType = {
  /** system identifier */
  _id: Scalars['String'];
  name: Scalars['String'];
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  value: ValueObjectType;
};

export type ConfigPageInfo = {
  __typename?: 'ConfigPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type ConnectionArgs = {
  /** Paginate after opaque cursor */
  after?: InputMaybe<Scalars['String']>;
  /** Paginate before opaque cursor */
  before?: InputMaybe<Scalars['String']>;
  /** Paginate first */
  first?: InputMaybe<Scalars['Float']>;
  /** Paginate last */
  last?: InputMaybe<Scalars['Float']>;
  /** sort */
  sort?: InputMaybe<Array<SortParam>>;
  /** sort field name (deprecated, use "sort" field) */
  sortBy?: InputMaybe<Scalars['String']>;
  /** sort directory - ASC or DESC. Default value ASC (deprecated, use "sort" field) */
  sortDir?: InputMaybe<Scalars['String']>;
};

export type CoresStatisticPoint = {
  __typename?: 'CoresStatisticPoint';
  timestamp: Scalars['Float'];
  totalCpuCores: Scalars['Float'];
  totalGpuCores: Scalars['Float'];
  useCpuCores: Scalars['Float'];
  useGpuCores: Scalars['Float'];
};

export type Erc20 = {
  __typename?: 'Erc20';
  /** system identifier */
  _id: Scalars['String'];
  balance?: Maybe<Scalars['String']>;
  netBalance: Scalars['String'];
  /** owner address */
  owner: Scalars['String'];
  providerName?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type Erc20Connection = {
  __typename?: 'Erc20Connection';
  edges?: Maybe<Array<Erc20Edge>>;
  pageInfo?: Maybe<Erc20PageInfo>;
};

export type Erc20Edge = {
  __typename?: 'Erc20Edge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Erc20>;
};

export type Erc20InputType = {
  /** system identifier */
  _id: Scalars['String'];
  balance?: InputMaybe<Scalars['String']>;
  netBalance: Scalars['String'];
  /** owner address */
  owner: Scalars['String'];
  providerName?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
};

export type Erc20PageInfo = {
  __typename?: 'Erc20PageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type Erc20rFilter = {
  /** filter by owner address */
  owner?: InputMaybe<Scalars['String']>;
};

export type Event = {
  __typename?: 'Event';
  _id: Scalars['String'];
  change?: Maybe<Scalars['String']>;
  consumer?: Maybe<Scalars['String']>;
  contract: Scalars['String'];
  createdAt: Scalars['DateTime'];
  deposit?: Maybe<Scalars['String']>;
  externalId?: Maybe<Scalars['String']>;
  from?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  offerId?: Maybe<Scalars['String']>;
  orderId: Scalars['String'];
  orderStatus?: Maybe<Scalars['String']>;
  owner?: Maybe<Scalars['String']>;
  parentOrderId?: Maybe<Scalars['String']>;
  profit?: Maybe<Scalars['String']>;
  spender?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
  transactionBlockNumber: Scalars['Float'];
  transactionHash: Scalars['String'];
  transactionTimestamp: Scalars['Float'];
  value?: Maybe<Scalars['String']>;
};

export type EventConnection = {
  __typename?: 'EventConnection';
  edges?: Maybe<Array<EventEdge>>;
  pageInfo?: Maybe<EventPageInfo>;
};

export type EventDataFilter = {
  /** retrieve events saved in the database on or after the specified date (createdAtFrom) */
  createdAtFrom?: InputMaybe<Scalars['DateTime']>;
  /** retrieve events saved in the database on or before the specified date (createdAtTo) */
  createdAtTo?: InputMaybe<Scalars['DateTime']>;
  /** filter by event name */
  name?: InputMaybe<Scalars['String']>;
  /** filter by order ID */
  orderId?: InputMaybe<Scalars['String']>;
  /** filter by order IDs */
  orderIds?: InputMaybe<Array<Scalars['String']>>;
  /** filter by parent order ID */
  parentOrderId?: InputMaybe<Scalars['String']>;
};

export type EventDataInput = {
  _id: Scalars['String'];
  change?: InputMaybe<Scalars['String']>;
  consumer?: InputMaybe<Scalars['String']>;
  contract: Scalars['String'];
  deposit?: InputMaybe<Scalars['String']>;
  externalId?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  offerId?: InputMaybe<Scalars['String']>;
  orderId: Scalars['String'];
  orderStatus?: InputMaybe<Scalars['String']>;
  owner?: InputMaybe<Scalars['String']>;
  parentOrderId?: InputMaybe<Scalars['String']>;
  profit?: InputMaybe<Scalars['String']>;
  spender?: InputMaybe<Scalars['String']>;
  to?: InputMaybe<Scalars['String']>;
  transactionBlockNumber: Scalars['Float'];
  transactionHash: Scalars['String'];
  transactionTimestamp: Scalars['Float'];
  value?: InputMaybe<Scalars['String']>;
};

export type EventEdge = {
  __typename?: 'EventEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Event>;
};

export type EventFilter = {
  /** filter events by custom params */
  events?: InputMaybe<Array<EventSource>>;
};

export type EventFilterField = {
  /** filter events by consumer */
  consumer?: InputMaybe<Scalars['String']>;
  /** filter by offerType */
  offerType?: InputMaybe<TOfferType>;
};

export type EventPageInfo = {
  __typename?: 'EventPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type EventSource = {
  /** filter */
  filter?: InputMaybe<EventFilterField>;
  /** subscribe on this events by source */
  source?: InputMaybe<SubscriptionSource>;
};

export type HardwareInfo = {
  __typename?: 'HardwareInfo';
  optionInfo: OptionInfo;
  slotInfo: SlotInfo;
};

export type HardwareInfoInput = {
  optionInfo: OptionInfoInput;
  slotInfo: SlotInfoInput;
};

export type ListConfigResponse = {
  __typename?: 'ListConfigResponse';
  page: ConfigConnection;
  pageData?: Maybe<PageDataDto>;
};

export type ListErc20Response = {
  __typename?: 'ListErc20Response';
  page: Erc20Connection;
  pageData?: Maybe<PageDataDto>;
};

export type ListEventResponse = {
  __typename?: 'ListEventResponse';
  page: EventConnection;
  pageData?: Maybe<PageDataDto>;
};

export type ListOffersResponse = {
  __typename?: 'ListOffersResponse';
  page: OfferConnection;
  pageData?: Maybe<PageDataDto>;
};

export type ListOrdersResponse = {
  __typename?: 'ListOrdersResponse';
  page: OrderConnection;
  pageData?: Maybe<PageDataDto>;
};

export type ListProvidersResponse = {
  __typename?: 'ListProvidersResponse';
  page: ProviderConnection;
  pageData?: Maybe<PageDataDto>;
};

export type ListTeeOffersAndSlots = {
  __typename?: 'ListTeeOffersAndSlots';
  page: TeeOffersAndSLotsConnection;
  pageData?: Maybe<PageDataDto>;
};

export type ListTeeOffersResponse = {
  __typename?: 'ListTeeOffersResponse';
  page: TeeOfferConnection;
  pageData?: Maybe<PageDataDto>;
};

export type MatchingOptionResult = {
  __typename?: 'MatchingOptionResult';
  count: Scalars['Float'];
  id: Scalars['String'];
  info: OptionInfo;
  usage: SlotUsage;
};

export type MatchingOptions = {
  __typename?: 'MatchingOptions';
  cumulativeValues: OptionInfo;
  optionResults: Array<MatchingOptionResult>;
  priceFixed: Scalars['String'];
  pricePerHour: Scalars['String'];
};

export type MatchingOptionsType = {
  cumulativeValues: OptionInfoInput;
  optionResults: Array<MatchingTeeOfferOptionInput>;
  priceFixed: Scalars['String'];
  pricePerHour: Scalars['String'];
};

export type MatchingSlot = {
  __typename?: 'MatchingSlot';
  multiplier: Scalars['Float'];
  price: Scalars['String'];
  slot: TeeOfferSlot;
};

export type MatchingSlotType = {
  multiplier: Scalars['Float'];
  price: Scalars['String'];
  slot: TeeOfferSlotInput;
};

export type MatchingTeeOfferOptionInput = {
  count: Scalars['Float'];
  id: Scalars['String'];
  info: OptionInfoInput;
  usage: SlotUsageInput;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Transfers custom amount of coins to specific address */
  customTransfer: Scalars['Boolean'];
  /** Transfers custom amount of TEE tokens to specific address */
  teeCustomTransfer: Scalars['Boolean'];
  /** Transfers specific amount of TEE tokens to specific address */
  teeTransfer: Scalars['Boolean'];
  /** Transfers specific amount of coins to specific address */
  transfer: Scalars['Boolean'];
};


export type MutationCustomTransferArgs = {
  amount?: InputMaybe<Scalars['String']>;
  destinationAddress?: InputMaybe<Scalars['String']>;
};


export type MutationTeeCustomTransferArgs = {
  amount?: InputMaybe<Scalars['String']>;
  destinationAddress?: InputMaybe<Scalars['String']>;
};


export type MutationTeeTransferArgs = {
  destinationAddress?: InputMaybe<Scalars['String']>;
};


export type MutationTransferArgs = {
  destinationAddress?: InputMaybe<Scalars['String']>;
};

export type Offer = {
  __typename?: 'Offer';
  /** system identifier */
  _id: Scalars['String'];
  authority?: Maybe<Scalars['String']>;
  disabledAfter: Scalars['Float'];
  enabled: Scalars['Boolean'];
  /** blockchain id */
  id: Scalars['String'];
  inactive?: Maybe<Scalars['Boolean']>;
  offerInfo: OfferInfo;
  origins?: Maybe<Origins>;
  providerInfo: ProviderInformation;
  slots: Array<OfferSlot>;
  stats?: Maybe<OfferStats>;
};

export type OfferConfiguration = {
  __typename?: 'OfferConfiguration';
  bandwidth: Scalars['Float'];
  cpuCores: Scalars['Float'];
  diskUsage: Scalars['Float'];
  externalPort: Scalars['Float'];
  gpuCores: Scalars['Float'];
  maxTimeMinutes: Scalars['Float'];
  minTimeMinutes: Scalars['Float'];
  priceFixed: Scalars['String'];
  pricePerHour: Scalars['String'];
  ram: Scalars['Float'];
  /** @deprecated use minTimeMinutes/maxTimeMinutes instead */
  time: Array<Scalars['Float']>;
  traffic: Scalars['Float'];
  vram: Scalars['Float'];
};

export type OfferConnection = {
  __typename?: 'OfferConnection';
  edges?: Maybe<Array<OfferEdge>>;
  pageInfo?: Maybe<OfferPageInfo>;
};

export type OfferEdge = {
  __typename?: 'OfferEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Offer>;
};

export type OfferFilter = {
  /** filter by enabled, "false" by default */
  enabled?: InputMaybe<Scalars['Boolean']>;
  /** exclude offers with selected ids */
  excludeIds?: InputMaybe<Array<Scalars['String']>>;
  /** exclude filter by offerInfo -> restrictions -> type */
  excludeOfferRestrictionType?: InputMaybe<Array<TOfferType>>;
  /** filter by offerInfo → group */
  group?: InputMaybe<Scalars['String']>;
  /** filter by blockchain id */
  id?: InputMaybe<Scalars['String']>;
  /** filter by offer ids */
  ids?: InputMaybe<Array<Scalars['String']>>;
  /** filter by inactive, "false" by default */
  inactive?: InputMaybe<Scalars['Boolean']>;
  /** include filter by offerInfo -> restrictions -> type */
  includeOfferRestrictionType?: InputMaybe<Array<TOfferType>>;
  /** filter by offerInfo → name */
  name?: InputMaybe<Scalars['String']>;
  /** filter by offerInfo -> type */
  offerType?: InputMaybe<TOfferType>;
  /** filter by providerInfo → actionAccount */
  providerActionAccounts?: InputMaybe<Array<Scalars['String']>>;
  /** filter by offerInfo -> restrictions -> offers */
  restrictions?: InputMaybe<Array<Scalars['String']>>;
  /** get only compatible with selected offers */
  selectedOfferIds?: InputMaybe<Array<Scalars['String']>>;
};

export type OfferInfo = {
  __typename?: 'OfferInfo';
  allowedAccounts: Array<Scalars['String']>;
  allowedArgs?: Maybe<Scalars['String']>;
  argsPublicKey: Scalars['String'];
  cancelable: Scalars['Boolean'];
  description: Scalars['String'];
  /**
   * The supported offers group.
   *
   *      0 - Input,
   *
   *      1 - Output
   *
   */
  group: Scalars['String'];
  hash: Scalars['String'];
  input: Scalars['String'];
  linkage: Scalars['String'];
  metadata: Scalars['String'];
  name: Scalars['String'];
  /**
   * The supported offers type.
   *
   *      TeeOffer = '0',
   *
   *      Storage = '1',
   *
   *      Solution = '2',
   *
   *      Data = '3'
   *
   */
  offerType: Scalars['String'];
  output: Scalars['String'];
  restrictions?: Maybe<OfferRestrictions>;
  resultResource: Scalars['String'];
};

export type OfferInfoInput = {
  allowedAccounts: Array<Scalars['String']>;
  allowedArgs?: InputMaybe<Scalars['String']>;
  argsPublicKey: Scalars['String'];
  cancelable: Scalars['Boolean'];
  description: Scalars['String'];
  /**
   * The supported offers group.
   *
   *      0 - Input,
   *
   *      1 - Output
   *
   */
  group: Scalars['String'];
  hash: Scalars['String'];
  input: Scalars['String'];
  linkage: Scalars['String'];
  metadata: Scalars['String'];
  name: Scalars['String'];
  /**
   * The supported offers type.
   *
   *      TeeOffer = '0',
   *
   *      Storage = '1',
   *
   *      Solution = '2',
   *
   *      Data = '3'
   *
   */
  offerType: Scalars['String'];
  output: Scalars['String'];
  restrictions?: InputMaybe<OfferRestrictionsInput>;
  resultResource: Scalars['String'];
};

export type OfferInputType = {
  disabledAfter: Scalars['Float'];
  enabled: Scalars['Boolean'];
  inactive?: InputMaybe<Scalars['Boolean']>;
  offerInfo: OfferInfoInput;
  providerInfo: ProviderInformationInput;
  slots: Array<OfferSlotInput>;
  stats?: InputMaybe<OfferStatsInput>;
};

export type OfferPageInfo = {
  __typename?: 'OfferPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type OfferRestrictions = {
  __typename?: 'OfferRestrictions';
  offers?: Maybe<Array<Scalars['String']>>;
  types?: Maybe<Array<Scalars['String']>>;
};

export type OfferRestrictionsInput = {
  offers?: InputMaybe<Array<Scalars['String']>>;
  types?: InputMaybe<Array<Scalars['String']>>;
};

export type OfferSlot = {
  __typename?: 'OfferSlot';
  id: Scalars['String'];
  info: SlotInfo;
  option: OptionInfo;
  usage: SlotUsage;
};

export type OfferSlotInput = {
  id: Scalars['String'];
  info: SlotInfoInput;
  option: OptionInfoInput;
  usage: SlotUsageInput;
};

export type OfferSlotPair = {
  __typename?: 'OfferSlotPair';
  offerId: Scalars['String'];
  slotId: Scalars['String'];
};

export type OfferStats = {
  __typename?: 'OfferStats';
  blocked?: Maybe<Scalars['Float']>;
  canceled?: Maybe<Scalars['Float']>;
  canceling?: Maybe<Scalars['Float']>;
  done?: Maybe<Scalars['Float']>;
  error?: Maybe<Scalars['Float']>;
  freeCores?: Maybe<Scalars['Float']>;
  new?: Maybe<Scalars['Float']>;
  ordersInQueue?: Maybe<Scalars['Float']>;
  processing?: Maybe<Scalars['Float']>;
  suspended?: Maybe<Scalars['Float']>;
};

export type OfferStatsInput = {
  blocked?: InputMaybe<Scalars['Float']>;
  canceled?: InputMaybe<Scalars['Float']>;
  canceling?: InputMaybe<Scalars['Float']>;
  done?: InputMaybe<Scalars['Float']>;
  error?: InputMaybe<Scalars['Float']>;
  freeCores?: InputMaybe<Scalars['Float']>;
  new?: InputMaybe<Scalars['Float']>;
  ordersInQueue?: InputMaybe<Scalars['Float']>;
  processing?: InputMaybe<Scalars['Float']>;
  suspended?: InputMaybe<Scalars['Float']>;
};

/** The supported offers type. */
export enum OfferType {
  Data = 'Data',
  Solution = 'Solution',
  Storage = 'Storage',
  TeeOffer = 'TeeOffer'
}

export type OptionInfo = {
  __typename?: 'OptionInfo';
  bandwidth: Scalars['Float'];
  externalPort: Scalars['Float'];
  traffic: Scalars['Float'];
};

export type OptionInfoInput = {
  bandwidth: Scalars['Float'];
  externalPort: Scalars['Float'];
  traffic: Scalars['Float'];
};

export type Order = {
  __typename?: 'Order';
  /** system identifier */
  _id: Scalars['String'];
  accumulatedOptionsInfo: OptionInfo;
  accumulatedSlotInfo: SlotInfo;
  accumulatedSlotUsage: SlotUsage;
  authority?: Maybe<Scalars['String']>;
  awaitingPayment: Scalars['Boolean'];
  consumer: Scalars['String'];
  depositSpent?: Maybe<Scalars['String']>;
  /** blockchain id */
  id: Scalars['String'];
  offerInfo?: Maybe<OfferInfo>;
  offerType: TOfferType;
  orderDeposit?: Maybe<Scalars['String']>;
  orderInfo: OrderInfo;
  orderOutputReserve?: Maybe<Scalars['String']>;
  orderResult: OrderResult;
  origins?: Maybe<Origins>;
  parentOrder?: Maybe<ParentOrder>;
  providerInfo: ProviderInformation;
  selectedUsage?: Maybe<OrderUsage>;
  startDate: Scalars['Float'];
  subOrders?: Maybe<Array<BaseOrder>>;
  teeOfferInfo?: Maybe<TeeOfferInfo>;
  totalDeposit?: Maybe<Scalars['String']>;
  totalDepositSpent?: Maybe<Scalars['String']>;
  totalDepositUnspent?: Maybe<Scalars['String']>;
};

export type OrderArgs = {
  __typename?: 'OrderArgs';
  inputOffers: Array<Scalars['String']>;
  outputOffer: Scalars['String'];
};

export type OrderArgsInput = {
  inputOffers: Array<Scalars['String']>;
  outputOffer: Scalars['String'];
};

export type OrderConnection = {
  __typename?: 'OrderConnection';
  edges?: Maybe<Array<OrderEdge>>;
  pageInfo?: Maybe<OrderPageInfo>;
};

export type OrderEdge = {
  __typename?: 'OrderEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Order>;
};

export enum OrderEventType {
  OrderCreated = 'orderCreated',
  OrderUpdated = 'orderUpdated',
  SuborderCreated = 'suborderCreated',
  SuborderUpdated = 'suborderUpdated'
}

export type OrderEventsUpdated = {
  __typename?: 'OrderEventsUpdated';
  _id: Scalars['String'];
  change?: Maybe<Scalars['String']>;
  consumer?: Maybe<Scalars['String']>;
  contract: Scalars['String'];
  createdAt: Scalars['DateTime'];
  deposit?: Maybe<Scalars['String']>;
  externalId?: Maybe<Scalars['String']>;
  from?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  offerId?: Maybe<Scalars['String']>;
  orderId: Scalars['String'];
  orderStatus?: Maybe<Scalars['String']>;
  owner?: Maybe<Scalars['String']>;
  parentOrderId?: Maybe<Scalars['String']>;
  profit?: Maybe<Scalars['String']>;
  spender?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
  transactionBlockNumber: Scalars['Float'];
  transactionHash: Scalars['String'];
  transactionTimestamp: Scalars['Float'];
  value?: Maybe<Scalars['String']>;
};

export type OrderEventsUpdatedInput = {
  /** filter by order ids */
  orderIds?: InputMaybe<Array<Scalars['String']>>;
  /** filter by parent order ids */
  parentOrderIds?: InputMaybe<Array<Scalars['String']>>;
};

export type OrderInfo = {
  __typename?: 'OrderInfo';
  args: OrderArgs;
  encryptedArgs: Scalars['String'];
  externalId: Scalars['String'];
  offerId: Scalars['String'];
  resultInfo: OrderResultInfo;
  /**
   * description of values:
   * 
   *     New = '0',
   *
   *     Processing = '1',
   *
   *     Canceling = '2',
   *
   *     Canceled = '3',
   *
   *     Done = '4',
   *
   *     Error = '5',
   *
   *     Blocked = '6',
   *
   *     Suspended = '7',
   *
   *     AwaitingPayment = '8'
   *
   *
   */
  status: Scalars['String'];
};

export type OrderInfoInput = {
  args: OrderArgsInput;
  encryptedArgs: Scalars['String'];
  externalId: Scalars['String'];
  offerId: Scalars['String'];
  resultInfo: OrderResultInfoInput;
  /**
   * description of values:
   * 
   *     New = '0',
   *
   *     Processing = '1',
   *
   *     Canceling = '2',
   *
   *     Canceled = '3',
   *
   *     Done = '4',
   *
   *     Error = '5',
   *
   *     Blocked = '6',
   *
   *     Suspended = '7',
   *
   *     AwaitingPayment = '8'
   *
   *
   */
  status: Scalars['String'];
};

export type OrderInputType = {
  accumulatedOptionsInfo: OptionInfoInput;
  accumulatedSlotInfo: SlotInfoInput;
  accumulatedSlotUsage: SlotUsageInput;
  awaitingPayment: Scalars['Boolean'];
  consumer: Scalars['String'];
  depositSpent?: InputMaybe<Scalars['String']>;
  offerInfo?: InputMaybe<OfferInfoInput>;
  offerType: TOfferType;
  orderDeposit?: InputMaybe<Scalars['String']>;
  orderInfo: OrderInfoInput;
  orderOutputReserve?: InputMaybe<Scalars['String']>;
  orderResult: OrderResultInput;
  parentOrder?: InputMaybe<ParentOrderInputType>;
  providerInfo: ProviderInformationInput;
  selectedUsage?: InputMaybe<OrderUsageInput>;
  startDate: Scalars['Float'];
  subOrders?: InputMaybe<Array<BaseOrderInputType>>;
  teeOfferInfo?: InputMaybe<TeeOfferInfoInput>;
  totalDeposit?: InputMaybe<Scalars['String']>;
  totalDepositSpent?: InputMaybe<Scalars['String']>;
  totalDepositUnspent?: InputMaybe<Scalars['String']>;
};

export type OrderObject = {
  __typename?: 'OrderObject';
  accumulatedOptionsInfo: OptionInfo;
  accumulatedSlotInfo: SlotInfo;
  accumulatedSlotUsage: SlotUsage;
  awaitingPayment?: Maybe<Scalars['Boolean']>;
  consumer: Scalars['String'];
  depositSpent?: Maybe<Scalars['String']>;
  /** blockchain id */
  id: Scalars['String'];
  offerInfo?: Maybe<OfferInfo>;
  offerType: Scalars['String'];
  orderDeposit?: Maybe<Scalars['String']>;
  /** blockchain id */
  orderId: Scalars['String'];
  orderInfo: OrderInfo;
  orderOutputReserve?: Maybe<Scalars['String']>;
  orderResult: OrderResult;
  origins?: Maybe<Origins>;
  parentOrder?: Maybe<Scalars['String']>;
  selectedUsage: OrderUsage;
  startDate: Scalars['Float'];
  subOrders: Array<Scalars['String']>;
  teeOfferInfo?: Maybe<TeeOfferInfo>;
  totalDeposit?: Maybe<Scalars['String']>;
  totalDepositSpent?: Maybe<Scalars['String']>;
  totalDepositUnspent?: Maybe<Scalars['String']>;
};

export type OrderPageInfo = {
  __typename?: 'OrderPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type OrderPayload = {
  __typename?: 'OrderPayload';
  eventType?: Maybe<OrderEventType>;
  order: OrderObject;
};

export type OrderResult = {
  __typename?: 'OrderResult';
  encryptedResult?: Maybe<Scalars['String']>;
  orderPrice?: Maybe<Scalars['String']>;
};

export type OrderResultInfo = {
  __typename?: 'OrderResultInfo';
  encryptedInfo: Scalars['String'];
  publicKey: Scalars['String'];
};

export type OrderResultInfoInput = {
  encryptedInfo: Scalars['String'];
  publicKey: Scalars['String'];
};

export type OrderResultInput = {
  encryptedResult?: InputMaybe<Scalars['String']>;
  orderPrice?: InputMaybe<Scalars['String']>;
};

export type OrderStatusUpdatedInput = {
  /** filter by order ids */
  orderIds?: InputMaybe<Array<Scalars['String']>>;
};

export type OrderStatusUpdatedPayload = {
  __typename?: 'OrderStatusUpdatedPayload';
  orderId: Scalars['String'];
  status: Scalars['String'];
};

export type OrderUsage = {
  __typename?: 'OrderUsage';
  optionIds: Array<Scalars['String']>;
  optionInfo: Array<OptionInfo>;
  optionUsage: Array<SlotUsage>;
  optionsCount: Array<Scalars['Float']>;
  slotCount: Scalars['Float'];
  slotInfo: SlotInfo;
  slotUsage: SlotUsage;
};

export type OrderUsageInput = {
  optionIds: Array<Scalars['String']>;
  optionInfo: Array<OptionInfoInput>;
  optionUsage: Array<SlotUsageInput>;
  optionsCount: Array<Scalars['Float']>;
  slotCount: Scalars['Float'];
  slotInfo: SlotInfoInput;
  slotUsage: SlotUsageInput;
};

export type OrdersFilter = {
  /** filter by awaitingPayment */
  awaitingPayment?: InputMaybe<Scalars['Boolean']>;
  /** filter by orderInfo -> consumer */
  consumer?: InputMaybe<Scalars['String']>;
  /** exclude filter by orderInfo -> status */
  excludeStatuses?: InputMaybe<Array<Scalars['String']>>;
  /** filter by blockchain id */
  id?: InputMaybe<Scalars['String']>;
  /** filter by blockchain ids */
  ids?: InputMaybe<Array<Scalars['String']>>;
  /** include filter by orderInfo -> status */
  includeStatuses?: InputMaybe<Array<Scalars['String']>>;
  /** filter by orderInfo -> args -> inputOffers */
  inputOffers?: InputMaybe<Array<Scalars['String']>>;
  /** This param will be removed in the next version. Use offerIds. */
  offerId?: InputMaybe<Scalars['String']>;
  /** filter by orderInfo -> offerId */
  offerIds?: InputMaybe<Array<Scalars['String']>>;
  /** filter by offerType */
  offerType?: InputMaybe<TOfferType>;
  /** filter by orderInfo -> args -> outputOffers */
  outputOffers?: InputMaybe<Array<Scalars['String']>>;
  /** filter by parentOrder -> orderId */
  parentOrder?: InputMaybe<Scalars['String']>;
  /** filter by orderInfo -> status */
  status?: InputMaybe<Scalars['String']>;
};

export type Origins = {
  __typename?: 'Origins';
  createdBy: Scalars['String'];
  createdDate: Scalars['Float'];
  modifiedBy: Scalars['String'];
  modifiedDate: Scalars['Float'];
};

export type OriginsInput = {
  createdBy: Scalars['String'];
  createdDate: Scalars['Float'];
  modifiedBy: Scalars['String'];
  modifiedDate: Scalars['Float'];
};

export type PageDataDto = {
  __typename?: 'PageDataDto';
  /** total number of documents */
  count: Scalars['Float'];
  /** selection limit */
  limit: Scalars['Float'];
  /** selection offset */
  offset: Scalars['Float'];
};

export type ParentOrder = {
  __typename?: 'ParentOrder';
  /** system identifier */
  _id: Scalars['String'];
  accumulatedOptionsInfo: OptionInfo;
  accumulatedSlotInfo: SlotInfo;
  accumulatedSlotUsage: SlotUsage;
  authority?: Maybe<Scalars['String']>;
  awaitingPayment: Scalars['Boolean'];
  consumer: Scalars['String'];
  depositSpent?: Maybe<Scalars['String']>;
  /** blockchain id */
  id: Scalars['String'];
  offerInfo?: Maybe<OfferInfo>;
  offerType: TOfferType;
  orderDeposit?: Maybe<Scalars['String']>;
  orderInfo: OrderInfo;
  orderOutputReserve?: Maybe<Scalars['String']>;
  orderResult: OrderResult;
  origins?: Maybe<Origins>;
  parentOrder?: Maybe<Scalars['String']>;
  selectedUsage?: Maybe<OrderUsage>;
  startDate: Scalars['Float'];
  teeOfferInfo?: Maybe<TeeOfferInfo>;
  totalDeposit?: Maybe<Scalars['String']>;
  totalDepositSpent?: Maybe<Scalars['String']>;
  totalDepositUnspent?: Maybe<Scalars['String']>;
};

export type ParentOrderInputType = {
  accumulatedOptionsInfo: OptionInfoInput;
  accumulatedSlotInfo: SlotInfoInput;
  accumulatedSlotUsage: SlotUsageInput;
  awaitingPayment: Scalars['Boolean'];
  consumer: Scalars['String'];
  depositSpent?: InputMaybe<Scalars['String']>;
  offerInfo?: InputMaybe<OfferInfoInput>;
  offerType: TOfferType;
  orderDeposit?: InputMaybe<Scalars['String']>;
  orderInfo: OrderInfoInput;
  orderOutputReserve?: InputMaybe<Scalars['String']>;
  orderResult: OrderResultInput;
  parentOrder?: InputMaybe<Scalars['String']>;
  selectedUsage?: InputMaybe<OrderUsageInput>;
  startDate: Scalars['Float'];
  teeOfferInfo?: InputMaybe<TeeOfferInfoInput>;
  totalDeposit?: InputMaybe<Scalars['String']>;
  totalDepositSpent?: InputMaybe<Scalars['String']>;
  totalDepositUnspent?: InputMaybe<Scalars['String']>;
};

/** Slot price type. */
export enum PriceType {
  Fixed = 'Fixed',
  PerHour = 'PerHour'
}

export type Provider = {
  __typename?: 'Provider';
  /** system identifier */
  _id: Scalars['String'];
  /** provider address */
  address: Scalars['String'];
  authority?: Maybe<Scalars['String']>;
  availableDeposit?: Maybe<Scalars['String']>;
  origins?: Maybe<Origins>;
  providerInfo: ProviderInfo;
  teeOffers?: Maybe<Array<Scalars['String']>>;
  valueOffers?: Maybe<Array<Scalars['String']>>;
};

export type ProviderConnection = {
  __typename?: 'ProviderConnection';
  edges?: Maybe<Array<ProviderEdge>>;
  pageInfo?: Maybe<ProviderPageInfo>;
};

export type ProviderEdge = {
  __typename?: 'ProviderEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Provider>;
};

export type ProviderFilter = {
  /** filter by address */
  address?: InputMaybe<Scalars['String']>;
};

export type ProviderInfo = {
  __typename?: 'ProviderInfo';
  actionAccount: Scalars['String'];
  description: Scalars['String'];
  metadata: Scalars['String'];
  name: Scalars['String'];
  tokenReceiver: Scalars['String'];
};

export type ProviderInfoInput = {
  actionAccount: Scalars['String'];
  description: Scalars['String'];
  metadata: Scalars['String'];
  name: Scalars['String'];
  tokenReceiver: Scalars['String'];
};

export type ProviderInformation = {
  __typename?: 'ProviderInformation';
  actionAccount: Scalars['String'];
  description: Scalars['String'];
  metadata: Scalars['String'];
  name: Scalars['String'];
  tokenReceiver: Scalars['String'];
};

export type ProviderInformationInput = {
  actionAccount: Scalars['String'];
  description: Scalars['String'];
  metadata: Scalars['String'];
  name: Scalars['String'];
  tokenReceiver: Scalars['String'];
};

export type ProviderInputType = {
  /** system identifier */
  _id: Scalars['String'];
  /** provider address */
  address: Scalars['String'];
  authority?: InputMaybe<Scalars['String']>;
  availableDeposit?: InputMaybe<Scalars['String']>;
  origins?: InputMaybe<OriginsInput>;
  providerInfo: ProviderInfoInput;
  teeOffers?: InputMaybe<Array<Scalars['String']>>;
  valueOffers?: InputMaybe<Array<Scalars['String']>>;
};

export type ProviderPageInfo = {
  __typename?: 'ProviderPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  attestation: Attestation;
  autoSelectValueSlots: Array<OfferSlotPair>;
  balanceOf: Scalars['String'];
  checkAuthToken: Scalars['String'];
  config: Config;
  configs: ListConfigResponse;
  coresStatistic: Array<CoresStatisticPoint>;
  erc20: Erc20;
  event: Event;
  events: ListEventResponse;
  getMatchingTeeSlots: ListTeeOffersAndSlots;
  getMinimalConfiguration: OfferConfiguration;
  listErc20: ListErc20Response;
  offer: Offer;
  offerType: OfferType;
  offers: ListOffersResponse;
  order: Order;
  orders: ListOrdersResponse;
  /** Average processing time in milliseconds */
  ordersProcessingStatistic: Array<StatisticPoint>;
  ordersStatusesStatistic: Array<StatisticPoint>;
  provider: Provider;
  providers: ListProvidersResponse;
  teeBalanceOf: Scalars['String'];
  teeOffer: TeeOffer;
  teeOffers: ListTeeOffersResponse;
  uniqConsumersStatistic: Array<StatisticPoint>;
  validateConfiguraion: ValidationResult;
};


export type QueryAutoSelectValueSlotsArgs = {
  minTimeMinutes?: InputMaybe<Scalars['Int']>;
  offerIds: Array<Scalars['String']>;
};


export type QueryBalanceOfArgs = {
  address: Scalars['String'];
};


export type QueryConfigArgs = {
  _id: Scalars['String'];
};


export type QueryConfigsArgs = {
  filter?: InputMaybe<ConfigFilter>;
  pagination: ConnectionArgs;
};


export type QueryCoresStatisticArgs = {
  dateFrom: Scalars['Float'];
  dateTo: Scalars['Float'];
  pointsCount?: InputMaybe<Scalars['Float']>;
};


export type QueryErc20Args = {
  _id: Scalars['String'];
};


export type QueryEventArgs = {
  _id: Scalars['String'];
};


export type QueryEventsArgs = {
  filter?: InputMaybe<EventDataFilter>;
  pagination: ConnectionArgs;
};


export type QueryGetMatchingTeeSlotsArgs = {
  filter?: InputMaybe<TeeOfferFilter>;
  pagination: ConnectionArgs;
};


export type QueryGetMinimalConfigurationArgs = {
  offers: Array<Array<Scalars['String']>>;
};


export type QueryListErc20Args = {
  filter?: InputMaybe<Erc20rFilter>;
  pagination: ConnectionArgs;
};


export type QueryOfferArgs = {
  _id: Scalars['String'];
  mapTo?: TIdSource;
};


export type QueryOfferTypeArgs = {
  _id: Scalars['String'];
  mapTo?: TIdSource;
};


export type QueryOffersArgs = {
  filter?: InputMaybe<OfferFilter>;
  pagination: ConnectionArgs;
};


export type QueryOrderArgs = {
  id: Scalars['String'];
};


export type QueryOrdersArgs = {
  filter?: InputMaybe<OrdersFilter>;
  pagination: ConnectionArgs;
};


export type QueryOrdersProcessingStatisticArgs = {
  dateFrom: Scalars['Float'];
  dateTo: Scalars['Float'];
  offerTypes?: InputMaybe<Array<TOfferType>>;
  pointsCount?: InputMaybe<Scalars['Float']>;
};


export type QueryOrdersStatusesStatisticArgs = {
  dateFrom: Scalars['Float'];
  dateTo: Scalars['Float'];
  pointsCount?: InputMaybe<Scalars['Float']>;
  status: Scalars['String'];
};


export type QueryProviderArgs = {
  _id: Scalars['String'];
};


export type QueryProvidersArgs = {
  filter: ProviderFilter;
  pagination: ConnectionArgs;
};


export type QueryTeeBalanceOfArgs = {
  address: Scalars['String'];
};


export type QueryTeeOfferArgs = {
  _id: Scalars['String'];
  mapTo?: TIdSource;
};


export type QueryTeeOffersArgs = {
  filter?: InputMaybe<TeeOfferFilter>;
  pagination: ConnectionArgs;
};


export type QueryUniqConsumersStatisticArgs = {
  dateFrom: Scalars['Float'];
  dateTo: Scalars['Float'];
  pointsCount?: InputMaybe<Scalars['Float']>;
};


export type QueryValidateConfiguraionArgs = {
  input: WorkflowConfigurationValidation;
};

export type ResourceRequirement = {
  __typename?: 'ResourceRequirement';
  provided: Scalars['Float'];
  required: Scalars['Float'];
};

export type SlotInfo = {
  __typename?: 'SlotInfo';
  cpuCores: Scalars['Float'];
  diskUsage: Scalars['Float'];
  gpuCores: Scalars['Float'];
  ram: Scalars['Float'];
  vram: Scalars['Float'];
};

export type SlotInfoInput = {
  cpuCores: Scalars['Float'];
  diskUsage: Scalars['Float'];
  gpuCores: Scalars['Float'];
  ram: Scalars['Float'];
  vram: Scalars['Float'];
};

export type SlotUsage = {
  __typename?: 'SlotUsage';
  maxTimeMinutes: Scalars['Float'];
  minTimeMinutes: Scalars['Float'];
  price: Scalars['String'];
  priceType: PriceType;
};

export type SlotUsageInput = {
  maxTimeMinutes: Scalars['Float'];
  minTimeMinutes: Scalars['Float'];
  price: Scalars['String'];
  priceType: PriceType;
};

export type Solution = {
  __typename?: 'Solution';
  mrEnclaves: Array<Scalars['String']>;
  name: Scalars['String'];
  offerId: Scalars['String'];
};

export enum SortDir {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type SortParam = {
  /** sort field name */
  sortBy: Scalars['String'];
  /** sort directory - ASC or DESC. Default value ASC */
  sortDir: SortDir;
};

export type StatisticPoint = {
  __typename?: 'StatisticPoint';
  timestamp: Scalars['Float'];
  value: Scalars['Float'];
};

export type Stats = {
  __typename?: 'Stats';
  blocked?: Maybe<Scalars['Float']>;
  canceled?: Maybe<Scalars['Float']>;
  canceling?: Maybe<Scalars['Float']>;
  done?: Maybe<Scalars['Float']>;
  error?: Maybe<Scalars['Float']>;
  freeCores?: Maybe<Scalars['Float']>;
  new?: Maybe<Scalars['Float']>;
  ordersInQueue?: Maybe<Scalars['Float']>;
  processing?: Maybe<Scalars['Float']>;
  suspended?: Maybe<Scalars['Float']>;
};

export type StatsInput = {
  blocked?: InputMaybe<Scalars['Float']>;
  canceled?: InputMaybe<Scalars['Float']>;
  canceling?: InputMaybe<Scalars['Float']>;
  done?: InputMaybe<Scalars['Float']>;
  error?: InputMaybe<Scalars['Float']>;
  freeCores?: InputMaybe<Scalars['Float']>;
  new?: InputMaybe<Scalars['Float']>;
  ordersInQueue?: InputMaybe<Scalars['Float']>;
  processing?: InputMaybe<Scalars['Float']>;
  suspended?: InputMaybe<Scalars['Float']>;
};

export type SubOrderCreatedPayload = {
  __typename?: 'SubOrderCreatedPayload';
  parentOrderId: Scalars['String'];
  subOrderId: Scalars['String'];
};

export type SuborderCreatedInput = {
  parentOrderId: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  /** event - create or update an entity. My be filtered by consumer */
  event: SubscriptionPayload;
  /** order event */
  order: OrderPayload;
  /** order events updated event. My be filtered by order ID */
  orderEventsUpdated: OrderEventsUpdated;
  /** order status updated event. My be filtered by order ID */
  orderStatusUpdated: OrderStatusUpdatedPayload;
  /** Suborder created event. My be filtered by parent ID */
  subOrderCreated: SubOrderCreatedPayload;
  /** workflow created event. My be filtered by consumer and external ID */
  workflowCreated: WorkflowCreatedPayload;
};


export type SubscriptionEventArgs = {
  filter?: InputMaybe<EventFilter>;
};


export type SubscriptionOrderArgs = {
  consumer?: InputMaybe<Scalars['String']>;
  eventTypes?: InputMaybe<Array<OrderEventType>>;
  externalId?: InputMaybe<Scalars['String']>;
  orderIds?: InputMaybe<Array<Scalars['String']>>;
};


export type SubscriptionOrderEventsUpdatedArgs = {
  input: OrderEventsUpdatedInput;
};


export type SubscriptionOrderStatusUpdatedArgs = {
  input: OrderStatusUpdatedInput;
};


export type SubscriptionSubOrderCreatedArgs = {
  input: SuborderCreatedInput;
};


export type SubscriptionWorkflowCreatedArgs = {
  input: WorkflowCreatedInput;
};

export type SubscriptionPayload = {
  __typename?: 'SubscriptionPayload';
  consumer?: Maybe<Scalars['String']>;
  data?: Maybe<Array<Scalars['String']>>;
  offerType?: Maybe<TOfferType>;
  subscriptionSource: SubscriptionSource;
  type: SubscriptionType;
};

export enum SubscriptionSource {
  Config = 'CONFIG',
  Erc20 = 'ERC20',
  Locking = 'LOCKING',
  Offer = 'OFFER',
  Order = 'ORDER',
  Provider = 'PROVIDER',
  Staking = 'STAKING',
  TeeOffer = 'TEE_OFFER',
  Transaction = 'TRANSACTION',
  Voting = 'VOTING'
}

export enum SubscriptionType {
  Add = 'add',
  Approve = 'approve',
  Default = 'default',
  Update = 'update'
}

/** Source of input id */
export enum TIdSource {
  Blockchain = 'Blockchain',
  Internal = 'Internal'
}

/** The supported offers type. */
export enum TOfferType {
  Data = 'Data',
  Solution = 'Solution',
  Storage = 'Storage',
  TeeOffer = 'TeeOffer'
}

export type TeeOffer = {
  __typename?: 'TeeOffer';
  /** system identifier */
  _id: Scalars['String'];
  authority: Scalars['String'];
  disabledAfter: Scalars['Float'];
  enabled: Scalars['Boolean'];
  /** blockchain id */
  id: Scalars['String'];
  inactive?: Maybe<Scalars['Boolean']>;
  options: Array<TeeOfferOption>;
  origins?: Maybe<Origins>;
  providerInfo: ProviderInformation;
  slots: Array<TeeOfferSlot>;
  stats?: Maybe<Stats>;
  tcb?: Maybe<TeeOfferTcb>;
  teeOfferInfo: TeeOfferInfo;
};

export type TeeOfferConnection = {
  __typename?: 'TeeOfferConnection';
  edges?: Maybe<Array<TeeOfferEdge>>;
  pageInfo?: Maybe<TeeOfferPageInfo>;
};

export type TeeOfferEdge = {
  __typename?: 'TeeOfferEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<TeeOffer>;
};

export type TeeOfferFilter = {
  /** filter by teeOfferInfo.hardwareInfo.optionInfo → bandwidth */
  bandwidth?: InputMaybe<Scalars['Float']>;
  /** filter by teeOfferInfo.hardwareInfo.slotInfo → cpuCores */
  cpuCores?: InputMaybe<Array<Scalars['Float']>>;
  /** filter by teeOfferInfo.hardwareInfo.slotInfo → diskUsage */
  diskUsage?: InputMaybe<Array<Scalars['Float']>>;
  /** filter by teeOfferInfo → enabled */
  enabled?: InputMaybe<Scalars['Boolean']>;
  /** filter by teeOfferInfo.hardwareInfo.optionInfo → externalPort */
  externalPort?: InputMaybe<Scalars['Float']>;
  /** filter by teeOfferInfo.hardwareInfo.slotInfo → gpuCores */
  gpuCores?: InputMaybe<Array<Scalars['Float']>>;
  /** filter by blockchain id */
  id?: InputMaybe<Scalars['String']>;
  /** filter by TEE offer ids */
  ids?: InputMaybe<Array<Scalars['String']>>;
  /** filter by inactive, "false" by default */
  inactive?: InputMaybe<Scalars['Boolean']>;
  /** filter by teeOfferInfo → name */
  name?: InputMaybe<Scalars['String']>;
  /** filter by slot/option usage → pricePerHour */
  pricePerHour?: InputMaybe<Array<Scalars['Float']>>;
  /** filter by TEE offer providerInfo → actionAccount */
  providerActionAccounts?: InputMaybe<Array<Scalars['String']>>;
  /** filter by teeOfferInfo.hardwareInfo.slotInfo → ram */
  ram?: InputMaybe<Array<Scalars['Float']>>;
  /** filter by teeOfferInfo.hardwareInfo.optionInfo → traffic */
  traffic?: InputMaybe<Scalars['Float']>;
  /** filter by slot/option usage → minTimeMinutes,maxTimeMinutes */
  usageMinutes?: InputMaybe<Scalars['Float']>;
  /** filter by teeOfferInfo.hardwareInfo.slotInfo → vram */
  vram?: InputMaybe<Array<Scalars['Float']>>;
};

export type TeeOfferInfo = {
  __typename?: 'TeeOfferInfo';
  argsPublicKey: Scalars['String'];
  description: Scalars['String'];
  hardwareInfo: HardwareInfo;
  name: Scalars['String'];
  properties: Scalars['String'];
  teeType: Scalars['String'];
  tlb: Scalars['String'];
};

export type TeeOfferInfoInput = {
  argsPublicKey: Scalars['String'];
  description: Scalars['String'];
  hardwareInfo: HardwareInfoInput;
  name: Scalars['String'];
  properties: Scalars['String'];
  teeType: Scalars['String'];
  tlb: Scalars['String'];
};

export type TeeOfferInputType = {
  authority: Scalars['String'];
  disabledAfter: Scalars['Float'];
  enabled: Scalars['Boolean'];
  inactive?: InputMaybe<Scalars['Boolean']>;
  options: Array<TeeOfferOptionInput>;
  providerInfo: ProviderInformationInput;
  slots: Array<TeeOfferSlotInput>;
  stats?: InputMaybe<StatsInput>;
  tcb?: InputMaybe<TeeOfferTcbInputType>;
  teeOfferInfo: TeeOfferInfoInput;
};

export type TeeOfferOption = {
  __typename?: 'TeeOfferOption';
  id: Scalars['String'];
  info: OptionInfo;
  usage: SlotUsage;
};

export type TeeOfferOptionInput = {
  id: Scalars['String'];
  info: OptionInfoInput;
  usage: SlotUsageInput;
};

export type TeeOfferPageInfo = {
  __typename?: 'TeeOfferPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type TeeOfferSlot = {
  __typename?: 'TeeOfferSlot';
  id: Scalars['String'];
  info: SlotInfo;
  usage: SlotUsage;
};

export type TeeOfferSlotInput = {
  id: Scalars['String'];
  info: SlotInfoInput;
  usage: SlotUsageInput;
};

export type TeeOfferTcb = {
  __typename?: 'TeeOfferTcb';
  checkedAt?: Maybe<Scalars['Float']>;
  id: Scalars['String'];
};

export type TeeOfferTcbInputType = {
  checkedAt?: InputMaybe<Scalars['Float']>;
  id: Scalars['String'];
};

export type TeeOfferWithSlotsAndOptions = {
  offerId: Scalars['String'];
  options: Array<TeeSlot>;
  slot: TeeSlot;
};

export type TeeOffersAndSLots = {
  __typename?: 'TeeOffersAndSLots';
  optionsResult?: Maybe<MatchingOptions>;
  price: Scalars['String'];
  slotResult: MatchingSlot;
  teeOffer: TeeOffer;
};

export type TeeOffersAndSLotsConnection = {
  __typename?: 'TeeOffersAndSLotsConnection';
  edges?: Maybe<Array<TeeOffersAndSLotsEdge>>;
  pageInfo?: Maybe<TeeOffersAndSLotsPageInfo>;
};

export type TeeOffersAndSLotsEdge = {
  __typename?: 'TeeOffersAndSLotsEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<TeeOffersAndSLots>;
};

export type TeeOffersAndSLotsPageInfo = {
  __typename?: 'TeeOffersAndSLotsPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type TeeOffersAndSLotsType = {
  optionsResult?: InputMaybe<MatchingOptionsType>;
  price: Scalars['String'];
  slotResult: MatchingSlotType;
  teeOffer: TeeOfferInputType;
};

export type TeeSlot = {
  count: Scalars['Float'];
  id: Scalars['String'];
};

export type ValidationErrors = {
  __typename?: 'ValidationErrors';
  bandwidth?: Maybe<ResourceRequirement>;
  cpuCores?: Maybe<ResourceRequirement>;
  diskUsage?: Maybe<ResourceRequirement>;
  externalPort?: Maybe<ResourceRequirement>;
  gpuCores?: Maybe<ResourceRequirement>;
  minTimeMinutes?: Maybe<ResourceRequirement>;
  ram?: Maybe<ResourceRequirement>;
  traffic?: Maybe<ResourceRequirement>;
  vram?: Maybe<ResourceRequirement>;
};

export type ValidationResult = {
  __typename?: 'ValidationResult';
  errors?: Maybe<ValidationErrors>;
  success: Scalars['Boolean'];
};

export type ValueObject = {
  __typename?: 'ValueObject';
  actionAccountAddress?: Maybe<Scalars['String']>;
  authorityAccountAddress?: Maybe<Scalars['String']>;
  offerSecDeposit?: Maybe<Scalars['String']>;
  orderMinimumDeposit?: Maybe<Scalars['String']>;
  staking?: Maybe<Scalars['String']>;
  superpro?: Maybe<Scalars['String']>;
  teeOfferSecDeposit?: Maybe<Scalars['String']>;
  teeRewardPerEpoch?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
  tokenReceiverAddress?: Maybe<Scalars['String']>;
};

export type ValueObjectType = {
  actionAccountAddress?: InputMaybe<Scalars['String']>;
  authorityAccountAddress?: InputMaybe<Scalars['String']>;
  offerSecDeposit?: InputMaybe<Scalars['String']>;
  orderMinimumDeposit?: InputMaybe<Scalars['String']>;
  staking?: InputMaybe<Scalars['String']>;
  superpro?: InputMaybe<Scalars['String']>;
  teeOfferSecDeposit?: InputMaybe<Scalars['String']>;
  teeRewardPerEpoch?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
  tokenReceiverAddress?: InputMaybe<Scalars['String']>;
};

export type ValueOfferWithSlotsAndOptions = {
  offerId: Scalars['String'];
  slot: ValueSlot;
};

export type ValueSlot = {
  id: Scalars['String'];
};

export type WorkflowConfigurationValidation = {
  data: Array<ValueOfferWithSlotsAndOptions>;
  minTimeMinutes?: InputMaybe<Scalars['Float']>;
  solution?: InputMaybe<Array<ValueOfferWithSlotsAndOptions>>;
  storage: ValueOfferWithSlotsAndOptions;
  tee: TeeOfferWithSlotsAndOptions;
};

export type WorkflowCreatedFilter = {
  consumer: Scalars['String'];
  externalId: Scalars['String'];
};

export type WorkflowCreatedInput = {
  filter: WorkflowCreatedFilter;
};

export type WorkflowCreatedPayload = {
  __typename?: 'WorkflowCreatedPayload';
  consumer: Scalars['String'];
  externalId: Scalars['String'];
  offerId: Scalars['String'];
  orderId: Scalars['String'];
};

export type AttestationQueryVariables = Exact<{ [key: string]: never; }>;


export type AttestationQuery = { __typename?: 'Query', attestation: { __typename?: 'Attestation', solutions: Array<{ __typename?: 'Solution', name: string, mrEnclaves: Array<string>, offerId: string }> } };

export type PageDataDtoFragmentFragment = { __typename?: 'PageDataDto', count: number, limit: number, offset: number };

export type EventSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type EventSubscription = { __typename?: 'Subscription', event: { __typename?: 'SubscriptionPayload', data?: Array<string> | null, type: SubscriptionType, subscriptionSource: SubscriptionSource } };

export type TransferMutationVariables = Exact<{
  destinationAddress?: InputMaybe<Scalars['String']>;
}>;


export type TransferMutation = { __typename?: 'Mutation', transfer: boolean };

export type CustomTransferMutationVariables = Exact<{
  destinationAddress?: InputMaybe<Scalars['String']>;
}>;


export type CustomTransferMutation = { __typename?: 'Mutation', customTransfer: boolean };

export type TeeTransferMutationVariables = Exact<{
  destinationAddress?: InputMaybe<Scalars['String']>;
}>;


export type TeeTransferMutation = { __typename?: 'Mutation', teeTransfer: boolean };

export type TeeCustomTransferMutationVariables = Exact<{
  destinationAddress?: InputMaybe<Scalars['String']>;
}>;


export type TeeCustomTransferMutation = { __typename?: 'Mutation', teeCustomTransfer: boolean };

export type OffersQueryVariables = Exact<{
  pagination: ConnectionArgs;
  filter?: InputMaybe<OfferFilter>;
}>;


export type OffersQuery = { __typename?: 'Query', result: { __typename?: 'ListOffersResponse', pageData?: { __typename?: 'PageDataDto', count: number, limit: number, offset: number } | null, page: { __typename?: 'OfferConnection', pageInfo?: { __typename?: 'OfferPageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } | null, edges?: Array<{ __typename?: 'OfferEdge', cursor?: string | null, node?: { __typename?: 'Offer', _id: string, id: string, authority?: string | null, enabled: boolean, offerInfo: { __typename?: 'OfferInfo', name: string, group: string, offerType: string, cancelable: boolean, description: string, metadata: string, input: string, output: string, allowedArgs?: string | null, allowedAccounts: Array<string>, argsPublicKey: string, resultResource: string, linkage: string, hash: string, restrictions?: { __typename?: 'OfferRestrictions', offers?: Array<string> | null, types?: Array<string> | null } | null }, slots: Array<{ __typename?: 'OfferSlot', id: string, info: { __typename?: 'SlotInfo', cpuCores: number, gpuCores: number, diskUsage: number, ram: number, vram: number }, usage: { __typename?: 'SlotUsage', maxTimeMinutes: number, minTimeMinutes: number, price: string, priceType: PriceType }, option: { __typename?: 'OptionInfo', bandwidth: number, externalPort: number, traffic: number } }>, origins?: { __typename?: 'Origins', createdBy: string, createdDate: number, modifiedBy: string, modifiedDate: number } | null, providerInfo: { __typename?: 'ProviderInformation', actionAccount: string, description: string, metadata: string, name: string, tokenReceiver: string } } | null }> | null } } };

export type OffersSelectQueryVariables = Exact<{
  pagination: ConnectionArgs;
  filter?: InputMaybe<OfferFilter>;
}>;


export type OffersSelectQuery = { __typename?: 'Query', result: { __typename?: 'ListOffersResponse', pageData?: { __typename?: 'PageDataDto', count: number, limit: number, offset: number } | null, page: { __typename?: 'OfferConnection', pageInfo?: { __typename?: 'OfferPageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } | null, edges?: Array<{ __typename?: 'OfferEdge', cursor?: string | null, node?: { __typename?: 'Offer', id: string, offerInfo: { __typename?: 'OfferInfo', name: string, description: string } } | null }> | null } } };

export type OffersRestrictionsQueryVariables = Exact<{
  pagination: ConnectionArgs;
  filter?: InputMaybe<OfferFilter>;
}>;


export type OffersRestrictionsQuery = { __typename?: 'Query', result: { __typename?: 'ListOffersResponse', page: { __typename?: 'OfferConnection', edges?: Array<{ __typename?: 'OfferEdge', node?: { __typename?: 'Offer', id: string, offerInfo: { __typename?: 'OfferInfo', restrictions?: { __typename?: 'OfferRestrictions', offers?: Array<string> | null } | null } } | null }> | null } } };

export type MinimalConfigurationQueryVariables = Exact<{
  offers: Array<Array<Scalars['String']> | Scalars['String']> | Array<Scalars['String']> | Scalars['String'];
}>;


export type MinimalConfigurationQuery = { __typename?: 'Query', result: { __typename?: 'OfferConfiguration', cpuCores: number, ram: number, vram: number, diskUsage: number, bandwidth: number, traffic: number, externalPort: number } };

export type ValidateConfiguraionQueryVariables = Exact<{
  input: WorkflowConfigurationValidation;
}>;


export type ValidateConfiguraionQuery = { __typename?: 'Query', result: { __typename?: 'ValidationResult', success: boolean, errors?: { __typename?: 'ValidationErrors', cpuCores?: { __typename?: 'ResourceRequirement', required: number, provided: number } | null, diskUsage?: { __typename?: 'ResourceRequirement', required: number, provided: number } | null, ram?: { __typename?: 'ResourceRequirement', required: number, provided: number } | null, vram?: { __typename?: 'ResourceRequirement', required: number, provided: number } | null, bandwidth?: { __typename?: 'ResourceRequirement', required: number, provided: number } | null, traffic?: { __typename?: 'ResourceRequirement', required: number, provided: number } | null, externalPort?: { __typename?: 'ResourceRequirement', required: number, provided: number } | null, gpuCores?: { __typename?: 'ResourceRequirement', required: number, provided: number } | null } | null } };

export type AutoSelectValueSlotsQueryVariables = Exact<{
  minTimeMinutes?: InputMaybe<Scalars['Int']>;
  offerIds: Array<Scalars['String']> | Scalars['String'];
}>;


export type AutoSelectValueSlotsQuery = { __typename?: 'Query', result: Array<{ __typename?: 'OfferSlotPair', offerId: string, slotId: string }> };

export type OrdersQueryVariables = Exact<{
  pagination: ConnectionArgs;
  filter?: InputMaybe<OrdersFilter>;
}>;


export type OrdersQuery = { __typename?: 'Query', result: { __typename?: 'ListOrdersResponse', pageData?: { __typename?: 'PageDataDto', count: number, limit: number, offset: number } | null, page: { __typename?: 'OrderConnection', edges?: Array<{ __typename?: 'OrderEdge', cursor?: string | null, node?: { __typename?: 'Order', _id: string, id: string, authority?: string | null, consumer: string, orderDeposit?: string | null, depositSpent?: string | null, totalDeposit?: string | null, totalDepositSpent?: string | null, offerType: TOfferType, parentOrder?: { __typename?: 'ParentOrder', id: string } | null, offerInfo?: { __typename?: 'OfferInfo', name: string, description: string, cancelable: boolean } | null, orderInfo: { __typename?: 'OrderInfo', offerId: string, status: string }, origins?: { __typename?: 'Origins', createdBy: string, createdDate: number, modifiedBy: string, modifiedDate: number } | null, selectedUsage?: { __typename?: 'OrderUsage', optionIds: Array<string>, optionsCount: Array<number> } | null, teeOfferInfo?: { __typename?: 'TeeOfferInfo', name: string, description: string } | null, subOrders?: Array<{ __typename?: 'BaseOrder', id: string, depositSpent?: string | null, offerType: TOfferType, teeOfferInfo?: { __typename?: 'TeeOfferInfo', name: string, description: string } | null, offerInfo?: { __typename?: 'OfferInfo', name: string, description: string, cancelable: boolean } | null, orderInfo: { __typename?: 'OrderInfo', offerId: string, status: string }, origins?: { __typename?: 'Origins', modifiedDate: number } | null }> | null } | null }> | null, pageInfo?: { __typename?: 'OrderPageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } | null } } };

export type OrdersSelectQueryVariables = Exact<{
  pagination: ConnectionArgs;
  filter?: InputMaybe<OrdersFilter>;
}>;


export type OrdersSelectQuery = { __typename?: 'Query', result: { __typename?: 'ListOrdersResponse', pageData?: { __typename?: 'PageDataDto', count: number, limit: number, offset: number } | null, page: { __typename?: 'OrderConnection', edges?: Array<{ __typename?: 'OrderEdge', cursor?: string | null, node?: { __typename?: 'Order', id: string } | null }> | null, pageInfo?: { __typename?: 'OrderPageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } | null } } };

export type OrdersCountQueryVariables = Exact<{
  filter?: InputMaybe<OrdersFilter>;
}>;


export type OrdersCountQuery = { __typename?: 'Query', result: { __typename?: 'ListOrdersResponse', pageData?: { __typename?: 'PageDataDto', count: number } | null } };

export type OrderQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type OrderQuery = { __typename?: 'Query', order: { __typename?: 'Order', id: string, consumer: string, offerType: TOfferType, origins?: { __typename?: 'Origins', createdBy: string, createdDate: number, modifiedBy: string, modifiedDate: number } | null, orderInfo: { __typename?: 'OrderInfo', status: string, offerId: string, args: { __typename?: 'OrderArgs', inputOffers: Array<string>, outputOffer: string }, resultInfo: { __typename?: 'OrderResultInfo', encryptedInfo: string, publicKey: string } }, teeOfferInfo?: { __typename?: 'TeeOfferInfo', name: string, description: string } | null, orderResult: { __typename?: 'OrderResult', encryptedResult?: string | null }, parentOrder?: { __typename?: 'ParentOrder', id: string, offerType: TOfferType } | null } };

export type SubOrdersQueryVariables = Exact<{
  pagination: ConnectionArgs;
  filter?: InputMaybe<OrdersFilter>;
}>;


export type SubOrdersQuery = { __typename?: 'Query', result: { __typename?: 'ListOrdersResponse', pageData?: { __typename?: 'PageDataDto', count: number, limit: number, offset: number } | null, page: { __typename?: 'OrderConnection', edges?: Array<{ __typename?: 'OrderEdge', cursor?: string | null, node?: { __typename?: 'Order', _id: string, id: string, authority?: string | null, consumer: string, offerType: TOfferType, offerInfo?: { __typename?: 'OfferInfo', name: string, offerType: string, cancelable: boolean, description: string } | null, orderInfo: { __typename?: 'OrderInfo', offerId: string, status: string }, origins?: { __typename?: 'Origins', createdBy: string, createdDate: number, modifiedBy: string, modifiedDate: number } | null, teeOfferInfo?: { __typename?: 'TeeOfferInfo', name: string, description: string } | null } | null }> | null, pageInfo?: { __typename?: 'OrderPageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } | null } } };

export type ProvidersQueryVariables = Exact<{
  pagination: ConnectionArgs;
  filter: ProviderFilter;
}>;


export type ProvidersQuery = { __typename?: 'Query', result: { __typename?: 'ListProvidersResponse', pageData?: { __typename?: 'PageDataDto', count: number, limit: number, offset: number } | null, page: { __typename?: 'ProviderConnection', pageInfo?: { __typename?: 'ProviderPageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } | null, edges?: Array<{ __typename?: 'ProviderEdge', cursor?: string | null, node?: { __typename?: 'Provider', _id: string, address: string, authority?: string | null, availableDeposit?: string | null, valueOffers?: Array<string> | null, teeOffers?: Array<string> | null, origins?: { __typename?: 'Origins', createdBy: string, createdDate: number, modifiedBy: string, modifiedDate: number } | null, providerInfo: { __typename?: 'ProviderInfo', actionAccount: string, description: string, metadata: string, name: string, tokenReceiver: string } } | null }> | null } } };

export type TeeOffersQueryVariables = Exact<{
  pagination: ConnectionArgs;
  filter?: InputMaybe<TeeOfferFilter>;
}>;


export type TeeOffersQuery = { __typename?: 'Query', result: { __typename?: 'ListTeeOffersResponse', pageData?: { __typename?: 'PageDataDto', count: number, limit: number, offset: number } | null, page: { __typename?: 'TeeOfferConnection', edges?: Array<{ __typename?: 'TeeOfferEdge', cursor?: string | null, node?: { __typename?: 'TeeOffer', _id: string, id: string, authority: string, disabledAfter: number, enabled: boolean, origins?: { __typename?: 'Origins', createdBy: string, createdDate: number, modifiedBy: string, modifiedDate: number } | null, providerInfo: { __typename?: 'ProviderInformation', actionAccount: string, description: string, metadata: string, name: string, tokenReceiver: string }, teeOfferInfo: { __typename?: 'TeeOfferInfo', name: string, description: string, teeType: string, properties: string, tlb: string, argsPublicKey: string, hardwareInfo: { __typename?: 'HardwareInfo', slotInfo: { __typename?: 'SlotInfo', cpuCores: number, gpuCores: number, ram: number, vram: number, diskUsage: number }, optionInfo: { __typename?: 'OptionInfo', bandwidth: number, traffic: number, externalPort: number } } }, slots: Array<{ __typename?: 'TeeOfferSlot', id: string, info: { __typename?: 'SlotInfo', cpuCores: number, gpuCores: number, diskUsage: number, ram: number, vram: number }, usage: { __typename?: 'SlotUsage', maxTimeMinutes: number, minTimeMinutes: number, price: string, priceType: PriceType } }>, options: Array<{ __typename?: 'TeeOfferOption', id: string, info: { __typename?: 'OptionInfo', bandwidth: number, externalPort: number, traffic: number }, usage: { __typename?: 'SlotUsage', maxTimeMinutes: number, minTimeMinutes: number, price: string, priceType: PriceType } }>, stats?: { __typename?: 'Stats', freeCores?: number | null, ordersInQueue?: number | null, new?: number | null, processing?: number | null } | null } | null }> | null, pageInfo?: { __typename?: 'TeeOfferPageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } | null } } };

export type TeeOffersSelectQueryVariables = Exact<{
  pagination: ConnectionArgs;
  filter?: InputMaybe<TeeOfferFilter>;
}>;


export type TeeOffersSelectQuery = { __typename?: 'Query', result: { __typename?: 'ListTeeOffersResponse', pageData?: { __typename?: 'PageDataDto', count: number, limit: number, offset: number } | null, page: { __typename?: 'TeeOfferConnection', pageInfo?: { __typename?: 'TeeOfferPageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } | null, edges?: Array<{ __typename?: 'TeeOfferEdge', cursor?: string | null, node?: { __typename?: 'TeeOffer', id: string, teeOfferInfo: { __typename?: 'TeeOfferInfo', name: string, description: string } } | null }> | null } } };

export type GetMatchingTeeSlotsQueryVariables = Exact<{
  filter?: InputMaybe<TeeOfferFilter>;
  pagination: ConnectionArgs;
}>;


export type GetMatchingTeeSlotsQuery = { __typename?: 'Query', result: { __typename?: 'ListTeeOffersAndSlots', page: { __typename?: 'TeeOffersAndSLotsConnection', edges?: Array<{ __typename?: 'TeeOffersAndSLotsEdge', node?: { __typename?: 'TeeOffersAndSLots', price: string, teeOffer: { __typename?: 'TeeOffer', id: string }, slotResult: { __typename?: 'MatchingSlot', multiplier: number, price: string, slot: { __typename?: 'TeeOfferSlot', id: string, info: { __typename?: 'SlotInfo', cpuCores: number, diskUsage: number, ram: number }, usage: { __typename?: 'SlotUsage', maxTimeMinutes: number, minTimeMinutes: number, price: string, priceType: PriceType } } }, optionsResult?: { __typename?: 'MatchingOptions', pricePerHour: string, priceFixed: string, optionResults: Array<{ __typename?: 'MatchingOptionResult', id: string, count: number, info: { __typename?: 'OptionInfo', bandwidth: number, externalPort: number, traffic: number } }>, cumulativeValues: { __typename?: 'OptionInfo', bandwidth: number, traffic: number, externalPort: number } } | null } | null }> | null } } };

export const PageDataDtoFragmentFragmentDoc = gql`
    fragment PageDataDtoFragment on PageDataDto {
  count
  limit
  offset
}
    `;
export const AttestationDocument = gql`
    query Attestation {
  attestation {
    solutions {
      name
      mrEnclaves
      offerId
    }
  }
}
    `;
export const EventDocument = gql`
    subscription Event {
  event {
    data
    type
    subscriptionSource
  }
}
    `;
export const TransferDocument = gql`
    mutation Transfer($destinationAddress: String) {
  transfer(destinationAddress: $destinationAddress)
}
    `;
export const CustomTransferDocument = gql`
    mutation CustomTransfer($destinationAddress: String) {
  customTransfer(destinationAddress: $destinationAddress)
}
    `;
export const TeeTransferDocument = gql`
    mutation TeeTransfer($destinationAddress: String) {
  teeTransfer(destinationAddress: $destinationAddress)
}
    `;
export const TeeCustomTransferDocument = gql`
    mutation TeeCustomTransfer($destinationAddress: String) {
  teeCustomTransfer(destinationAddress: $destinationAddress)
}
    `;
export const OffersDocument = gql`
    query Offers($pagination: ConnectionArgs!, $filter: OfferFilter) {
  result: offers(pagination: $pagination, filter: $filter) {
    pageData {
      ...PageDataDtoFragment
    }
    page {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      edges {
        node {
          _id
          id
          authority
          offerInfo {
            name
            group
            offerType
            cancelable
            description
            restrictions {
              offers
              types
            }
            metadata
            input
            output
            allowedArgs
            allowedAccounts
            argsPublicKey
            resultResource
            linkage
            hash
          }
          enabled
          slots {
            id
            info {
              cpuCores
              gpuCores
              diskUsage
              ram
              vram
            }
            usage {
              maxTimeMinutes
              minTimeMinutes
              price
              priceType
            }
            option {
              bandwidth
              externalPort
              traffic
            }
          }
          origins {
            createdBy
            createdDate
            modifiedBy
            modifiedDate
          }
          providerInfo {
            actionAccount
            description
            metadata
            name
            tokenReceiver
          }
        }
        cursor
      }
    }
  }
}
    ${PageDataDtoFragmentFragmentDoc}`;
export const OffersSelectDocument = gql`
    query OffersSelect($pagination: ConnectionArgs!, $filter: OfferFilter) {
  result: offers(pagination: $pagination, filter: $filter) {
    pageData {
      ...PageDataDtoFragment
    }
    page {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      edges {
        node {
          id
          offerInfo {
            name
            description
          }
        }
        cursor
      }
    }
  }
}
    ${PageDataDtoFragmentFragmentDoc}`;
export const OffersRestrictionsDocument = gql`
    query OffersRestrictions($pagination: ConnectionArgs!, $filter: OfferFilter) {
  result: offers(pagination: $pagination, filter: $filter) {
    page {
      edges {
        node {
          id
          offerInfo {
            restrictions {
              offers
            }
          }
        }
      }
    }
  }
}
    `;
export const MinimalConfigurationDocument = gql`
    query MinimalConfiguration($offers: [[String!]!]!) {
  result: getMinimalConfiguration(offers: $offers) {
    cpuCores
    ram
    vram
    diskUsage
    bandwidth
    traffic
    externalPort
  }
}
    `;
export const ValidateConfiguraionDocument = gql`
    query validateConfiguraion($input: WorkflowConfigurationValidation!) {
  result: validateConfiguraion(input: $input) {
    success
    errors {
      cpuCores {
        required
        provided
      }
      diskUsage {
        required
        provided
      }
      ram {
        required
        provided
      }
      vram {
        required
        provided
      }
      bandwidth {
        required
        provided
      }
      traffic {
        required
        provided
      }
      externalPort {
        required
        provided
      }
      gpuCores {
        required
        provided
      }
    }
  }
}
    `;
export const AutoSelectValueSlotsDocument = gql`
    query autoSelectValueSlots($minTimeMinutes: Int, $offerIds: [String!]!) {
  result: autoSelectValueSlots(
    minTimeMinutes: $minTimeMinutes
    offerIds: $offerIds
  ) {
    offerId
    slotId
  }
}
    `;
export const OrdersDocument = gql`
    query Orders($pagination: ConnectionArgs!, $filter: OrdersFilter) {
  result: orders(pagination: $pagination, filter: $filter) {
    pageData {
      ...PageDataDtoFragment
    }
    page {
      edges {
        cursor
        node {
          _id
          id
          authority
          consumer
          orderDeposit
          depositSpent
          totalDeposit
          totalDepositSpent
          parentOrder {
            id
          }
          offerInfo {
            name
            description
            cancelable
          }
          offerType
          orderInfo {
            offerId
            status
          }
          origins {
            createdBy
            createdDate
            modifiedBy
            modifiedDate
          }
          selectedUsage {
            optionIds
            optionsCount
          }
          teeOfferInfo {
            name
            description
          }
          subOrders {
            id
            depositSpent
            teeOfferInfo {
              name
              description
            }
            offerInfo {
              name
              description
              cancelable
            }
            offerType
            orderInfo {
              offerId
              status
            }
            origins {
              modifiedDate
            }
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
}
    ${PageDataDtoFragmentFragmentDoc}`;
export const OrdersSelectDocument = gql`
    query OrdersSelect($pagination: ConnectionArgs!, $filter: OrdersFilter) {
  result: orders(pagination: $pagination, filter: $filter) {
    pageData {
      ...PageDataDtoFragment
    }
    page {
      edges {
        cursor
        node {
          id
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
}
    ${PageDataDtoFragmentFragmentDoc}`;
export const OrdersCountDocument = gql`
    query OrdersCount($filter: OrdersFilter) {
  result: orders(pagination: {first: 1}, filter: $filter) {
    pageData {
      count
    }
  }
}
    `;
export const OrderDocument = gql`
    query Order($id: String!) {
  order(id: $id) {
    id
    consumer
    origins {
      createdBy
      createdDate
      modifiedBy
      modifiedDate
    }
    offerType
    orderInfo {
      status
      offerId
      args {
        inputOffers
        outputOffer
      }
      resultInfo {
        encryptedInfo
        publicKey
      }
    }
    teeOfferInfo {
      name
      description
    }
    orderResult {
      encryptedResult
    }
    parentOrder {
      id
      offerType
    }
  }
}
    `;
export const SubOrdersDocument = gql`
    query SubOrders($pagination: ConnectionArgs!, $filter: OrdersFilter) {
  result: orders(pagination: $pagination, filter: $filter) {
    pageData {
      ...PageDataDtoFragment
    }
    page {
      edges {
        cursor
        node {
          _id
          id
          authority
          consumer
          offerInfo {
            name
            offerType
            cancelable
            description
          }
          offerType
          orderInfo {
            offerId
            status
          }
          origins {
            createdBy
            createdDate
            modifiedBy
            modifiedDate
          }
          teeOfferInfo {
            name
            description
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
}
    ${PageDataDtoFragmentFragmentDoc}`;
export const ProvidersDocument = gql`
    query Providers($pagination: ConnectionArgs!, $filter: ProviderFilter!) {
  result: providers(pagination: $pagination, filter: $filter) {
    pageData {
      ...PageDataDtoFragment
    }
    page {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      edges {
        node {
          _id
          address
          authority
          availableDeposit
          valueOffers
          teeOffers
          origins {
            createdBy
            createdDate
            modifiedBy
            modifiedDate
          }
          providerInfo {
            actionAccount
            description
            metadata
            name
            tokenReceiver
          }
        }
        cursor
      }
    }
  }
}
    ${PageDataDtoFragmentFragmentDoc}`;
export const TeeOffersDocument = gql`
    query TeeOffers($pagination: ConnectionArgs!, $filter: TeeOfferFilter) {
  result: teeOffers(pagination: $pagination, filter: $filter) {
    pageData {
      ...PageDataDtoFragment
    }
    page {
      edges {
        cursor
        node {
          _id
          id
          authority
          disabledAfter
          authority
          origins {
            createdBy
            createdDate
            modifiedBy
            modifiedDate
          }
          providerInfo {
            actionAccount
            description
            metadata
            name
            tokenReceiver
          }
          teeOfferInfo {
            name
            description
            teeType
            properties
            tlb
            argsPublicKey
            hardwareInfo {
              slotInfo {
                cpuCores
                gpuCores
                ram
                vram
                diskUsage
              }
              optionInfo {
                bandwidth
                traffic
                externalPort
              }
            }
          }
          enabled
          slots {
            id
            info {
              cpuCores
              gpuCores
              diskUsage
              ram
              vram
            }
            usage {
              maxTimeMinutes
              minTimeMinutes
              price
              priceType
            }
          }
          options {
            id
            info {
              bandwidth
              externalPort
              traffic
            }
            usage {
              maxTimeMinutes
              minTimeMinutes
              price
              priceType
            }
          }
          stats {
            freeCores
            ordersInQueue
            new
            processing
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
}
    ${PageDataDtoFragmentFragmentDoc}`;
export const TeeOffersSelectDocument = gql`
    query TeeOffersSelect($pagination: ConnectionArgs!, $filter: TeeOfferFilter) {
  result: teeOffers(pagination: $pagination, filter: $filter) {
    pageData {
      ...PageDataDtoFragment
    }
    page {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      edges {
        node {
          id
          teeOfferInfo {
            name
            description
          }
        }
        cursor
      }
    }
  }
}
    ${PageDataDtoFragmentFragmentDoc}`;
export const GetMatchingTeeSlotsDocument = gql`
    query GetMatchingTeeSlots($filter: TeeOfferFilter, $pagination: ConnectionArgs!) {
  result: getMatchingTeeSlots(filter: $filter, pagination: $pagination) {
    page {
      edges {
        node {
          teeOffer {
            id
          }
          slotResult {
            slot {
              id
              info {
                cpuCores
                diskUsage
                ram
              }
              usage {
                maxTimeMinutes
                minTimeMinutes
                price
                priceType
              }
            }
            multiplier
            price
          }
          optionsResult {
            optionResults {
              id
              count
              info {
                bandwidth
                externalPort
                traffic
              }
            }
            cumulativeValues {
              bandwidth
              traffic
              externalPort
            }
            pricePerHour
            priceFixed
          }
          price
        }
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    Attestation(variables?: AttestationQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AttestationQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AttestationQuery>(AttestationDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Attestation', 'query');
    },
    Event(variables?: EventSubscriptionVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EventSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<EventSubscription>(EventDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Event', 'subscription');
    },
    Transfer(variables?: TransferMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<TransferMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<TransferMutation>(TransferDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Transfer', 'mutation');
    },
    CustomTransfer(variables?: CustomTransferMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CustomTransferMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CustomTransferMutation>(CustomTransferDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CustomTransfer', 'mutation');
    },
    TeeTransfer(variables?: TeeTransferMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<TeeTransferMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<TeeTransferMutation>(TeeTransferDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'TeeTransfer', 'mutation');
    },
    TeeCustomTransfer(variables?: TeeCustomTransferMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<TeeCustomTransferMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<TeeCustomTransferMutation>(TeeCustomTransferDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'TeeCustomTransfer', 'mutation');
    },
    Offers(variables: OffersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<OffersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OffersQuery>(OffersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Offers', 'query');
    },
    OffersSelect(variables: OffersSelectQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<OffersSelectQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OffersSelectQuery>(OffersSelectDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'OffersSelect', 'query');
    },
    OffersRestrictions(variables: OffersRestrictionsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<OffersRestrictionsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OffersRestrictionsQuery>(OffersRestrictionsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'OffersRestrictions', 'query');
    },
    MinimalConfiguration(variables: MinimalConfigurationQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MinimalConfigurationQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MinimalConfigurationQuery>(MinimalConfigurationDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'MinimalConfiguration', 'query');
    },
    validateConfiguraion(variables: ValidateConfiguraionQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ValidateConfiguraionQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ValidateConfiguraionQuery>(ValidateConfiguraionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'validateConfiguraion', 'query');
    },
    autoSelectValueSlots(variables: AutoSelectValueSlotsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AutoSelectValueSlotsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AutoSelectValueSlotsQuery>(AutoSelectValueSlotsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'autoSelectValueSlots', 'query');
    },
    Orders(variables: OrdersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<OrdersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OrdersQuery>(OrdersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Orders', 'query');
    },
    OrdersSelect(variables: OrdersSelectQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<OrdersSelectQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OrdersSelectQuery>(OrdersSelectDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'OrdersSelect', 'query');
    },
    OrdersCount(variables?: OrdersCountQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<OrdersCountQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OrdersCountQuery>(OrdersCountDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'OrdersCount', 'query');
    },
    Order(variables: OrderQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<OrderQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OrderQuery>(OrderDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Order', 'query');
    },
    SubOrders(variables: SubOrdersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SubOrdersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SubOrdersQuery>(SubOrdersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SubOrders', 'query');
    },
    Providers(variables: ProvidersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProvidersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProvidersQuery>(ProvidersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Providers', 'query');
    },
    TeeOffers(variables: TeeOffersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<TeeOffersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<TeeOffersQuery>(TeeOffersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'TeeOffers', 'query');
    },
    TeeOffersSelect(variables: TeeOffersSelectQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<TeeOffersSelectQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<TeeOffersSelectQuery>(TeeOffersSelectDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'TeeOffersSelect', 'query');
    },
    GetMatchingTeeSlots(variables: GetMatchingTeeSlotsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetMatchingTeeSlotsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetMatchingTeeSlotsQuery>(GetMatchingTeeSlotsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetMatchingTeeSlots', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
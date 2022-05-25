import { GraphQLClient } from "graphql-request";
import * as Dom from "graphql-request/dist/types.dom";
import gql from "graphql-tag";
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
};

export type BallotInfo = {
    __typename?: "BallotInfo";
    closeDate: Scalars["Float"];
    depositAmount: Scalars["Float"];
    execDate: Scalars["Float"];
    issuer: Scalars["String"];
    no: Scalars["Float"];
    openDate: Scalars["Float"];
    quorum: Scalars["Float"];
    /**
     * description of values:
     *
     *     NoQuorum = '0',
     *
     *     MajorityDecision = '1',
     *
     */
    reason: Scalars["String"];
    request: ModifyRequest;
    /**
     * description of values:
     *
     *     InProgress = '0',
     *
     *     Applied = '1',
     *
     *     Rejected = '2',
     *
     */
    state: Scalars["String"];
    totalHoldedVotes: Scalars["Float"];
    voters?: Maybe<Array<VoterInfo>>;
    yes: Scalars["Float"];
};

export type BallotInfoInput = {
    closeDate: Scalars["Float"];
    depositAmount: Scalars["Float"];
    execDate: Scalars["Float"];
    issuer: Scalars["String"];
    no: Scalars["Float"];
    openDate: Scalars["Float"];
    quorum: Scalars["Float"];
    /**
     * description of values:
     *
     *     NoQuorum = '0',
     *
     *     MajorityDecision = '1',
     *
     */
    reason: Scalars["String"];
    request: ModifyRequestInput;
    /**
     * description of values:
     *
     *     InProgress = '0',
     *
     *     Applied = '1',
     *
     *     Rejected = '2',
     *
     */
    state: Scalars["String"];
    totalHoldedVotes: Scalars["Float"];
    voters?: InputMaybe<Array<VoterInfoInput>>;
    yes: Scalars["Float"];
};

export type Config = {
    __typename?: "Config";
    /** system identifier */
    _id: Scalars["String"];
    name: Scalars["String"];
    value: ValueObject;
};

export type ConfigConnection = {
    __typename?: "ConfigConnection";
    edges?: Maybe<Array<ConfigEdge>>;
    pageInfo?: Maybe<ConfigPageInfo>;
};

export type ConfigEdge = {
    __typename?: "ConfigEdge";
    cursor?: Maybe<Scalars["String"]>;
    node?: Maybe<Config>;
};

export type ConfigFilter = {
    /** filter by config name */
    name?: InputMaybe<Scalars["String"]>;
};

export type ConfigInputType = {
    /** system identifier */
    _id: Scalars["String"];
    name: Scalars["String"];
    value: ValueObjectType;
};

export type ConfigPageInfo = {
    __typename?: "ConfigPageInfo";
    endCursor?: Maybe<Scalars["String"]>;
    hasNextPage: Scalars["Boolean"];
    hasPreviousPage: Scalars["Boolean"];
    startCursor?: Maybe<Scalars["String"]>;
};

export type ConnectionArgs = {
    /** Paginate after opaque cursor */
    after?: InputMaybe<Scalars["String"]>;
    /** Paginate before opaque cursor */
    before?: InputMaybe<Scalars["String"]>;
    /** Paginate first */
    first?: InputMaybe<Scalars["Float"]>;
    /** Paginate last */
    last?: InputMaybe<Scalars["Float"]>;
    /** sort field name */
    sortBy?: InputMaybe<Scalars["String"]>;
    /** sort directory - ASC or DESC. Default value DESC */
    sortDir?: InputMaybe<Scalars["String"]>;
};

export type CreateProviderInput = {
    /** provider contract address */
    address: Scalars["String"];
    authority?: InputMaybe<Scalars["String"]>;
    availableDeposit?: InputMaybe<Scalars["Float"]>;
    origins?: InputMaybe<OriginsInput>;
    providerInfo: ProviderInfoInput;
    teeOffers?: InputMaybe<Array<Scalars["String"]>>;
    valueOffers?: InputMaybe<Array<Scalars["String"]>>;
};

export type Erc20 = {
    __typename?: "Erc20";
    /** system identifier */
    _id: Scalars["String"];
    balance?: Maybe<Scalars["Float"]>;
    netBalance: Scalars["String"];
    /** owner address */
    owner: Scalars["String"];
};

export type Erc20Connection = {
    __typename?: "Erc20Connection";
    edges?: Maybe<Array<Erc20Edge>>;
    pageInfo?: Maybe<Erc20PageInfo>;
};

export type Erc20Edge = {
    __typename?: "Erc20Edge";
    cursor?: Maybe<Scalars["String"]>;
    node?: Maybe<Erc20>;
};

export type Erc20InputType = {
    /** system identifier */
    _id: Scalars["String"];
    balance?: InputMaybe<Scalars["Float"]>;
    netBalance: Scalars["String"];
    /** owner address */
    owner: Scalars["String"];
};

export type Erc20PageInfo = {
    __typename?: "Erc20PageInfo";
    endCursor?: Maybe<Scalars["String"]>;
    hasNextPage: Scalars["Boolean"];
    hasPreviousPage: Scalars["Boolean"];
    startCursor?: Maybe<Scalars["String"]>;
};

export type Erc20rFilter = {
    /** filter by owner address */
    owner?: InputMaybe<Scalars["String"]>;
};

export type ListConfigResponse = {
    __typename?: "ListConfigResponse";
    page: ConfigConnection;
    pageData?: Maybe<PageDataDto>;
};

export type ListErc20Response = {
    __typename?: "ListErc20Response";
    page: Erc20Connection;
    pageData?: Maybe<PageDataDto>;
};

export type ListLockingResponse = {
    __typename?: "ListLockingResponse";
    page: LockingConnection;
    pageData?: Maybe<PageDataDto>;
};

export type ListOffersResponse = {
    __typename?: "ListOffersResponse";
    page: OfferConnection;
    pageData?: Maybe<PageDataDto>;
};

export type ListOrdersResponse = {
    __typename?: "ListOrdersResponse";
    page: OrderConnection;
    pageData?: Maybe<PageDataDto>;
};

export type ListProvidersResponse = {
    __typename?: "ListProvidersResponse";
    page: ProviderConnection;
    pageData?: Maybe<PageDataDto>;
};

export type ListStakingResponse = {
    __typename?: "ListStakingResponse";
    page: StakingConnection;
    pageData?: Maybe<PageDataDto>;
};

export type ListTeeOffersResponse = {
    __typename?: "ListTeeOffersResponse";
    page: TeeOfferConnection;
    pageData?: Maybe<PageDataDto>;
};

export type ListVotingResponse = {
    __typename?: "ListVotingResponse";
    page: VotingConnection;
    pageData?: Maybe<PageDataDto>;
};

export type LockInfo = {
    __typename?: "LockInfo";
    amount: Scalars["Float"];
    contract: TLockInfoSource;
    fromDate: Scalars["Float"];
    toDate: Scalars["Float"];
};

export type LockInfoInput = {
    amount: Scalars["Float"];
    contract: TLockInfoSource;
    fromDate: Scalars["Float"];
    toDate: Scalars["Float"];
};

export type Locking = {
    __typename?: "Locking";
    /** system identifier */
    _id: Scalars["String"];
    lockInfo: LockInfo;
    /** owner address */
    owner: Scalars["String"];
};

export type LockingConnection = {
    __typename?: "LockingConnection";
    edges?: Maybe<Array<LockingEdge>>;
    pageInfo?: Maybe<LockingPageInfo>;
};

export type LockingEdge = {
    __typename?: "LockingEdge";
    cursor?: Maybe<Scalars["String"]>;
    node?: Maybe<Locking>;
};

export type LockingFilter = {
    /** filter by owner address */
    owner?: InputMaybe<Scalars["String"]>;
};

export type LockingInputType = {
    /** system identifier */
    _id: Scalars["String"];
    lockInfo: LockInfoInput;
    /** owner address */
    owner: Scalars["String"];
};

export type LockingPageInfo = {
    __typename?: "LockingPageInfo";
    endCursor?: Maybe<Scalars["String"]>;
    hasNextPage: Scalars["Boolean"];
    hasPreviousPage: Scalars["Boolean"];
    startCursor?: Maybe<Scalars["String"]>;
};

export type ModifyRequest = {
    __typename?: "ModifyRequest";
    /**
     * description of values:
     *
     *     Orders = "0",
     *
     *     ProviderRegistry = "1",
     *
     *     Staking = "2",
     *
     *     Superpro = "3",
     *
     *     TeeOffersFactory = "4",
     *
     *     Token = "5",
     *
     *     ValueOffersFactory = "6",
     *
     *     Voting = "7",
     *
     *     Consensus = "8",
     *
     *     Suspicious = "9",
     *
     *     LastBlocks = "10",
     *
     *      Epochs = "11"
     *
     */
    contractName: Scalars["String"];
    newContractAddress?: Maybe<Scalars["String"]>;
    newParamValue?: Maybe<Scalars["Float"]>;
    /**
     * description of values:
     *
     *   OrderMinimumDeposit = "0",
     *
     *   ProfitWithdrawDelayDays = "1",
     *
     *   MinSecDeposit = "2",
     *
     *   StakingPercentPerDay = "3",
     *
     *   StopDelayDays = "4",
     *
     *   TeeOfferSecDeposit = "5",
     *
     *   OfferSecDeposit = "6",
     *
     *   TeeRewardPerEpoch = "7",
     *
     *   VotingDeposit = "8",
     *
     *   VotingDurationDays = "9",
     *
     *   VotingExecutionTimeoutDays = "10",
     *
     *   VotingHoldDays = "11",
     *
     *   VotingMinimumTurnout = "12",
     *
     *   L1 = "13",
     *
     *   L2 = "14",
     *
     *   Threshold = "15",
     *
     *   EpochDurationSeconds = "16"
     *
     */
    paramName: Scalars["String"];
    /**
     * description of values:
     *
     *     NewContractAddress = "0",
     *
     *     NewParamValue = "1"
     *
     */
    requestType: Scalars["String"];
};

export type ModifyRequestInput = {
    /**
     * description of values:
     *
     *     Orders = "0",
     *
     *     ProviderRegistry = "1",
     *
     *     Staking = "2",
     *
     *     Superpro = "3",
     *
     *     TeeOffersFactory = "4",
     *
     *     Token = "5",
     *
     *     ValueOffersFactory = "6",
     *
     *     Voting = "7",
     *
     *     Consensus = "8",
     *
     *     Suspicious = "9",
     *
     *     LastBlocks = "10",
     *
     *      Epochs = "11"
     *
     */
    contractName: Scalars["String"];
    newContractAddress?: InputMaybe<Scalars["String"]>;
    newParamValue?: InputMaybe<Scalars["Float"]>;
    /**
     * description of values:
     *
     *   OrderMinimumDeposit = "0",
     *
     *   ProfitWithdrawDelayDays = "1",
     *
     *   MinSecDeposit = "2",
     *
     *   StakingPercentPerDay = "3",
     *
     *   StopDelayDays = "4",
     *
     *   TeeOfferSecDeposit = "5",
     *
     *   OfferSecDeposit = "6",
     *
     *   TeeRewardPerEpoch = "7",
     *
     *   VotingDeposit = "8",
     *
     *   VotingDurationDays = "9",
     *
     *   VotingExecutionTimeoutDays = "10",
     *
     *   VotingHoldDays = "11",
     *
     *   VotingMinimumTurnout = "12",
     *
     *   L1 = "13",
     *
     *   L2 = "14",
     *
     *   Threshold = "15",
     *
     *   EpochDurationSeconds = "16"
     *
     */
    paramName: Scalars["String"];
    /**
     * description of values:
     *
     *     NewContractAddress = "0",
     *
     *     NewParamValue = "1"
     *
     */
    requestType: Scalars["String"];
};

export type Mutation = {
    __typename?: "Mutation";
    createProvider: Provider;
    removeConfig: Config;
    removeOffer: TeeOffer;
    removeProvider: Provider;
    updateConfig: Config;
    updateOffer: TeeOffer;
    updateProvider: Provider;
};

export type MutationCreateProviderArgs = {
    createProviderInput: CreateProviderInput;
};

export type MutationRemoveConfigArgs = {
    _id: Scalars["String"];
};

export type MutationRemoveOfferArgs = {
    _id: Scalars["String"];
};

export type MutationRemoveProviderArgs = {
    _id: Scalars["String"];
};

export type MutationUpdateConfigArgs = {
    updateConfigInput: UpdateConfigInput;
};

export type MutationUpdateOfferArgs = {
    updateTeeOfferInput: UpdateTeeOfferInput;
};

export type MutationUpdateProviderArgs = {
    updateProviderInput: UpdateProviderInput;
};

export type Offer = {
    __typename?: "Offer";
    /** system identifier */
    _id: Scalars["String"];
    /** contract address */
    address: Scalars["String"];
    authority?: Maybe<Scalars["String"]>;
    offerInfo: OfferInfo;
    origins?: Maybe<Origins>;
    providerInfo: ProviderInformation;
};

export type OfferConnection = {
    __typename?: "OfferConnection";
    edges?: Maybe<Array<OfferEdge>>;
    pageInfo?: Maybe<OfferPageInfo>;
};

export type OfferEdge = {
    __typename?: "OfferEdge";
    cursor?: Maybe<Scalars["String"]>;
    node?: Maybe<Offer>;
};

export type OfferFilter = {
    /** filter by contract address */
    address?: InputMaybe<Scalars["String"]>;
    /** filter by contract addresses */
    addresses?: InputMaybe<Array<Scalars["String"]>>;
    /** filter by offerInfo → group */
    group?: InputMaybe<Scalars["String"]>;
    /** filter by offerInfo → name */
    name?: InputMaybe<Scalars["String"]>;
    /** filter by offerInfo -> type */
    offerType?: InputMaybe<TOfferType>;
    /** filter by offerInfo -> restrictions -> offers */
    restrictions?: InputMaybe<Array<Scalars["String"]>>;
};

export type OfferInfo = {
    __typename?: "OfferInfo";
    allowedAccounts?: Maybe<Array<Scalars["String"]>>;
    allowedArgs?: Maybe<Scalars["String"]>;
    argsPublicKey: Scalars["String"];
    cancelable: Scalars["Boolean"];
    description: Scalars["String"];
    disabledAfter: Scalars["Float"];
    /**
     * The supported offers group.
     *
     *   TeeOffer = '0',
     *
     *   Storage = '1',
     *
     *   Solution = '2',
     *
     *   Data = '3'
     *
     */
    group: Scalars["String"];
    hash: Scalars["String"];
    holdSum: Scalars["Float"];
    inputFormat: Scalars["String"];
    linkage: Scalars["String"];
    maxDurationTimeMinutes: Scalars["Float"];
    name: Scalars["String"];
    /**
     * The supported offers type.
     *
     *      0 - Input,
     *
     *      1 - Output
     *
     */
    offerType: Scalars["String"];
    outputFormat: Scalars["String"];
    properties: Scalars["String"];
    restrictions?: Maybe<OfferRestrictions>;
    resultUrl: Scalars["String"];
};

export type OfferInfoInput = {
    allowedAccounts?: InputMaybe<Array<Scalars["String"]>>;
    allowedArgs?: InputMaybe<Scalars["String"]>;
    argsPublicKey: Scalars["String"];
    cancelable: Scalars["Boolean"];
    description: Scalars["String"];
    disabledAfter: Scalars["Float"];
    /**
     * The supported offers group.
     *
     *   TeeOffer = '0',
     *
     *   Storage = '1',
     *
     *   Solution = '2',
     *
     *   Data = '3'
     *
     */
    group: Scalars["String"];
    hash: Scalars["String"];
    holdSum: Scalars["Float"];
    inputFormat: Scalars["String"];
    linkage: Scalars["String"];
    maxDurationTimeMinutes: Scalars["Float"];
    name: Scalars["String"];
    /**
     * The supported offers type.
     *
     *      0 - Input,
     *
     *      1 - Output
     *
     */
    offerType: Scalars["String"];
    outputFormat: Scalars["String"];
    properties: Scalars["String"];
    restrictions?: InputMaybe<OfferRestrictionsInput>;
    resultUrl: Scalars["String"];
};

export type OfferInputType = {
    offerInfo: OfferInfoInput;
    providerInfo: ProviderInformationInput;
};

export type OfferPageInfo = {
    __typename?: "OfferPageInfo";
    endCursor?: Maybe<Scalars["String"]>;
    hasNextPage: Scalars["Boolean"];
    hasPreviousPage: Scalars["Boolean"];
    startCursor?: Maybe<Scalars["String"]>;
};

export type OfferRestrictions = {
    __typename?: "OfferRestrictions";
    offers?: Maybe<Array<Scalars["String"]>>;
    types?: Maybe<Array<TOfferType>>;
};

export type OfferRestrictionsInput = {
    offers?: InputMaybe<Array<Scalars["String"]>>;
    types?: InputMaybe<Array<TOfferType>>;
};

export type Order = {
    __typename?: "Order";
    /** system identifier */
    _id: Scalars["String"];
    /** contract address */
    address: Scalars["String"];
    authority?: Maybe<Scalars["String"]>;
    consumer: Scalars["String"];
    offerInfo?: Maybe<OfferInfo>;
    offerType: TOfferType;
    orderInfo: OrderInfo;
    orderResult: OrderResult;
    origins?: Maybe<Origins>;
    parentOrder?: Maybe<ParentOrderInfo>;
    teeOfferInfo?: Maybe<TeeOfferInfo>;
};

export type OrderArgs = {
    __typename?: "OrderArgs";
    inputOffers?: Maybe<Array<Scalars["String"]>>;
    selectedOffers?: Maybe<Array<Scalars["String"]>>;
    slots?: Maybe<Scalars["Float"]>;
};

export type OrderArgsInput = {
    inputOffers?: InputMaybe<Array<Scalars["String"]>>;
    selectedOffers?: InputMaybe<Array<Scalars["String"]>>;
    slots?: InputMaybe<Scalars["Float"]>;
};

export type OrderConnection = {
    __typename?: "OrderConnection";
    edges?: Maybe<Array<OrderEdge>>;
    pageInfo?: Maybe<OrderPageInfo>;
};

export type OrderEdge = {
    __typename?: "OrderEdge";
    cursor?: Maybe<Scalars["String"]>;
    node?: Maybe<Order>;
};

export type OrderInfo = {
    __typename?: "OrderInfo";
    args: OrderArgs;
    encryptedArgs: Scalars["String"];
    encryptedRequirements: Scalars["String"];
    offer: Scalars["String"];
    resultPublicKey: Scalars["String"];
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
    status: Scalars["String"];
};

export type OrderInfoInput = {
    args: OrderArgsInput;
    encryptedArgs: Scalars["String"];
    encryptedRequirements: Scalars["String"];
    offer: Scalars["String"];
    resultPublicKey: Scalars["String"];
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
    status: Scalars["String"];
};

export type OrderInputType = {
    consumer: Scalars["String"];
    offerInfo?: InputMaybe<OfferInfoInput>;
    offerType: TOfferType;
    orderInfo: OrderInfoInput;
    orderResult: OrderResultInput;
    parentOrder?: InputMaybe<ParentOrderInfoInput>;
    teeOfferInfo?: InputMaybe<TeeOfferInfoInput>;
};

export type OrderPageInfo = {
    __typename?: "OrderPageInfo";
    endCursor?: Maybe<Scalars["String"]>;
    hasNextPage: Scalars["Boolean"];
    hasPreviousPage: Scalars["Boolean"];
    startCursor?: Maybe<Scalars["String"]>;
};

export type OrderResult = {
    __typename?: "OrderResult";
    encryptedError?: Maybe<Scalars["String"]>;
    encryptedResult?: Maybe<Scalars["String"]>;
    orderPrice?: Maybe<Scalars["Float"]>;
};

export type OrderResultInput = {
    encryptedError?: InputMaybe<Scalars["String"]>;
    encryptedResult?: InputMaybe<Scalars["String"]>;
    orderPrice?: InputMaybe<Scalars["Float"]>;
};

export type OrdersFilter = {
    /** filter by contract address */
    address?: InputMaybe<Scalars["String"]>;
    /** filter by orderInfo -> args -> inputOffers */
    inputOffers?: InputMaybe<Array<Scalars["String"]>>;
    /** filter by orderInfo -> args -> selectedOffers */
    selectedOffers?: InputMaybe<Array<Scalars["String"]>>;
    /** filter by orderInfo -> status */
    status?: InputMaybe<Scalars["String"]>;
};

export type Origins = {
    __typename?: "Origins";
    createdBy: Scalars["String"];
    createdDate: Scalars["Float"];
    modifiedBy: Scalars["String"];
    modifiedDate: Scalars["Float"];
};

export type OriginsInput = {
    createdBy: Scalars["String"];
    createdDate: Scalars["Float"];
    modifiedBy: Scalars["String"];
    modifiedDate: Scalars["Float"];
};

export type PageDataDto = {
    __typename?: "PageDataDto";
    /** total number of documents */
    count: Scalars["Float"];
    /** selection limit */
    limit: Scalars["Float"];
    /** selection offset */
    offset: Scalars["Float"];
};

export type ParentOrderInfo = {
    __typename?: "ParentOrderInfo";
    offerName: Scalars["String"];
    orderAddress: Scalars["String"];
};

export type ParentOrderInfoInput = {
    offerName: Scalars["String"];
    orderAddress: Scalars["String"];
};

export type Provider = {
    __typename?: "Provider";
    /** system identifier */
    _id: Scalars["String"];
    /** contract address */
    address: Scalars["String"];
    authority?: Maybe<Scalars["String"]>;
    availableDeposit?: Maybe<Scalars["Float"]>;
    origins?: Maybe<Origins>;
    providerInfo: ProviderInfo;
    teeOffers?: Maybe<Array<Scalars["String"]>>;
    valueOffers?: Maybe<Array<Scalars["String"]>>;
};

export type ProviderConnection = {
    __typename?: "ProviderConnection";
    edges?: Maybe<Array<ProviderEdge>>;
    pageInfo?: Maybe<ProviderPageInfo>;
};

export type ProviderEdge = {
    __typename?: "ProviderEdge";
    cursor?: Maybe<Scalars["String"]>;
    node?: Maybe<Provider>;
};

export type ProviderFilter = {
    /** filter by contract address */
    address?: InputMaybe<Scalars["String"]>;
};

export type ProviderInfo = {
    __typename?: "ProviderInfo";
    actionAccount: Scalars["String"];
    description: Scalars["String"];
    metadata: Scalars["String"];
    name: Scalars["String"];
    tokenReceiver: Scalars["String"];
};

export type ProviderInfoInput = {
    actionAccount: Scalars["String"];
    description: Scalars["String"];
    metadata: Scalars["String"];
    name: Scalars["String"];
    tokenReceiver: Scalars["String"];
};

export type ProviderInformation = {
    __typename?: "ProviderInformation";
    actionAccount: Scalars["String"];
    description: Scalars["String"];
    metadata: Scalars["String"];
    name: Scalars["String"];
    tokenReceiver: Scalars["String"];
};

export type ProviderInformationInput = {
    actionAccount: Scalars["String"];
    description: Scalars["String"];
    metadata: Scalars["String"];
    name: Scalars["String"];
    tokenReceiver: Scalars["String"];
};

export type ProviderInputType = {
    authority?: InputMaybe<Scalars["String"]>;
    availableDeposit?: InputMaybe<Scalars["Float"]>;
    providerInfo: ProviderInfoInput;
    teeOffers?: InputMaybe<Array<Scalars["String"]>>;
    valueOffers?: InputMaybe<Array<Scalars["String"]>>;
};

export type ProviderPageInfo = {
    __typename?: "ProviderPageInfo";
    endCursor?: Maybe<Scalars["String"]>;
    hasNextPage: Scalars["Boolean"];
    hasPreviousPage: Scalars["Boolean"];
    startCursor?: Maybe<Scalars["String"]>;
};

export type Query = {
    __typename?: "Query";
    config: Config;
    configs: ListConfigResponse;
    erc20: Erc20;
    listErc20: ListErc20Response;
    listLocking: ListLockingResponse;
    listStaking: ListStakingResponse;
    listVoting: ListVotingResponse;
    locking: Locking;
    offer: Offer;
    offers: ListOffersResponse;
    order: Order;
    orders: ListOrdersResponse;
    provider: Provider;
    providers: ListProvidersResponse;
    staking: Staking;
    teeOffer: TeeOffer;
    teeOffers: ListTeeOffersResponse;
    voting: Voting;
};

export type QueryConfigArgs = {
    _id: Scalars["String"];
};

export type QueryConfigsArgs = {
    filter?: InputMaybe<ConfigFilter>;
    pagination: ConnectionArgs;
};

export type QueryErc20Args = {
    _id: Scalars["String"];
};

export type QueryListErc20Args = {
    filter?: InputMaybe<Erc20rFilter>;
    pagination: ConnectionArgs;
};

export type QueryListLockingArgs = {
    filter?: InputMaybe<LockingFilter>;
    pagination: ConnectionArgs;
};

export type QueryListStakingArgs = {
    filter?: InputMaybe<StakingFilter>;
    pagination: ConnectionArgs;
};

export type QueryListVotingArgs = {
    filter?: InputMaybe<VotingFilter>;
    pagination: ConnectionArgs;
};

export type QueryLockingArgs = {
    _id: Scalars["String"];
};

export type QueryOfferArgs = {
    _id: Scalars["String"];
};

export type QueryOffersArgs = {
    filter?: InputMaybe<OfferFilter>;
    pagination: ConnectionArgs;
};

export type QueryOrderArgs = {
    _id: Scalars["String"];
};

export type QueryOrdersArgs = {
    filter?: InputMaybe<OrdersFilter>;
    pagination: ConnectionArgs;
};

export type QueryProviderArgs = {
    _id: Scalars["String"];
};

export type QueryProvidersArgs = {
    filter: ProviderFilter;
    pagination: ConnectionArgs;
};

export type QueryStakingArgs = {
    _id: Scalars["String"];
};

export type QueryTeeOfferArgs = {
    _id: Scalars["String"];
};

export type QueryTeeOffersArgs = {
    filter?: InputMaybe<TeeOfferFilter>;
    pagination: ConnectionArgs;
};

export type QueryVotingArgs = {
    _id: Scalars["String"];
};

export type StakeInfo = {
    __typename?: "StakeInfo";
    amount: Scalars["Float"];
    profit: Scalars["Float"];
    startDate: Scalars["Float"];
    totalLocked: Scalars["Float"];
};

export type StakeInfoInput = {
    amount: Scalars["Float"];
    profit: Scalars["Float"];
    startDate: Scalars["Float"];
    totalLocked: Scalars["Float"];
};

export type Staking = {
    __typename?: "Staking";
    /** system identifier */
    _id: Scalars["String"];
    /** owner address */
    owner: Scalars["String"];
    stakeInfo: StakeInfo;
};

export type StakingConnection = {
    __typename?: "StakingConnection";
    edges?: Maybe<Array<StakingEdge>>;
    pageInfo?: Maybe<StakingPageInfo>;
};

export type StakingEdge = {
    __typename?: "StakingEdge";
    cursor?: Maybe<Scalars["String"]>;
    node?: Maybe<Staking>;
};

export type StakingFilter = {
    /** filter by owner address */
    owner?: InputMaybe<Scalars["String"]>;
};

export type StakingInputType = {
    /** system identifier */
    _id: Scalars["String"];
    /** owner address */
    owner: Scalars["String"];
    stakeInfo: StakeInfoInput;
};

export type StakingPageInfo = {
    __typename?: "StakingPageInfo";
    endCursor?: Maybe<Scalars["String"]>;
    hasNextPage: Scalars["Boolean"];
    hasPreviousPage: Scalars["Boolean"];
    startCursor?: Maybe<Scalars["String"]>;
};

export type Subscription = {
    __typename?: "Subscription";
    /** event - create or update an entity */
    event: SubscriptionPayload;
};

export type SubscriptionPayload = {
    __typename?: "SubscriptionPayload";
    data?: Maybe<Array<Scalars["String"]>>;
    subscriptionSource: SubscriptionSource;
    type: SubscriptionType;
};

export enum SubscriptionSource {
    Config = "CONFIG",
    Erc20 = "ERC20",
    Locking = "LOCKING",
    Offer = "OFFER",
    Order = "ORDER",
    Provider = "PROVIDER",
    Staking = "STAKING",
    TeeOffer = "TEE_OFFER",
    Voting = "VOTING",
}

export enum SubscriptionType {
    Add = "add",
    Approve = "approve",
    Default = "default",
    Update = "update",
}

/** The supported LockInfo sources. */
export enum TLockInfoSource {
    Orders = "Orders",
    ProviderRegistry = "ProviderRegistry",
    TeeOffersFactory = "TeeOffersFactory",
    Voting = "Voting",
}

/** The supported offers type. */
export enum TOfferType {
    Data = "Data",
    Solution = "Solution",
    Storage = "Storage",
    TeeOffer = "TeeOffer",
}

export type TeeOffer = {
    __typename?: "TeeOffer";
    /** system identifier */
    _id: Scalars["String"];
    /** contract address */
    address: Scalars["String"];
    authority?: Maybe<Scalars["String"]>;
    disabledAfter: Scalars["Float"];
    origins?: Maybe<Origins>;
    providerAddress: Scalars["String"];
    providerInfo: ProviderInformation;
    teeOfferInfo: TeeOfferInfo;
};

export type TeeOfferConnection = {
    __typename?: "TeeOfferConnection";
    edges?: Maybe<Array<TeeOfferEdge>>;
    pageInfo?: Maybe<TeeOfferPageInfo>;
};

export type TeeOfferEdge = {
    __typename?: "TeeOfferEdge";
    cursor?: Maybe<Scalars["String"]>;
    node?: Maybe<TeeOffer>;
};

export type TeeOfferFilter = {
    /** filter by contract address */
    address?: InputMaybe<Scalars["String"]>;
    /** filter by contract addresses */
    addresses?: InputMaybe<Array<Scalars["String"]>>;
    /** filter by teeOfferInfo → name */
    name?: InputMaybe<Scalars["String"]>;
};

export type TeeOfferInfo = {
    __typename?: "TeeOfferInfo";
    argsPublicKey: Scalars["String"];
    description: Scalars["String"];
    minTimeMinutes: Scalars["Float"];
    name: Scalars["String"];
    properties: Scalars["String"];
    slots: Scalars["Float"];
    tcb: Scalars["String"];
    teeType: Scalars["String"];
    tlb: Scalars["String"];
};

export type TeeOfferInfoInput = {
    argsPublicKey: Scalars["String"];
    description: Scalars["String"];
    minTimeMinutes: Scalars["Float"];
    name: Scalars["String"];
    properties: Scalars["String"];
    slots: Scalars["Float"];
    tcb: Scalars["String"];
    teeType: Scalars["String"];
    tlb: Scalars["String"];
};

export type TeeOfferInputType = {
    disabledAfter: Scalars["Float"];
    providerAddress: Scalars["String"];
    providerInfo: ProviderInformationInput;
    teeOfferInfo: TeeOfferInfoInput;
};

export type TeeOfferPageInfo = {
    __typename?: "TeeOfferPageInfo";
    endCursor?: Maybe<Scalars["String"]>;
    hasNextPage: Scalars["Boolean"];
    hasPreviousPage: Scalars["Boolean"];
    startCursor?: Maybe<Scalars["String"]>;
};

export type UpdateConfigInput = {
    _id: Scalars["String"];
    /** config name */
    name?: InputMaybe<Scalars["String"]>;
    value?: InputMaybe<ValueObjectType>;
};

export type UpdateProviderInput = {
    _id: Scalars["String"];
    /** provider contract address */
    address?: InputMaybe<Scalars["String"]>;
    authority?: InputMaybe<Scalars["String"]>;
    availableDeposit?: InputMaybe<Scalars["Float"]>;
    origins?: InputMaybe<OriginsInput>;
    providerInfo?: InputMaybe<ProviderInfoInput>;
    teeOffers?: InputMaybe<Array<Scalars["String"]>>;
    valueOffers?: InputMaybe<Array<Scalars["String"]>>;
};

export type UpdateTeeOfferInput = {
    _id: Scalars["String"];
    /** provider contract address */
    address?: InputMaybe<Scalars["String"]>;
    authority?: InputMaybe<Scalars["String"]>;
    offerInfo?: InputMaybe<TeeOfferInfoInput>;
    origins?: InputMaybe<OriginsInput>;
    provider?: InputMaybe<Scalars["String"]>;
};

export type ValueObject = {
    __typename?: "ValueObject";
    actionAccountAddress?: Maybe<Scalars["String"]>;
    authorityAccountAddress?: Maybe<Scalars["String"]>;
    consensus?: Maybe<Scalars["String"]>;
    epochDurationSeconds?: Maybe<Scalars["Float"]>;
    epochs?: Maybe<Scalars["String"]>;
    lastBlocks?: Maybe<Scalars["String"]>;
    offerSecDeposit?: Maybe<Scalars["Float"]>;
    orderMinimumDeposit?: Maybe<Scalars["Float"]>;
    ordersFactory?: Maybe<Scalars["String"]>;
    profitWithdrawDelayDays?: Maybe<Scalars["Float"]>;
    providerRegistry?: Maybe<Scalars["String"]>;
    staking?: Maybe<Scalars["String"]>;
    stopDelayDays?: Maybe<Scalars["Float"]>;
    superpro?: Maybe<Scalars["String"]>;
    suspicious?: Maybe<Scalars["String"]>;
    teeOfferSecDeposit?: Maybe<Scalars["Float"]>;
    teeOffersFactory?: Maybe<Scalars["String"]>;
    teeRewardPerEpoch?: Maybe<Scalars["Float"]>;
    token?: Maybe<Scalars["String"]>;
    tokenReceiverAddress?: Maybe<Scalars["String"]>;
    valueOffersFactory?: Maybe<Scalars["String"]>;
    voting?: Maybe<Scalars["String"]>;
    votingDeposit?: Maybe<Scalars["Float"]>;
    votingDurationDays?: Maybe<Scalars["Float"]>;
    votingExecutionTimeoutDays?: Maybe<Scalars["Float"]>;
    votingHoldDays?: Maybe<Scalars["Float"]>;
    votingMinimumTurnout?: Maybe<Scalars["Float"]>;
};

export type ValueObjectType = {
    actionAccountAddress?: InputMaybe<Scalars["String"]>;
    authorityAccountAddress?: InputMaybe<Scalars["String"]>;
    consensus?: InputMaybe<Scalars["String"]>;
    epochDurationSeconds?: InputMaybe<Scalars["Float"]>;
    epochs?: InputMaybe<Scalars["String"]>;
    lastBlocks?: InputMaybe<Scalars["String"]>;
    offerSecDeposit?: InputMaybe<Scalars["Float"]>;
    orderMinimumDeposit?: InputMaybe<Scalars["Float"]>;
    ordersFactory?: InputMaybe<Scalars["String"]>;
    profitWithdrawDelayDays?: InputMaybe<Scalars["Float"]>;
    providerRegistry?: InputMaybe<Scalars["String"]>;
    staking?: InputMaybe<Scalars["String"]>;
    stopDelayDays?: InputMaybe<Scalars["Float"]>;
    superpro?: InputMaybe<Scalars["String"]>;
    suspicious?: InputMaybe<Scalars["String"]>;
    teeOfferSecDeposit?: InputMaybe<Scalars["Float"]>;
    teeOffersFactory?: InputMaybe<Scalars["String"]>;
    teeRewardPerEpoch?: InputMaybe<Scalars["Float"]>;
    token?: InputMaybe<Scalars["String"]>;
    tokenReceiverAddress?: InputMaybe<Scalars["String"]>;
    valueOffersFactory?: InputMaybe<Scalars["String"]>;
    voting?: InputMaybe<Scalars["String"]>;
    votingDeposit?: InputMaybe<Scalars["Float"]>;
    votingDurationDays?: InputMaybe<Scalars["Float"]>;
    votingExecutionTimeoutDays?: InputMaybe<Scalars["Float"]>;
    votingHoldDays?: InputMaybe<Scalars["Float"]>;
    votingMinimumTurnout?: InputMaybe<Scalars["Float"]>;
};

export type VoterInfo = {
    __typename?: "VoterInfo";
    voter: Scalars["String"];
    yes: Scalars["Boolean"];
};

export type VoterInfoInput = {
    voter: Scalars["String"];
    yes: Scalars["Boolean"];
};

export type Voting = {
    __typename?: "Voting";
    /** system identifier */
    _id: Scalars["String"];
    /** ballot address */
    ballotAddress: Scalars["String"];
    ballotInfo: BallotInfo;
};

export type VotingConnection = {
    __typename?: "VotingConnection";
    edges?: Maybe<Array<VotingEdge>>;
    pageInfo?: Maybe<VotingPageInfo>;
};

export type VotingEdge = {
    __typename?: "VotingEdge";
    cursor?: Maybe<Scalars["String"]>;
    node?: Maybe<Voting>;
};

export type VotingFilter = {
    /** filter by ballot address */
    ballotAddress?: InputMaybe<Scalars["String"]>;
};

export type VotingInputType = {
    /** system identifier */
    _id: Scalars["String"];
    /** ballot address */
    ballotAddress: Scalars["String"];
    ballotInfo: BallotInfoInput;
};

export type VotingPageInfo = {
    __typename?: "VotingPageInfo";
    endCursor?: Maybe<Scalars["String"]>;
    hasNextPage: Scalars["Boolean"];
    hasPreviousPage: Scalars["Boolean"];
    startCursor?: Maybe<Scalars["String"]>;
};

export type PageDataDtoFragmentFragment = { __typename?: "PageDataDto"; count: number; limit: number; offset: number };

export type EventSubscriptionVariables = Exact<{ [key: string]: never }>;

export type EventSubscription = {
    __typename?: "Subscription";
    event: {
        __typename?: "SubscriptionPayload";
        data?: Array<string> | null;
        type: SubscriptionType;
        subscriptionSource: SubscriptionSource;
    };
};

export type OffersQueryVariables = Exact<{
    pagination: ConnectionArgs;
    filter?: InputMaybe<OfferFilter>;
}>;

export type OffersQuery = {
    __typename?: "Query";
    result: {
        __typename?: "ListOffersResponse";
        pageData?: { __typename?: "PageDataDto"; count: number; limit: number; offset: number } | null;
        page: {
            __typename?: "OfferConnection";
            pageInfo?: {
                __typename?: "OfferPageInfo";
                endCursor?: string | null;
                hasNextPage: boolean;
                hasPreviousPage: boolean;
                startCursor?: string | null;
            } | null;
            edges?: Array<{
                __typename?: "OfferEdge";
                cursor?: string | null;
                node?: {
                    __typename?: "Offer";
                    _id: string;
                    address: string;
                    authority?: string | null;
                    offerInfo: {
                        __typename?: "OfferInfo";
                        group: string;
                        offerType: string;
                        allowedAccounts?: Array<string> | null;
                        allowedArgs?: string | null;
                        argsPublicKey: string;
                        cancelable: boolean;
                        description: string;
                        disabledAfter: number;
                        hash: string;
                        holdSum: number;
                        inputFormat: string;
                        linkage: string;
                        maxDurationTimeMinutes: number;
                        name: string;
                        outputFormat: string;
                        properties: string;
                        resultUrl: string;
                        restrictions?: {
                            __typename?: "OfferRestrictions";
                            offers?: Array<string> | null;
                            types?: Array<TOfferType> | null;
                        } | null;
                    };
                    origins?: {
                        __typename?: "Origins";
                        createdBy: string;
                        createdDate: number;
                        modifiedBy: string;
                        modifiedDate: number;
                    } | null;
                    providerInfo: {
                        __typename?: "ProviderInformation";
                        actionAccount: string;
                        description: string;
                        metadata: string;
                        name: string;
                        tokenReceiver: string;
                    };
                } | null;
            }> | null;
        };
    };
};

export type OffersSelectQueryVariables = Exact<{
    pagination: ConnectionArgs;
    filter?: InputMaybe<OfferFilter>;
}>;

export type OffersSelectQuery = {
    __typename?: "Query";
    result: {
        __typename?: "ListOffersResponse";
        pageData?: { __typename?: "PageDataDto"; count: number; limit: number; offset: number } | null;
        page: {
            __typename?: "OfferConnection";
            pageInfo?: {
                __typename?: "OfferPageInfo";
                endCursor?: string | null;
                hasNextPage: boolean;
                hasPreviousPage: boolean;
                startCursor?: string | null;
            } | null;
            edges?: Array<{
                __typename?: "OfferEdge";
                cursor?: string | null;
                node?: {
                    __typename?: "Offer";
                    address: string;
                    offerInfo: { __typename?: "OfferInfo"; name: string };
                } | null;
            }> | null;
        };
    };
};

export type OffersRestrictionsQueryVariables = Exact<{
    pagination: ConnectionArgs;
    filter?: InputMaybe<OfferFilter>;
}>;

export type OffersRestrictionsQuery = {
    __typename?: "Query";
    result: {
        __typename?: "ListOffersResponse";
        page: {
            __typename?: "OfferConnection";
            edges?: Array<{
                __typename?: "OfferEdge";
                node?: {
                    __typename?: "Offer";
                    address: string;
                    offerInfo: {
                        __typename?: "OfferInfo";
                        restrictions?: { __typename?: "OfferRestrictions"; offers?: Array<string> | null } | null;
                    };
                } | null;
            }> | null;
        };
    };
};

export type OrdersQueryVariables = Exact<{
    pagination: ConnectionArgs;
    filter?: InputMaybe<OrdersFilter>;
}>;

export type OrdersQuery = {
    __typename?: "Query";
    result: {
        __typename?: "ListOrdersResponse";
        pageData?: { __typename?: "PageDataDto"; count: number; limit: number; offset: number } | null;
        page: {
            __typename?: "OrderConnection";
            edges?: Array<{
                __typename?: "OrderEdge";
                cursor?: string | null;
                node?: {
                    __typename?: "Order";
                    _id: string;
                    address: string;
                    authority?: string | null;
                    consumer: string;
                    offerType: TOfferType;
                    parentOrder?: { __typename?: "ParentOrderInfo"; offerName: string; orderAddress: string } | null;
                    offerInfo?: {
                        __typename?: "OfferInfo";
                        allowedAccounts?: Array<string> | null;
                        allowedArgs?: string | null;
                        argsPublicKey: string;
                        cancelable: boolean;
                        description: string;
                        disabledAfter: number;
                        group: string;
                        hash: string;
                        holdSum: number;
                        inputFormat: string;
                        linkage: string;
                        maxDurationTimeMinutes: number;
                        name: string;
                        offerType: string;
                        outputFormat: string;
                        properties: string;
                        resultUrl: string;
                        restrictions?: {
                            __typename?: "OfferRestrictions";
                            offers?: Array<string> | null;
                            types?: Array<TOfferType> | null;
                        } | null;
                    } | null;
                    orderInfo: {
                        __typename?: "OrderInfo";
                        encryptedArgs: string;
                        encryptedRequirements: string;
                        offer: string;
                        resultPublicKey: string;
                        status: string;
                        args: {
                            __typename?: "OrderArgs";
                            inputOffers?: Array<string> | null;
                            selectedOffers?: Array<string> | null;
                            slots?: number | null;
                        };
                    };
                    orderResult: {
                        __typename?: "OrderResult";
                        encryptedError?: string | null;
                        encryptedResult?: string | null;
                        orderPrice?: number | null;
                    };
                    origins?: {
                        __typename?: "Origins";
                        createdBy: string;
                        createdDate: number;
                        modifiedBy: string;
                        modifiedDate: number;
                    } | null;
                    teeOfferInfo?: {
                        __typename?: "TeeOfferInfo";
                        argsPublicKey: string;
                        description: string;
                        minTimeMinutes: number;
                        name: string;
                        properties: string;
                        slots: number;
                        tcb: string;
                        teeType: string;
                        tlb: string;
                    } | null;
                } | null;
            }> | null;
            pageInfo?: {
                __typename?: "OrderPageInfo";
                endCursor?: string | null;
                hasNextPage: boolean;
                hasPreviousPage: boolean;
                startCursor?: string | null;
            } | null;
        };
    };
};

export type OrdersSelectQueryVariables = Exact<{
    pagination: ConnectionArgs;
    filter?: InputMaybe<OrdersFilter>;
}>;

export type OrdersSelectQuery = {
    __typename?: "Query";
    result: {
        __typename?: "ListOrdersResponse";
        pageData?: { __typename?: "PageDataDto"; count: number; limit: number; offset: number } | null;
        page: {
            __typename?: "OrderConnection";
            edges?: Array<{
                __typename?: "OrderEdge";
                cursor?: string | null;
                node?: { __typename?: "Order"; address: string } | null;
            }> | null;
            pageInfo?: {
                __typename?: "OrderPageInfo";
                endCursor?: string | null;
                hasNextPage: boolean;
                hasPreviousPage: boolean;
                startCursor?: string | null;
            } | null;
        };
    };
};

export type ProvidersQueryVariables = Exact<{
    pagination: ConnectionArgs;
    filter: ProviderFilter;
}>;

export type ProvidersQuery = {
    __typename?: "Query";
    result: {
        __typename?: "ListProvidersResponse";
        pageData?: { __typename?: "PageDataDto"; count: number; limit: number; offset: number } | null;
        page: {
            __typename?: "ProviderConnection";
            pageInfo?: {
                __typename?: "ProviderPageInfo";
                endCursor?: string | null;
                hasNextPage: boolean;
                hasPreviousPage: boolean;
                startCursor?: string | null;
            } | null;
            edges?: Array<{
                __typename?: "ProviderEdge";
                cursor?: string | null;
                node?: {
                    __typename?: "Provider";
                    _id: string;
                    address: string;
                    authority?: string | null;
                    availableDeposit?: number | null;
                    valueOffers?: Array<string> | null;
                    teeOffers?: Array<string> | null;
                    origins?: {
                        __typename?: "Origins";
                        createdBy: string;
                        createdDate: number;
                        modifiedBy: string;
                        modifiedDate: number;
                    } | null;
                    providerInfo: {
                        __typename?: "ProviderInfo";
                        actionAccount: string;
                        description: string;
                        metadata: string;
                        name: string;
                        tokenReceiver: string;
                    };
                } | null;
            }> | null;
        };
    };
};

export type TeeOffersQueryVariables = Exact<{
    pagination: ConnectionArgs;
    filter?: InputMaybe<TeeOfferFilter>;
}>;

export type TeeOffersQuery = {
    __typename?: "Query";
    result: {
        __typename?: "ListTeeOffersResponse";
        pageData?: { __typename?: "PageDataDto"; count: number; limit: number; offset: number } | null;
        page: {
            __typename?: "TeeOfferConnection";
            edges?: Array<{
                __typename?: "TeeOfferEdge";
                cursor?: string | null;
                node?: {
                    __typename?: "TeeOffer";
                    _id: string;
                    address: string;
                    authority?: string | null;
                    disabledAfter: number;
                    providerAddress: string;
                    origins?: {
                        __typename?: "Origins";
                        createdBy: string;
                        createdDate: number;
                        modifiedBy: string;
                        modifiedDate: number;
                    } | null;
                    providerInfo: {
                        __typename?: "ProviderInformation";
                        actionAccount: string;
                        description: string;
                        metadata: string;
                        name: string;
                        tokenReceiver: string;
                    };
                    teeOfferInfo: {
                        __typename?: "TeeOfferInfo";
                        argsPublicKey: string;
                        description: string;
                        minTimeMinutes: number;
                        name: string;
                        properties: string;
                        slots: number;
                        tcb: string;
                        teeType: string;
                        tlb: string;
                    };
                } | null;
            }> | null;
            pageInfo?: {
                __typename?: "TeeOfferPageInfo";
                endCursor?: string | null;
                hasNextPage: boolean;
                hasPreviousPage: boolean;
                startCursor?: string | null;
            } | null;
        };
    };
};

export const PageDataDtoFragmentFragmentDoc = gql`
    fragment PageDataDtoFragment on PageDataDto {
        count
        limit
        offset
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
                        address
                        authority
                        offerInfo {
                            group
                            offerType
                            allowedAccounts
                            allowedArgs
                            argsPublicKey
                            cancelable
                            description
                            disabledAfter
                            hash
                            holdSum
                            inputFormat
                            linkage
                            maxDurationTimeMinutes
                            name
                            outputFormat
                            properties
                            resultUrl
                            restrictions {
                                offers
                                types
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
    ${PageDataDtoFragmentFragmentDoc}
`;
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
                        address
                        offerInfo {
                            name
                        }
                    }
                    cursor
                }
            }
        }
    }
    ${PageDataDtoFragmentFragmentDoc}
`;
export const OffersRestrictionsDocument = gql`
    query OffersRestrictions($pagination: ConnectionArgs!, $filter: OfferFilter) {
        result: offers(pagination: $pagination, filter: $filter) {
            page {
                edges {
                    node {
                        address
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
                        address
                        authority
                        consumer
                        parentOrder {
                            offerName
                            orderAddress
                        }
                        offerInfo {
                            allowedAccounts
                            allowedArgs
                            argsPublicKey
                            cancelable
                            description
                            disabledAfter
                            group
                            hash
                            holdSum
                            inputFormat
                            linkage
                            maxDurationTimeMinutes
                            name
                            offerType
                            outputFormat
                            properties
                            restrictions {
                                offers
                                types
                            }
                            resultUrl
                        }
                        offerType
                        orderInfo {
                            args {
                                inputOffers
                                selectedOffers
                                slots
                            }
                            encryptedArgs
                            encryptedRequirements
                            offer
                            resultPublicKey
                            status
                        }
                        orderResult {
                            encryptedError
                            encryptedResult
                            orderPrice
                        }
                        origins {
                            createdBy
                            createdDate
                            modifiedBy
                            modifiedDate
                        }
                        teeOfferInfo {
                            argsPublicKey
                            description
                            minTimeMinutes
                            name
                            properties
                            slots
                            tcb
                            teeType
                            tlb
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
    ${PageDataDtoFragmentFragmentDoc}
`;
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
                        address
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
    ${PageDataDtoFragmentFragmentDoc}
`;
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
    ${PageDataDtoFragmentFragmentDoc}
`;
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
                        address
                        authority
                        disabledAfter
                        providerAddress
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
                            argsPublicKey
                            description
                            minTimeMinutes
                            name
                            properties
                            slots
                            tcb
                            teeType
                            tlb
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
    ${PageDataDtoFragmentFragmentDoc}
`;

export type SdkFunctionWrapper = <T>(
    action: (requestHeaders?: Record<string, string>) => Promise<T>,
    operationName: string,
    operationType?: string
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
    return {
        Event(
            variables?: EventSubscriptionVariables,
            requestHeaders?: Dom.RequestInit["headers"]
        ): Promise<EventSubscription> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<EventSubscription>(EventDocument, variables, {
                        ...requestHeaders,
                        ...wrappedRequestHeaders,
                    }),
                "Event",
                "subscription"
            );
        },
        Offers(variables: OffersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<OffersQuery> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<OffersQuery>(OffersDocument, variables, {
                        ...requestHeaders,
                        ...wrappedRequestHeaders,
                    }),
                "Offers",
                "query"
            );
        },
        OffersSelect(
            variables: OffersSelectQueryVariables,
            requestHeaders?: Dom.RequestInit["headers"]
        ): Promise<OffersSelectQuery> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<OffersSelectQuery>(OffersSelectDocument, variables, {
                        ...requestHeaders,
                        ...wrappedRequestHeaders,
                    }),
                "OffersSelect",
                "query"
            );
        },
        OffersRestrictions(
            variables: OffersRestrictionsQueryVariables,
            requestHeaders?: Dom.RequestInit["headers"]
        ): Promise<OffersRestrictionsQuery> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<OffersRestrictionsQuery>(OffersRestrictionsDocument, variables, {
                        ...requestHeaders,
                        ...wrappedRequestHeaders,
                    }),
                "OffersRestrictions",
                "query"
            );
        },
        Orders(variables: OrdersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<OrdersQuery> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<OrdersQuery>(OrdersDocument, variables, {
                        ...requestHeaders,
                        ...wrappedRequestHeaders,
                    }),
                "Orders",
                "query"
            );
        },
        OrdersSelect(
            variables: OrdersSelectQueryVariables,
            requestHeaders?: Dom.RequestInit["headers"]
        ): Promise<OrdersSelectQuery> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<OrdersSelectQuery>(OrdersSelectDocument, variables, {
                        ...requestHeaders,
                        ...wrappedRequestHeaders,
                    }),
                "OrdersSelect",
                "query"
            );
        },
        Providers(
            variables: ProvidersQueryVariables,
            requestHeaders?: Dom.RequestInit["headers"]
        ): Promise<ProvidersQuery> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<ProvidersQuery>(ProvidersDocument, variables, {
                        ...requestHeaders,
                        ...wrappedRequestHeaders,
                    }),
                "Providers",
                "query"
            );
        },
        TeeOffers(
            variables: TeeOffersQueryVariables,
            requestHeaders?: Dom.RequestInit["headers"]
        ): Promise<TeeOffersQuery> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<TeeOffersQuery>(TeeOffersDocument, variables, {
                        ...requestHeaders,
                        ...wrappedRequestHeaders,
                    }),
                "TeeOffers",
                "query"
            );
        },
    };
}
export type Sdk = ReturnType<typeof getSdk>;

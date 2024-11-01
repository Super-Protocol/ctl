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
  JSON: any;
};

export type Attestation = {
  __typename?: 'Attestation';
  solutions: Array<Solution>;
};

export type AttributesFilter = {
  /** filter by attributes -> datasets */
  datasets?: InputMaybe<DatasetsFilter>;
  /** filter by attributes -> models */
  models?: InputMaybe<ModelsFilter>;
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

export type ConfigurationFilter = {
  /** filter by configuration -> attributes */
  attributes?: InputMaybe<AttributesFilter>;
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

export type DatasetsFilter = {
  /** Filter by language codes */
  languages?: InputMaybe<Array<LanguageCodeEnum>>;
  /** filter by models -> libraries */
  libraries?: InputMaybe<SupportedLibrary>;
  /** filter by models -> libraries */
  license?: InputMaybe<LicenseCode>;
  /** filter by datasets -> tasks */
  tasks?: InputMaybe<TaskFilter>;
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

/** ISO 639-3 Language codes */
export enum LanguageCodeEnum {
  Aaa = 'aaa',
  Aab = 'aab',
  Aac = 'aac',
  Aad = 'aad',
  Aae = 'aae',
  Aaf = 'aaf',
  Aag = 'aag',
  Aah = 'aah',
  Aai = 'aai',
  Aak = 'aak',
  Aal = 'aal',
  Aan = 'aan',
  Aao = 'aao',
  Aap = 'aap',
  Aaq = 'aaq',
  Aar = 'aar',
  Aas = 'aas',
  Aat = 'aat',
  Aau = 'aau',
  Aaw = 'aaw',
  Aax = 'aax',
  Aaz = 'aaz',
  Aba = 'aba',
  Abb = 'abb',
  Abc = 'abc',
  Abd = 'abd',
  Abe = 'abe',
  Abf = 'abf',
  Abg = 'abg',
  Abh = 'abh',
  Abi = 'abi',
  Abj = 'abj',
  Abk = 'abk',
  Abl = 'abl',
  Abm = 'abm',
  Abn = 'abn',
  Abo = 'abo',
  Abp = 'abp',
  Abq = 'abq',
  Abr = 'abr',
  Abs = 'abs',
  Abt = 'abt',
  Abu = 'abu',
  Abv = 'abv',
  Abw = 'abw',
  Abx = 'abx',
  Aby = 'aby',
  Abz = 'abz',
  Aca = 'aca',
  Acb = 'acb',
  Acd = 'acd',
  Ace = 'ace',
  Acf = 'acf',
  Ach = 'ach',
  Aci = 'aci',
  Ack = 'ack',
  Acl = 'acl',
  Acm = 'acm',
  Acn = 'acn',
  Acp = 'acp',
  Acq = 'acq',
  Acr = 'acr',
  Acs = 'acs',
  Act = 'act',
  Acu = 'acu',
  Acv = 'acv',
  Acw = 'acw',
  Acx = 'acx',
  Acy = 'acy',
  Acz = 'acz',
  Ada = 'ada',
  Adb = 'adb',
  Add = 'add',
  Ade = 'ade',
  Adf = 'adf',
  Adg = 'adg',
  Adh = 'adh',
  Adi = 'adi',
  Adj = 'adj',
  Adl = 'adl',
  Adn = 'adn',
  Ado = 'ado',
  Adq = 'adq',
  Adr = 'adr',
  Ads = 'ads',
  Adt = 'adt',
  Adu = 'adu',
  Adw = 'adw',
  Adx = 'adx',
  Ady = 'ady',
  Adz = 'adz',
  Aea = 'aea',
  Aeb = 'aeb',
  Aec = 'aec',
  Aed = 'aed',
  Aee = 'aee',
  Aek = 'aek',
  Ael = 'ael',
  Aem = 'aem',
  Aen = 'aen',
  Aeq = 'aeq',
  Aer = 'aer',
  Aes = 'aes',
  Aeu = 'aeu',
  Aew = 'aew',
  Aey = 'aey',
  Aez = 'aez',
  Afb = 'afb',
  Afd = 'afd',
  Afe = 'afe',
  Afg = 'afg',
  Afh = 'afh',
  Afi = 'afi',
  Afk = 'afk',
  Afn = 'afn',
  Afo = 'afo',
  Afp = 'afp',
  Afr = 'afr',
  Afs = 'afs',
  Aft = 'aft',
  Afu = 'afu',
  Afz = 'afz',
  Aga = 'aga',
  Agb = 'agb',
  Agc = 'agc',
  Agd = 'agd',
  Age = 'age',
  Agf = 'agf',
  Agg = 'agg',
  Agh = 'agh',
  Agi = 'agi',
  Agj = 'agj',
  Agk = 'agk',
  Agl = 'agl',
  Agm = 'agm',
  Agn = 'agn',
  Ago = 'ago',
  Agq = 'agq',
  Agr = 'agr',
  Ags = 'ags',
  Agt = 'agt',
  Agu = 'agu',
  Agv = 'agv',
  Agw = 'agw',
  Agx = 'agx',
  Agy = 'agy',
  Agz = 'agz',
  Aha = 'aha',
  Ahb = 'ahb',
  Ahg = 'ahg',
  Ahh = 'ahh',
  Ahi = 'ahi',
  Ahk = 'ahk',
  Ahl = 'ahl',
  Ahm = 'ahm',
  Ahn = 'ahn',
  Aho = 'aho',
  Ahp = 'ahp',
  Ahr = 'ahr',
  Ahs = 'ahs',
  Aht = 'aht',
  Aia = 'aia',
  Aib = 'aib',
  Aic = 'aic',
  Aid = 'aid',
  Aie = 'aie',
  Aif = 'aif',
  Aig = 'aig',
  Aih = 'aih',
  Aii = 'aii',
  Aij = 'aij',
  Aik = 'aik',
  Ail = 'ail',
  Aim = 'aim',
  Ain = 'ain',
  Aio = 'aio',
  Aip = 'aip',
  Aiq = 'aiq',
  Air = 'air',
  Ait = 'ait',
  Aiw = 'aiw',
  Aix = 'aix',
  Aiy = 'aiy',
  Aja = 'aja',
  Ajg = 'ajg',
  Aji = 'aji',
  Ajn = 'ajn',
  Ajp = 'ajp',
  Ajt = 'ajt',
  Aju = 'aju',
  Ajw = 'ajw',
  Ajz = 'ajz',
  Aka = 'aka',
  Akb = 'akb',
  Akc = 'akc',
  Akd = 'akd',
  Ake = 'ake',
  Akf = 'akf',
  Akg = 'akg',
  Akh = 'akh',
  Aki = 'aki',
  Akj = 'akj',
  Akk = 'akk',
  Akl = 'akl',
  Akm = 'akm',
  Ako = 'ako',
  Akp = 'akp',
  Akq = 'akq',
  Akr = 'akr',
  Aks = 'aks',
  Akt = 'akt',
  Aku = 'aku',
  Akv = 'akv',
  Akw = 'akw',
  Akx = 'akx',
  Aky = 'aky',
  Akz = 'akz',
  Ala = 'ala',
  Alc = 'alc',
  Ald = 'ald',
  Ale = 'ale',
  Alf = 'alf',
  Alh = 'alh',
  Ali = 'ali',
  Alj = 'alj',
  Alk = 'alk',
  All = 'all',
  Alm = 'alm',
  Aln = 'aln',
  Alo = 'alo',
  Alp = 'alp',
  Alq = 'alq',
  Alr = 'alr',
  Als = 'als',
  Alt = 'alt',
  Alu = 'alu',
  Alw = 'alw',
  Alx = 'alx',
  Aly = 'aly',
  Alz = 'alz',
  Ama = 'ama',
  Amb = 'amb',
  Amc = 'amc',
  Ame = 'ame',
  Amf = 'amf',
  Amg = 'amg',
  Amh = 'amh',
  Ami = 'ami',
  Amj = 'amj',
  Amk = 'amk',
  Aml = 'aml',
  Amm = 'amm',
  Amn = 'amn',
  Amo = 'amo',
  Amp = 'amp',
  Amq = 'amq',
  Amr = 'amr',
  Ams = 'ams',
  Amt = 'amt',
  Amu = 'amu',
  Amv = 'amv',
  Amw = 'amw',
  Amx = 'amx',
  Amy = 'amy',
  Amz = 'amz',
  Ana = 'ana',
  Anb = 'anb',
  Anc = 'anc',
  And = 'and',
  Ane = 'ane',
  Anf = 'anf',
  Ang = 'ang',
  Anh = 'anh',
  Ani = 'ani',
  Anj = 'anj',
  Ank = 'ank',
  Anl = 'anl',
  Anm = 'anm',
  Ann = 'ann',
  Ano = 'ano',
  Anp = 'anp',
  Anq = 'anq',
  Anr = 'anr',
  Ans = 'ans',
  Ant = 'ant',
  Anu = 'anu',
  Anv = 'anv',
  Anw = 'anw',
  Anx = 'anx',
  Any = 'any',
  Anz = 'anz',
  Aoa = 'aoa',
  Aob = 'aob',
  Aoc = 'aoc',
  Aod = 'aod',
  Aoe = 'aoe',
  Aof = 'aof',
  Aog = 'aog',
  Aoi = 'aoi',
  Aoj = 'aoj',
  Aok = 'aok',
  Aol = 'aol',
  Aom = 'aom',
  Aon = 'aon',
  Aor = 'aor',
  Aos = 'aos',
  Aot = 'aot',
  Aou = 'aou',
  Aox = 'aox',
  Aoz = 'aoz',
  Apb = 'apb',
  Apc = 'apc',
  Apd = 'apd',
  Ape = 'ape',
  Apf = 'apf',
  Apg = 'apg',
  Aph = 'aph',
  Api = 'api',
  Apj = 'apj',
  Apk = 'apk',
  Apl = 'apl',
  Apm = 'apm',
  Apn = 'apn',
  Apo = 'apo',
  App = 'app',
  Apq = 'apq',
  Apr = 'apr',
  Aps = 'aps',
  Apt = 'apt',
  Apu = 'apu',
  Apv = 'apv',
  Apw = 'apw',
  Apx = 'apx',
  Apy = 'apy',
  Apz = 'apz',
  Aqc = 'aqc',
  Aqd = 'aqd',
  Aqg = 'aqg',
  Aqm = 'aqm',
  Aqn = 'aqn',
  Aqp = 'aqp',
  Aqr = 'aqr',
  Aqt = 'aqt',
  Aqz = 'aqz',
  Ara = 'ara',
  Arb = 'arb',
  Arc = 'arc',
  Ard = 'ard',
  Are = 'are',
  Arg = 'arg',
  Arh = 'arh',
  Ari = 'ari',
  Arj = 'arj',
  Ark = 'ark',
  Arl = 'arl',
  Arn = 'arn',
  Aro = 'aro',
  Arp = 'arp',
  Arq = 'arq',
  Arr = 'arr',
  Ars = 'ars',
  Aru = 'aru',
  Arv = 'arv',
  Arw = 'arw',
  Arx = 'arx',
  Ary = 'ary',
  Arz = 'arz',
  Asa = 'asa',
  Asb = 'asb',
  Asc = 'asc',
  Ase = 'ase',
  Asf = 'asf',
  Asg = 'asg',
  Ash = 'ash',
  Asi = 'asi',
  Asj = 'asj',
  Ask = 'ask',
  Asl = 'asl',
  Asm = 'asm',
  Asn = 'asn',
  Aso = 'aso',
  Asp = 'asp',
  Asq = 'asq',
  Asr = 'asr',
  Ass = 'ass',
  Ast = 'ast',
  Asu = 'asu',
  Asv = 'asv',
  Asw = 'asw',
  Asx = 'asx',
  Asy = 'asy',
  Asz = 'asz',
  Ata = 'ata',
  Atb = 'atb',
  Atc = 'atc',
  Atd = 'atd',
  Ate = 'ate',
  Atg = 'atg',
  Ati = 'ati',
  Atj = 'atj',
  Atk = 'atk',
  Atl = 'atl',
  Atm = 'atm',
  Atn = 'atn',
  Ato = 'ato',
  Atp = 'atp',
  Atq = 'atq',
  Atr = 'atr',
  Ats = 'ats',
  Att = 'att',
  Atu = 'atu',
  Atv = 'atv',
  Atw = 'atw',
  Atx = 'atx',
  Aty = 'aty',
  Atz = 'atz',
  Aua = 'aua',
  Aub = 'aub',
  Auc = 'auc',
  Aud = 'aud',
  Aug = 'aug',
  Auh = 'auh',
  Aui = 'aui',
  Auj = 'auj',
  Auk = 'auk',
  Aul = 'aul',
  Aum = 'aum',
  Aun = 'aun',
  Auo = 'auo',
  Aup = 'aup',
  Auq = 'auq',
  Aur = 'aur',
  Aut = 'aut',
  Auu = 'auu',
  Auw = 'auw',
  Aux = 'aux',
  Auy = 'auy',
  Auz = 'auz',
  Ava = 'ava',
  Avb = 'avb',
  Avd = 'avd',
  Ave = 'ave',
  Avi = 'avi',
  Avk = 'avk',
  Avl = 'avl',
  Avm = 'avm',
  Avn = 'avn',
  Avo = 'avo',
  Avs = 'avs',
  Avt = 'avt',
  Avu = 'avu',
  Avv = 'avv',
  Awa = 'awa',
  Awb = 'awb',
  Awc = 'awc',
  Awe = 'awe',
  Awg = 'awg',
  Awh = 'awh',
  Awi = 'awi',
  Awk = 'awk',
  Awm = 'awm',
  Awn = 'awn',
  Awo = 'awo',
  Awr = 'awr',
  Aws = 'aws',
  Awt = 'awt',
  Awu = 'awu',
  Awv = 'awv',
  Aww = 'aww',
  Awx = 'awx',
  Awy = 'awy',
  Axb = 'axb',
  Axe = 'axe',
  Axg = 'axg',
  Axk = 'axk',
  Axl = 'axl',
  Axm = 'axm',
  Axx = 'axx',
  Aya = 'aya',
  Ayb = 'ayb',
  Ayc = 'ayc',
  Ayd = 'ayd',
  Aye = 'aye',
  Ayg = 'ayg',
  Ayh = 'ayh',
  Ayi = 'ayi',
  Ayk = 'ayk',
  Ayl = 'ayl',
  Aym = 'aym',
  Ayn = 'ayn',
  Ayo = 'ayo',
  Ayp = 'ayp',
  Ayq = 'ayq',
  Ayr = 'ayr',
  Ays = 'ays',
  Ayt = 'ayt',
  Ayu = 'ayu',
  Ayz = 'ayz',
  Aza = 'aza',
  Azb = 'azb',
  Azd = 'azd',
  Aze = 'aze',
  Azg = 'azg',
  Azj = 'azj',
  Azm = 'azm',
  Azn = 'azn',
  Azo = 'azo',
  Azt = 'azt',
  Azz = 'azz',
  Baa = 'baa',
  Bab = 'bab',
  Bac = 'bac',
  Bae = 'bae',
  Baf = 'baf',
  Bag = 'bag',
  Bah = 'bah',
  Baj = 'baj',
  Bak = 'bak',
  Bal = 'bal',
  Bam = 'bam',
  Ban = 'ban',
  Bao = 'bao',
  Bap = 'bap',
  Bar = 'bar',
  Bas = 'bas',
  Bau = 'bau',
  Bav = 'bav',
  Baw = 'baw',
  Bax = 'bax',
  Bay = 'bay',
  Bba = 'bba',
  Bbb = 'bbb',
  Bbc = 'bbc',
  Bbd = 'bbd',
  Bbe = 'bbe',
  Bbf = 'bbf',
  Bbg = 'bbg',
  Bbh = 'bbh',
  Bbi = 'bbi',
  Bbj = 'bbj',
  Bbk = 'bbk',
  Bbl = 'bbl',
  Bbm = 'bbm',
  Bbn = 'bbn',
  Bbo = 'bbo',
  Bbp = 'bbp',
  Bbq = 'bbq',
  Bbr = 'bbr',
  Bbs = 'bbs',
  Bbt = 'bbt',
  Bbu = 'bbu',
  Bbv = 'bbv',
  Bbw = 'bbw',
  Bbx = 'bbx',
  Bby = 'bby',
  Bca = 'bca',
  Bcb = 'bcb',
  Bcc = 'bcc',
  Bcd = 'bcd',
  Bce = 'bce',
  Bcf = 'bcf',
  Bcg = 'bcg',
  Bch = 'bch',
  Bci = 'bci',
  Bcj = 'bcj',
  Bck = 'bck',
  Bcl = 'bcl',
  Bcm = 'bcm',
  Bcn = 'bcn',
  Bco = 'bco',
  Bcp = 'bcp',
  Bcq = 'bcq',
  Bcr = 'bcr',
  Bcs = 'bcs',
  Bct = 'bct',
  Bcu = 'bcu',
  Bcv = 'bcv',
  Bcw = 'bcw',
  Bcy = 'bcy',
  Bcz = 'bcz',
  Bda = 'bda',
  Bdb = 'bdb',
  Bdc = 'bdc',
  Bdd = 'bdd',
  Bde = 'bde',
  Bdf = 'bdf',
  Bdg = 'bdg',
  Bdh = 'bdh',
  Bdi = 'bdi',
  Bdj = 'bdj',
  Bdk = 'bdk',
  Bdl = 'bdl',
  Bdm = 'bdm',
  Bdn = 'bdn',
  Bdo = 'bdo',
  Bdp = 'bdp',
  Bdq = 'bdq',
  Bdr = 'bdr',
  Bds = 'bds',
  Bdt = 'bdt',
  Bdu = 'bdu',
  Bdv = 'bdv',
  Bdw = 'bdw',
  Bdx = 'bdx',
  Bdy = 'bdy',
  Bdz = 'bdz',
  Bea = 'bea',
  Beb = 'beb',
  Bec = 'bec',
  Bed = 'bed',
  Bee = 'bee',
  Bef = 'bef',
  Beg = 'beg',
  Beh = 'beh',
  Bei = 'bei',
  Bej = 'bej',
  Bek = 'bek',
  Bel = 'bel',
  Bem = 'bem',
  Ben = 'ben',
  Beo = 'beo',
  Bep = 'bep',
  Beq = 'beq',
  Bes = 'bes',
  Bet = 'bet',
  Beu = 'beu',
  Bev = 'bev',
  Bew = 'bew',
  Bex = 'bex',
  Bey = 'bey',
  Bez = 'bez',
  Bfa = 'bfa',
  Bfb = 'bfb',
  Bfc = 'bfc',
  Bfd = 'bfd',
  Bfe = 'bfe',
  Bff = 'bff',
  Bfg = 'bfg',
  Bfh = 'bfh',
  Bfi = 'bfi',
  Bfj = 'bfj',
  Bfk = 'bfk',
  Bfl = 'bfl',
  Bfm = 'bfm',
  Bfn = 'bfn',
  Bfo = 'bfo',
  Bfp = 'bfp',
  Bfq = 'bfq',
  Bfr = 'bfr',
  Bfs = 'bfs',
  Bft = 'bft',
  Bfu = 'bfu',
  Bfw = 'bfw',
  Bfx = 'bfx',
  Bfy = 'bfy',
  Bfz = 'bfz',
  Bga = 'bga',
  Bgb = 'bgb',
  Bgc = 'bgc',
  Bgd = 'bgd',
  Bge = 'bge',
  Bgf = 'bgf',
  Bgg = 'bgg',
  Bgi = 'bgi',
  Bgj = 'bgj',
  Bgk = 'bgk',
  Bgl = 'bgl',
  Bgn = 'bgn',
  Bgo = 'bgo',
  Bgp = 'bgp',
  Bgq = 'bgq',
  Bgr = 'bgr',
  Bgs = 'bgs',
  Bgt = 'bgt',
  Bgu = 'bgu',
  Bgv = 'bgv',
  Bgw = 'bgw',
  Bgx = 'bgx',
  Bgy = 'bgy',
  Bgz = 'bgz',
  Bha = 'bha',
  Bhb = 'bhb',
  Bhc = 'bhc',
  Bhd = 'bhd',
  Bhe = 'bhe',
  Bhf = 'bhf',
  Bhg = 'bhg',
  Bhh = 'bhh',
  Bhi = 'bhi',
  Bhj = 'bhj',
  Bhl = 'bhl',
  Bhm = 'bhm',
  Bhn = 'bhn',
  Bho = 'bho',
  Bhp = 'bhp',
  Bhq = 'bhq',
  Bhr = 'bhr',
  Bhs = 'bhs',
  Bht = 'bht',
  Bhu = 'bhu',
  Bhv = 'bhv',
  Bhw = 'bhw',
  Bhx = 'bhx',
  Bhy = 'bhy',
  Bhz = 'bhz',
  Bia = 'bia',
  Bib = 'bib',
  Bic = 'bic',
  Bid = 'bid',
  Bie = 'bie',
  Bif = 'bif',
  Big = 'big',
  Bij = 'bij',
  Bik = 'bik',
  Bil = 'bil',
  Bim = 'bim',
  Bin = 'bin',
  Bio = 'bio',
  Bip = 'bip',
  Biq = 'biq',
  Bir = 'bir',
  Bis = 'bis',
  Bit = 'bit',
  Biu = 'biu',
  Biv = 'biv',
  Biw = 'biw',
  Bix = 'bix',
  Biy = 'biy',
  Biz = 'biz',
  Bja = 'bja',
  Bjb = 'bjb',
  Bjc = 'bjc',
  Bje = 'bje',
  Bjf = 'bjf',
  Bjg = 'bjg',
  Bjh = 'bjh',
  Bji = 'bji',
  Bjj = 'bjj',
  Bjk = 'bjk',
  Bjl = 'bjl',
  Bjm = 'bjm',
  Bjn = 'bjn',
  Bjo = 'bjo',
  Bjp = 'bjp',
  Bjr = 'bjr',
  Bjs = 'bjs',
  Bjt = 'bjt',
  Bju = 'bju',
  Bjv = 'bjv',
  Bjw = 'bjw',
  Bjx = 'bjx',
  Bjy = 'bjy',
  Bjz = 'bjz',
  Bka = 'bka',
  Bkc = 'bkc',
  Bkd = 'bkd',
  Bkf = 'bkf',
  Bkg = 'bkg',
  Bkh = 'bkh',
  Bki = 'bki',
  Bkj = 'bkj',
  Bkk = 'bkk',
  Bkl = 'bkl',
  Bkm = 'bkm',
  Bkn = 'bkn',
  Bko = 'bko',
  Bkp = 'bkp',
  Bkq = 'bkq',
  Bkr = 'bkr',
  Bks = 'bks',
  Bkt = 'bkt',
  Bku = 'bku',
  Bkv = 'bkv',
  Bkw = 'bkw',
  Bkx = 'bkx',
  Bky = 'bky',
  Bkz = 'bkz',
  Bla = 'bla',
  Blb = 'blb',
  Blc = 'blc',
  Bld = 'bld',
  Ble = 'ble',
  Blf = 'blf',
  Blg = 'blg',
  Blh = 'blh',
  Bli = 'bli',
  Blj = 'blj',
  Blk = 'blk',
  Bll = 'bll',
  Blm = 'blm',
  Bln = 'bln',
  Blo = 'blo',
  Blp = 'blp',
  Blq = 'blq',
  Blr = 'blr',
  Bls = 'bls',
  Blt = 'blt',
  Blv = 'blv',
  Blw = 'blw',
  Blx = 'blx',
  Bly = 'bly',
  Blz = 'blz',
  Bma = 'bma',
  Bmb = 'bmb',
  Bmc = 'bmc',
  Bmd = 'bmd',
  Bme = 'bme',
  Bmf = 'bmf',
  Bmg = 'bmg',
  Bmh = 'bmh',
  Bmi = 'bmi',
  Bmj = 'bmj',
  Bmk = 'bmk',
  Bml = 'bml',
  Bmm = 'bmm',
  Bmn = 'bmn',
  Bmo = 'bmo',
  Bmp = 'bmp',
  Bmq = 'bmq',
  Bmr = 'bmr',
  Bms = 'bms',
  Bmt = 'bmt',
  Bmu = 'bmu',
  Bmv = 'bmv',
  Bmw = 'bmw',
  Bmx = 'bmx',
  Bmz = 'bmz',
  Bna = 'bna',
  Bnb = 'bnb',
  Bnc = 'bnc',
  Bnd = 'bnd',
  Bne = 'bne',
  Bnf = 'bnf',
  Bng = 'bng',
  Bni = 'bni',
  Bnj = 'bnj',
  Bnk = 'bnk',
  Bnl = 'bnl',
  Bnm = 'bnm',
  Bnn = 'bnn',
  Bno = 'bno',
  Bnp = 'bnp',
  Bnq = 'bnq',
  Bnr = 'bnr',
  Bns = 'bns',
  Bnu = 'bnu',
  Bnv = 'bnv',
  Bnw = 'bnw',
  Bnx = 'bnx',
  Bny = 'bny',
  Bnz = 'bnz',
  Boa = 'boa',
  Bob = 'bob',
  Bod = 'bod',
  Boe = 'boe',
  Bof = 'bof',
  Bog = 'bog',
  Boh = 'boh',
  Boi = 'boi',
  Boj = 'boj',
  Bok = 'bok',
  Bol = 'bol',
  Bom = 'bom',
  Bon = 'bon',
  Boo = 'boo',
  Bop = 'bop',
  Boq = 'boq',
  Bor = 'bor',
  Bos = 'bos',
  Bot = 'bot',
  Bou = 'bou',
  Bov = 'bov',
  Bow = 'bow',
  Box = 'box',
  Boy = 'boy',
  Boz = 'boz',
  Bpa = 'bpa',
  Bpd = 'bpd',
  Bpg = 'bpg',
  Bph = 'bph',
  Bpi = 'bpi',
  Bpj = 'bpj',
  Bpk = 'bpk',
  Bpl = 'bpl',
  Bpm = 'bpm',
  Bpn = 'bpn',
  Bpo = 'bpo',
  Bpp = 'bpp',
  Bpq = 'bpq',
  Bpr = 'bpr',
  Bps = 'bps',
  Bpt = 'bpt',
  Bpu = 'bpu',
  Bpv = 'bpv',
  Bpw = 'bpw',
  Bpx = 'bpx',
  Bpy = 'bpy',
  Bpz = 'bpz',
  Bqa = 'bqa',
  Bqb = 'bqb',
  Bqc = 'bqc',
  Bqd = 'bqd',
  Bqf = 'bqf',
  Bqg = 'bqg',
  Bqh = 'bqh',
  Bqi = 'bqi',
  Bqj = 'bqj',
  Bqk = 'bqk',
  Bql = 'bql',
  Bqm = 'bqm',
  Bqn = 'bqn',
  Bqo = 'bqo',
  Bqp = 'bqp',
  Bqq = 'bqq',
  Bqr = 'bqr',
  Bqs = 'bqs',
  Bqt = 'bqt',
  Bqu = 'bqu',
  Bqv = 'bqv',
  Bqw = 'bqw',
  Bqx = 'bqx',
  Bqy = 'bqy',
  Bqz = 'bqz',
  Bra = 'bra',
  Brb = 'brb',
  Brc = 'brc',
  Brd = 'brd',
  Bre = 'bre',
  Brf = 'brf',
  Brg = 'brg',
  Brh = 'brh',
  Bri = 'bri',
  Brj = 'brj',
  Brk = 'brk',
  Brl = 'brl',
  Brm = 'brm',
  Brn = 'brn',
  Bro = 'bro',
  Brp = 'brp',
  Brq = 'brq',
  Brr = 'brr',
  Brs = 'brs',
  Brt = 'brt',
  Bru = 'bru',
  Brv = 'brv',
  Brw = 'brw',
  Brx = 'brx',
  Bry = 'bry',
  Brz = 'brz',
  Bsa = 'bsa',
  Bsb = 'bsb',
  Bsc = 'bsc',
  Bse = 'bse',
  Bsf = 'bsf',
  Bsg = 'bsg',
  Bsh = 'bsh',
  Bsi = 'bsi',
  Bsj = 'bsj',
  Bsk = 'bsk',
  Bsl = 'bsl',
  Bsm = 'bsm',
  Bsn = 'bsn',
  Bso = 'bso',
  Bsp = 'bsp',
  Bsq = 'bsq',
  Bsr = 'bsr',
  Bss = 'bss',
  Bst = 'bst',
  Bsu = 'bsu',
  Bsv = 'bsv',
  Bsw = 'bsw',
  Bsx = 'bsx',
  Bsy = 'bsy',
  Bta = 'bta',
  Btc = 'btc',
  Btd = 'btd',
  Bte = 'bte',
  Btf = 'btf',
  Btg = 'btg',
  Bth = 'bth',
  Bti = 'bti',
  Btj = 'btj',
  Btm = 'btm',
  Btn = 'btn',
  Bto = 'bto',
  Btp = 'btp',
  Btq = 'btq',
  Btr = 'btr',
  Bts = 'bts',
  Btt = 'btt',
  Btu = 'btu',
  Btv = 'btv',
  Btw = 'btw',
  Btx = 'btx',
  Bty = 'bty',
  Btz = 'btz',
  Bua = 'bua',
  Bub = 'bub',
  Buc = 'buc',
  Bud = 'bud',
  Bue = 'bue',
  Buf = 'buf',
  Bug = 'bug',
  Buh = 'buh',
  Bui = 'bui',
  Buj = 'buj',
  Buk = 'buk',
  Bul = 'bul',
  Bum = 'bum',
  Bun = 'bun',
  Buo = 'buo',
  Bup = 'bup',
  Buq = 'buq',
  Bus = 'bus',
  But = 'but',
  Buu = 'buu',
  Buv = 'buv',
  Buw = 'buw',
  Bux = 'bux',
  Buy = 'buy',
  Buz = 'buz',
  Bva = 'bva',
  Bvb = 'bvb',
  Bvc = 'bvc',
  Bvd = 'bvd',
  Bve = 'bve',
  Bvf = 'bvf',
  Bvg = 'bvg',
  Bvh = 'bvh',
  Bvi = 'bvi',
  Bvj = 'bvj',
  Bvk = 'bvk',
  Bvl = 'bvl',
  Bvm = 'bvm',
  Bvn = 'bvn',
  Bvo = 'bvo',
  Bvp = 'bvp',
  Bvq = 'bvq',
  Bvr = 'bvr',
  Bvt = 'bvt',
  Bvu = 'bvu',
  Bvv = 'bvv',
  Bvw = 'bvw',
  Bvx = 'bvx',
  Bvy = 'bvy',
  Bvz = 'bvz',
  Bwa = 'bwa',
  Bwb = 'bwb',
  Bwc = 'bwc',
  Bwd = 'bwd',
  Bwe = 'bwe',
  Bwf = 'bwf',
  Bwg = 'bwg',
  Bwh = 'bwh',
  Bwi = 'bwi',
  Bwj = 'bwj',
  Bwk = 'bwk',
  Bwl = 'bwl',
  Bwm = 'bwm',
  Bwn = 'bwn',
  Bwo = 'bwo',
  Bwp = 'bwp',
  Bwq = 'bwq',
  Bwr = 'bwr',
  Bws = 'bws',
  Bwt = 'bwt',
  Bwu = 'bwu',
  Bww = 'bww',
  Bwx = 'bwx',
  Bwy = 'bwy',
  Bwz = 'bwz',
  Bxa = 'bxa',
  Bxb = 'bxb',
  Bxc = 'bxc',
  Bxd = 'bxd',
  Bxe = 'bxe',
  Bxf = 'bxf',
  Bxg = 'bxg',
  Bxh = 'bxh',
  Bxi = 'bxi',
  Bxj = 'bxj',
  Bxk = 'bxk',
  Bxl = 'bxl',
  Bxm = 'bxm',
  Bxn = 'bxn',
  Bxo = 'bxo',
  Bxp = 'bxp',
  Bxq = 'bxq',
  Bxr = 'bxr',
  Bxs = 'bxs',
  Bxu = 'bxu',
  Bxv = 'bxv',
  Bxw = 'bxw',
  Bxz = 'bxz',
  Bya = 'bya',
  Byb = 'byb',
  Byc = 'byc',
  Byd = 'byd',
  Bye = 'bye',
  Byf = 'byf',
  Byg = 'byg',
  Byh = 'byh',
  Byi = 'byi',
  Byj = 'byj',
  Byk = 'byk',
  Byl = 'byl',
  Bym = 'bym',
  Byn = 'byn',
  Byo = 'byo',
  Byp = 'byp',
  Byq = 'byq',
  Byr = 'byr',
  Bys = 'bys',
  Byt = 'byt',
  Byv = 'byv',
  Byw = 'byw',
  Byx = 'byx',
  Byz = 'byz',
  Bza = 'bza',
  Bzb = 'bzb',
  Bzc = 'bzc',
  Bzd = 'bzd',
  Bze = 'bze',
  Bzf = 'bzf',
  Bzg = 'bzg',
  Bzh = 'bzh',
  Bzi = 'bzi',
  Bzj = 'bzj',
  Bzk = 'bzk',
  Bzl = 'bzl',
  Bzm = 'bzm',
  Bzn = 'bzn',
  Bzo = 'bzo',
  Bzp = 'bzp',
  Bzq = 'bzq',
  Bzr = 'bzr',
  Bzs = 'bzs',
  Bzt = 'bzt',
  Bzu = 'bzu',
  Bzv = 'bzv',
  Bzw = 'bzw',
  Bzx = 'bzx',
  Bzy = 'bzy',
  Bzz = 'bzz',
  Caa = 'caa',
  Cab = 'cab',
  Cac = 'cac',
  Cad = 'cad',
  Cae = 'cae',
  Caf = 'caf',
  Cag = 'cag',
  Cah = 'cah',
  Caj = 'caj',
  Cak = 'cak',
  Cal = 'cal',
  Cam = 'cam',
  Can = 'can',
  Cao = 'cao',
  Cap = 'cap',
  Caq = 'caq',
  Car = 'car',
  Cas = 'cas',
  Cat = 'cat',
  Cav = 'cav',
  Caw = 'caw',
  Cax = 'cax',
  Cay = 'cay',
  Caz = 'caz',
  Cbb = 'cbb',
  Cbc = 'cbc',
  Cbd = 'cbd',
  Cbg = 'cbg',
  Cbi = 'cbi',
  Cbj = 'cbj',
  Cbk = 'cbk',
  Cbl = 'cbl',
  Cbn = 'cbn',
  Cbo = 'cbo',
  Cbq = 'cbq',
  Cbr = 'cbr',
  Cbs = 'cbs',
  Cbt = 'cbt',
  Cbu = 'cbu',
  Cbv = 'cbv',
  Cbw = 'cbw',
  Cby = 'cby',
  Ccc = 'ccc',
  Ccd = 'ccd',
  Cce = 'cce',
  Ccg = 'ccg',
  Cch = 'cch',
  Ccj = 'ccj',
  Ccl = 'ccl',
  Ccm = 'ccm',
  Cco = 'cco',
  Ccp = 'ccp',
  Ccr = 'ccr',
  Cda = 'cda',
  Cde = 'cde',
  Cdf = 'cdf',
  Cdh = 'cdh',
  Cdi = 'cdi',
  Cdj = 'cdj',
  Cdm = 'cdm',
  Cdn = 'cdn',
  Cdo = 'cdo',
  Cdr = 'cdr',
  Cds = 'cds',
  Cdy = 'cdy',
  Cdz = 'cdz',
  Cea = 'cea',
  Ceb = 'ceb',
  Ceg = 'ceg',
  Cek = 'cek',
  Cen = 'cen',
  Ces = 'ces',
  Cet = 'cet',
  Cey = 'cey',
  Cfa = 'cfa',
  Cfd = 'cfd',
  Cfg = 'cfg',
  Cfm = 'cfm',
  Cga = 'cga',
  Cgc = 'cgc',
  Cgg = 'cgg',
  Cgk = 'cgk',
  Cha = 'cha',
  Chb = 'chb',
  Chc = 'chc',
  Chd = 'chd',
  Che = 'che',
  Chf = 'chf',
  Chg = 'chg',
  Chh = 'chh',
  Chj = 'chj',
  Chk = 'chk',
  Chl = 'chl',
  Chm = 'chm',
  Chn = 'chn',
  Cho = 'cho',
  Chp = 'chp',
  Chq = 'chq',
  Chr = 'chr',
  Cht = 'cht',
  Chu = 'chu',
  Chv = 'chv',
  Chw = 'chw',
  Chx = 'chx',
  Chy = 'chy',
  Chz = 'chz',
  Cia = 'cia',
  Cib = 'cib',
  Cic = 'cic',
  Cid = 'cid',
  Cie = 'cie',
  Cih = 'cih',
  Cik = 'cik',
  Cim = 'cim',
  Cin = 'cin',
  Cip = 'cip',
  Cir = 'cir',
  Ciw = 'ciw',
  Ciy = 'ciy',
  Cja = 'cja',
  Cje = 'cje',
  Cjh = 'cjh',
  Cji = 'cji',
  Cjk = 'cjk',
  Cjm = 'cjm',
  Cjn = 'cjn',
  Cjo = 'cjo',
  Cjp = 'cjp',
  Cjs = 'cjs',
  Cjv = 'cjv',
  Cjy = 'cjy',
  Ckb = 'ckb',
  Ckh = 'ckh',
  Ckl = 'ckl',
  Ckm = 'ckm',
  Ckn = 'ckn',
  Cko = 'cko',
  Ckq = 'ckq',
  Ckr = 'ckr',
  Cks = 'cks',
  Ckt = 'ckt',
  Cku = 'cku',
  Ckv = 'ckv',
  Ckx = 'ckx',
  Cky = 'cky',
  Ckz = 'ckz',
  Cla = 'cla',
  Clc = 'clc',
  Cld = 'cld',
  Cle = 'cle',
  Clh = 'clh',
  Cli = 'cli',
  Clj = 'clj',
  Clk = 'clk',
  Cll = 'cll',
  Clm = 'clm',
  Clo = 'clo',
  Clt = 'clt',
  Clu = 'clu',
  Clw = 'clw',
  Cly = 'cly',
  Cma = 'cma',
  Cme = 'cme',
  Cmg = 'cmg',
  Cmi = 'cmi',
  Cml = 'cml',
  Cmm = 'cmm',
  Cmn = 'cmn',
  Cmo = 'cmo',
  Cmr = 'cmr',
  Cms = 'cms',
  Cmt = 'cmt',
  Cna = 'cna',
  Cnb = 'cnb',
  Cnc = 'cnc',
  Cng = 'cng',
  Cnh = 'cnh',
  Cni = 'cni',
  Cnk = 'cnk',
  Cnl = 'cnl',
  Cno = 'cno',
  Cnp = 'cnp',
  Cnr = 'cnr',
  Cns = 'cns',
  Cnt = 'cnt',
  Cnu = 'cnu',
  Cnw = 'cnw',
  Cnx = 'cnx',
  Coa = 'coa',
  Cob = 'cob',
  Coc = 'coc',
  Cod = 'cod',
  Coe = 'coe',
  Cof = 'cof',
  Cog = 'cog',
  Coh = 'coh',
  Coj = 'coj',
  Cok = 'cok',
  Col = 'col',
  Com = 'com',
  Con = 'con',
  Coo = 'coo',
  Cop = 'cop',
  Coq = 'coq',
  Cor = 'cor',
  Cos = 'cos',
  Cot = 'cot',
  Cou = 'cou',
  Cov = 'cov',
  Cow = 'cow',
  Cox = 'cox',
  Coz = 'coz',
  Cpa = 'cpa',
  Cpb = 'cpb',
  Cpc = 'cpc',
  Cpg = 'cpg',
  Cpi = 'cpi',
  Cpn = 'cpn',
  Cpo = 'cpo',
  Cps = 'cps',
  Cpu = 'cpu',
  Cpx = 'cpx',
  Cpy = 'cpy',
  Cqd = 'cqd',
  Cra = 'cra',
  Crb = 'crb',
  Crc = 'crc',
  Crd = 'crd',
  Cre = 'cre',
  Crf = 'crf',
  Crg = 'crg',
  Crh = 'crh',
  Cri = 'cri',
  Crj = 'crj',
  Crk = 'crk',
  Crl = 'crl',
  Crm = 'crm',
  Crn = 'crn',
  Cro = 'cro',
  Crq = 'crq',
  Crr = 'crr',
  Crs = 'crs',
  Crt = 'crt',
  Crv = 'crv',
  Crw = 'crw',
  Crx = 'crx',
  Cry = 'cry',
  Crz = 'crz',
  Csa = 'csa',
  Csb = 'csb',
  Csc = 'csc',
  Csd = 'csd',
  Cse = 'cse',
  Csf = 'csf',
  Csg = 'csg',
  Csh = 'csh',
  Csi = 'csi',
  Csj = 'csj',
  Csk = 'csk',
  Csl = 'csl',
  Csm = 'csm',
  Csn = 'csn',
  Cso = 'cso',
  Csp = 'csp',
  Csq = 'csq',
  Csr = 'csr',
  Css = 'css',
  Cst = 'cst',
  Csv = 'csv',
  Csw = 'csw',
  Csy = 'csy',
  Csz = 'csz',
  Cta = 'cta',
  Ctc = 'ctc',
  Ctd = 'ctd',
  Cte = 'cte',
  Ctg = 'ctg',
  Cth = 'cth',
  Ctl = 'ctl',
  Ctm = 'ctm',
  Ctn = 'ctn',
  Cto = 'cto',
  Ctp = 'ctp',
  Cts = 'cts',
  Ctt = 'ctt',
  Ctu = 'ctu',
  Ctz = 'ctz',
  Cua = 'cua',
  Cub = 'cub',
  Cuc = 'cuc',
  Cug = 'cug',
  Cuh = 'cuh',
  Cui = 'cui',
  Cuj = 'cuj',
  Cuk = 'cuk',
  Cul = 'cul',
  Cuo = 'cuo',
  Cup = 'cup',
  Cuq = 'cuq',
  Cur = 'cur',
  Cut = 'cut',
  Cuu = 'cuu',
  Cuv = 'cuv',
  Cuw = 'cuw',
  Cux = 'cux',
  Cuy = 'cuy',
  Cvg = 'cvg',
  Cvn = 'cvn',
  Cwa = 'cwa',
  Cwb = 'cwb',
  Cwd = 'cwd',
  Cwe = 'cwe',
  Cwg = 'cwg',
  Cwt = 'cwt',
  Cya = 'cya',
  Cyb = 'cyb',
  Cym = 'cym',
  Cyo = 'cyo',
  Czh = 'czh',
  Czk = 'czk',
  Czn = 'czn',
  Czo = 'czo',
  Czt = 'czt',
  Daa = 'daa',
  Dac = 'dac',
  Dad = 'dad',
  Dae = 'dae',
  Dag = 'dag',
  Dah = 'dah',
  Dai = 'dai',
  Daj = 'daj',
  Dak = 'dak',
  Dal = 'dal',
  Dam = 'dam',
  Dan = 'dan',
  Dao = 'dao',
  Daq = 'daq',
  Dar = 'dar',
  Das = 'das',
  Dau = 'dau',
  Dav = 'dav',
  Daw = 'daw',
  Dax = 'dax',
  Daz = 'daz',
  Dba = 'dba',
  Dbb = 'dbb',
  Dbd = 'dbd',
  Dbe = 'dbe',
  Dbf = 'dbf',
  Dbg = 'dbg',
  Dbi = 'dbi',
  Dbj = 'dbj',
  Dbl = 'dbl',
  Dbm = 'dbm',
  Dbn = 'dbn',
  Dbo = 'dbo',
  Dbp = 'dbp',
  Dbq = 'dbq',
  Dbr = 'dbr',
  Dbt = 'dbt',
  Dbu = 'dbu',
  Dbv = 'dbv',
  Dbw = 'dbw',
  Dby = 'dby',
  Dcc = 'dcc',
  Dcr = 'dcr',
  Dda = 'dda',
  Ddd = 'ddd',
  Dde = 'dde',
  Ddg = 'ddg',
  Ddi = 'ddi',
  Ddj = 'ddj',
  Ddn = 'ddn',
  Ddo = 'ddo',
  Ddr = 'ddr',
  Dds = 'dds',
  Ddw = 'ddw',
  Dec = 'dec',
  Ded = 'ded',
  Dee = 'dee',
  Def = 'def',
  Deg = 'deg',
  Deh = 'deh',
  Dei = 'dei',
  Dek = 'dek',
  Del = 'del',
  Dem = 'dem',
  Den = 'den',
  Dep = 'dep',
  Deq = 'deq',
  Der = 'der',
  Des = 'des',
  Deu = 'deu',
  Dev = 'dev',
  Dez = 'dez',
  Dga = 'dga',
  Dgb = 'dgb',
  Dgc = 'dgc',
  Dgd = 'dgd',
  Dge = 'dge',
  Dgg = 'dgg',
  Dgh = 'dgh',
  Dgi = 'dgi',
  Dgk = 'dgk',
  Dgl = 'dgl',
  Dgn = 'dgn',
  Dgo = 'dgo',
  Dgr = 'dgr',
  Dgs = 'dgs',
  Dgt = 'dgt',
  Dgw = 'dgw',
  Dgx = 'dgx',
  Dgz = 'dgz',
  Dhd = 'dhd',
  Dhg = 'dhg',
  Dhi = 'dhi',
  Dhl = 'dhl',
  Dhm = 'dhm',
  Dhn = 'dhn',
  Dho = 'dho',
  Dhr = 'dhr',
  Dhs = 'dhs',
  Dhu = 'dhu',
  Dhv = 'dhv',
  Dhw = 'dhw',
  Dhx = 'dhx',
  Dia = 'dia',
  Dib = 'dib',
  Dic = 'dic',
  Did = 'did',
  Dif = 'dif',
  Dig = 'dig',
  Dih = 'dih',
  Dii = 'dii',
  Dij = 'dij',
  Dik = 'dik',
  Dil = 'dil',
  Dim = 'dim',
  Din = 'din',
  Dio = 'dio',
  Dip = 'dip',
  Diq = 'diq',
  Dir = 'dir',
  Dis = 'dis',
  Diu = 'diu',
  Div = 'div',
  Diw = 'diw',
  Dix = 'dix',
  Diy = 'diy',
  Diz = 'diz',
  Dja = 'dja',
  Djb = 'djb',
  Djc = 'djc',
  Djd = 'djd',
  Dje = 'dje',
  Djf = 'djf',
  Dji = 'dji',
  Djj = 'djj',
  Djk = 'djk',
  Djm = 'djm',
  Djn = 'djn',
  Djo = 'djo',
  Djr = 'djr',
  Dju = 'dju',
  Djw = 'djw',
  Dka = 'dka',
  Dkk = 'dkk',
  Dkr = 'dkr',
  Dks = 'dks',
  Dkx = 'dkx',
  Dlg = 'dlg',
  Dlk = 'dlk',
  Dlm = 'dlm',
  Dln = 'dln',
  Dma = 'dma',
  Dmb = 'dmb',
  Dmc = 'dmc',
  Dmd = 'dmd',
  Dme = 'dme',
  Dmf = 'dmf',
  Dmg = 'dmg',
  Dmk = 'dmk',
  Dml = 'dml',
  Dmm = 'dmm',
  Dmo = 'dmo',
  Dmr = 'dmr',
  Dms = 'dms',
  Dmu = 'dmu',
  Dmv = 'dmv',
  Dmw = 'dmw',
  Dmx = 'dmx',
  Dmy = 'dmy',
  Dna = 'dna',
  Dnd = 'dnd',
  Dne = 'dne',
  Dng = 'dng',
  Dni = 'dni',
  Dnj = 'dnj',
  Dnk = 'dnk',
  Dnn = 'dnn',
  Dno = 'dno',
  Dnr = 'dnr',
  Dnt = 'dnt',
  Dnu = 'dnu',
  Dnv = 'dnv',
  Dnw = 'dnw',
  Dny = 'dny',
  Doa = 'doa',
  Dob = 'dob',
  Doc = 'doc',
  Doe = 'doe',
  Dof = 'dof',
  Doh = 'doh',
  Doi = 'doi',
  Dok = 'dok',
  Dol = 'dol',
  Don = 'don',
  Doo = 'doo',
  Dop = 'dop',
  Doq = 'doq',
  Dor = 'dor',
  Dos = 'dos',
  Dot = 'dot',
  Dov = 'dov',
  Dow = 'dow',
  Dox = 'dox',
  Doy = 'doy',
  Doz = 'doz',
  Dpp = 'dpp',
  Drb = 'drb',
  Drc = 'drc',
  Drd = 'drd',
  Dre = 'dre',
  Drg = 'drg',
  Dri = 'dri',
  Drl = 'drl',
  Drn = 'drn',
  Dro = 'dro',
  Drq = 'drq',
  Drs = 'drs',
  Drt = 'drt',
  Dru = 'dru',
  Dry = 'dry',
  Dsb = 'dsb',
  Dse = 'dse',
  Dsh = 'dsh',
  Dsi = 'dsi',
  Dsl = 'dsl',
  Dsn = 'dsn',
  Dso = 'dso',
  Dsq = 'dsq',
  Dta = 'dta',
  Dtb = 'dtb',
  Dtd = 'dtd',
  Dth = 'dth',
  Dti = 'dti',
  Dtk = 'dtk',
  Dtm = 'dtm',
  Dtn = 'dtn',
  Dto = 'dto',
  Dtp = 'dtp',
  Dtr = 'dtr',
  Dts = 'dts',
  Dtt = 'dtt',
  Dtu = 'dtu',
  Dty = 'dty',
  Dua = 'dua',
  Dub = 'dub',
  Duc = 'duc',
  Due = 'due',
  Duf = 'duf',
  Dug = 'dug',
  Duh = 'duh',
  Dui = 'dui',
  Duk = 'duk',
  Dul = 'dul',
  Dum = 'dum',
  Dun = 'dun',
  Duo = 'duo',
  Dup = 'dup',
  Duq = 'duq',
  Dur = 'dur',
  Dus = 'dus',
  Duu = 'duu',
  Duv = 'duv',
  Duw = 'duw',
  Dux = 'dux',
  Duy = 'duy',
  Duz = 'duz',
  Dva = 'dva',
  Dwa = 'dwa',
  Dwk = 'dwk',
  Dwr = 'dwr',
  Dws = 'dws',
  Dwu = 'dwu',
  Dww = 'dww',
  Dwy = 'dwy',
  Dwz = 'dwz',
  Dya = 'dya',
  Dyb = 'dyb',
  Dyd = 'dyd',
  Dyg = 'dyg',
  Dyi = 'dyi',
  Dym = 'dym',
  Dyn = 'dyn',
  Dyo = 'dyo',
  Dyu = 'dyu',
  Dyy = 'dyy',
  Dza = 'dza',
  Dze = 'dze',
  Dzg = 'dzg',
  Dzl = 'dzl',
  Dzn = 'dzn',
  Dzo = 'dzo',
  Eaa = 'eaa',
  Ebc = 'ebc',
  Ebg = 'ebg',
  Ebk = 'ebk',
  Ebo = 'ebo',
  Ebr = 'ebr',
  Ebu = 'ebu',
  Ecr = 'ecr',
  Ecs = 'ecs',
  Ecy = 'ecy',
  Eee = 'eee',
  Efa = 'efa',
  Efe = 'efe',
  Efi = 'efi',
  Ega = 'ega',
  Egl = 'egl',
  Ego = 'ego',
  Egy = 'egy',
  Ehu = 'ehu',
  Eip = 'eip',
  Eit = 'eit',
  Eiv = 'eiv',
  Eja = 'eja',
  Eka = 'eka',
  Eke = 'eke',
  Ekg = 'ekg',
  Eki = 'eki',
  Ekk = 'ekk',
  Ekl = 'ekl',
  Ekm = 'ekm',
  Eko = 'eko',
  Ekp = 'ekp',
  Ekr = 'ekr',
  Eky = 'eky',
  Ele = 'ele',
  Elh = 'elh',
  Eli = 'eli',
  Elk = 'elk',
  Ell = 'ell',
  Elm = 'elm',
  Elo = 'elo',
  Elu = 'elu',
  Elx = 'elx',
  Ema = 'ema',
  Emb = 'emb',
  Eme = 'eme',
  Emg = 'emg',
  Emi = 'emi',
  Emk = 'emk',
  Emm = 'emm',
  Emn = 'emn',
  Emp = 'emp',
  Ems = 'ems',
  Emu = 'emu',
  Emw = 'emw',
  Emx = 'emx',
  Emy = 'emy',
  Ena = 'ena',
  Enb = 'enb',
  Enc = 'enc',
  End = 'end',
  Enf = 'enf',
  Eng = 'eng',
  Enh = 'enh',
  Enl = 'enl',
  Enm = 'enm',
  Enn = 'enn',
  Eno = 'eno',
  Enq = 'enq',
  Enr = 'enr',
  Enu = 'enu',
  Env = 'env',
  Enw = 'enw',
  Enx = 'enx',
  Eot = 'eot',
  Epi = 'epi',
  Epo = 'epo',
  Era = 'era',
  Erg = 'erg',
  Erh = 'erh',
  Eri = 'eri',
  Erk = 'erk',
  Ero = 'ero',
  Err = 'err',
  Ers = 'ers',
  Ert = 'ert',
  Erw = 'erw',
  Ese = 'ese',
  Esg = 'esg',
  Esh = 'esh',
  Esi = 'esi',
  Esk = 'esk',
  Esl = 'esl',
  Esm = 'esm',
  Esn = 'esn',
  Eso = 'eso',
  Esq = 'esq',
  Ess = 'ess',
  Est = 'est',
  Esu = 'esu',
  Esy = 'esy',
  Etb = 'etb',
  Etc = 'etc',
  Eth = 'eth',
  Etn = 'etn',
  Eto = 'eto',
  Etr = 'etr',
  Ets = 'ets',
  Ett = 'ett',
  Etu = 'etu',
  Etx = 'etx',
  Etz = 'etz',
  Eus = 'eus',
  Eve = 'eve',
  Evh = 'evh',
  Evn = 'evn',
  Ewe = 'ewe',
  Ewo = 'ewo',
  Ext = 'ext',
  Eya = 'eya',
  Eyo = 'eyo',
  Eza = 'eza',
  Eze = 'eze',
  Faa = 'faa',
  Fab = 'fab',
  Fad = 'fad',
  Faf = 'faf',
  Fag = 'fag',
  Fah = 'fah',
  Fai = 'fai',
  Faj = 'faj',
  Fak = 'fak',
  Fal = 'fal',
  Fam = 'fam',
  Fan = 'fan',
  Fao = 'fao',
  Fap = 'fap',
  Far = 'far',
  Fas = 'fas',
  Fat = 'fat',
  Fau = 'fau',
  Fax = 'fax',
  Fay = 'fay',
  Faz = 'faz',
  Fbl = 'fbl',
  Fcs = 'fcs',
  Fer = 'fer',
  Ffi = 'ffi',
  Ffm = 'ffm',
  Fgr = 'fgr',
  Fia = 'fia',
  Fie = 'fie',
  Fif = 'fif',
  Fij = 'fij',
  Fil = 'fil',
  Fin = 'fin',
  Fip = 'fip',
  Fir = 'fir',
  Fit = 'fit',
  Fiw = 'fiw',
  Fkk = 'fkk',
  Fkv = 'fkv',
  Fla = 'fla',
  Flh = 'flh',
  Fli = 'fli',
  Fll = 'fll',
  Fln = 'fln',
  Flr = 'flr',
  Fly = 'fly',
  Fmp = 'fmp',
  Fmu = 'fmu',
  Fnb = 'fnb',
  Fng = 'fng',
  Fni = 'fni',
  Fod = 'fod',
  Foi = 'foi',
  Fom = 'fom',
  Fon = 'fon',
  For = 'for',
  Fos = 'fos',
  Fpe = 'fpe',
  Fqs = 'fqs',
  Fra = 'fra',
  Frc = 'frc',
  Frd = 'frd',
  Frk = 'frk',
  Frm = 'frm',
  Fro = 'fro',
  Frp = 'frp',
  Frq = 'frq',
  Frr = 'frr',
  Frs = 'frs',
  Frt = 'frt',
  Fry = 'fry',
  Fse = 'fse',
  Fsl = 'fsl',
  Fss = 'fss',
  Fub = 'fub',
  Fuc = 'fuc',
  Fud = 'fud',
  Fue = 'fue',
  Fuf = 'fuf',
  Fuh = 'fuh',
  Fui = 'fui',
  Fuj = 'fuj',
  Ful = 'ful',
  Fum = 'fum',
  Fun = 'fun',
  Fuq = 'fuq',
  Fur = 'fur',
  Fut = 'fut',
  Fuu = 'fuu',
  Fuv = 'fuv',
  Fuy = 'fuy',
  Fvr = 'fvr',
  Fwa = 'fwa',
  Fwe = 'fwe',
  Gaa = 'gaa',
  Gab = 'gab',
  Gac = 'gac',
  Gad = 'gad',
  Gae = 'gae',
  Gaf = 'gaf',
  Gag = 'gag',
  Gah = 'gah',
  Gai = 'gai',
  Gaj = 'gaj',
  Gak = 'gak',
  Gal = 'gal',
  Gam = 'gam',
  Gan = 'gan',
  Gao = 'gao',
  Gap = 'gap',
  Gaq = 'gaq',
  Gar = 'gar',
  Gas = 'gas',
  Gat = 'gat',
  Gau = 'gau',
  Gaw = 'gaw',
  Gax = 'gax',
  Gay = 'gay',
  Gaz = 'gaz',
  Gba = 'gba',
  Gbb = 'gbb',
  Gbd = 'gbd',
  Gbe = 'gbe',
  Gbf = 'gbf',
  Gbg = 'gbg',
  Gbh = 'gbh',
  Gbi = 'gbi',
  Gbj = 'gbj',
  Gbk = 'gbk',
  Gbl = 'gbl',
  Gbm = 'gbm',
  Gbn = 'gbn',
  Gbo = 'gbo',
  Gbp = 'gbp',
  Gbq = 'gbq',
  Gbr = 'gbr',
  Gbs = 'gbs',
  Gbu = 'gbu',
  Gbv = 'gbv',
  Gbw = 'gbw',
  Gbx = 'gbx',
  Gby = 'gby',
  Gbz = 'gbz',
  Gcc = 'gcc',
  Gcd = 'gcd',
  Gce = 'gce',
  Gcf = 'gcf',
  Gcl = 'gcl',
  Gcn = 'gcn',
  Gcr = 'gcr',
  Gct = 'gct',
  Gda = 'gda',
  Gdb = 'gdb',
  Gdc = 'gdc',
  Gdd = 'gdd',
  Gde = 'gde',
  Gdf = 'gdf',
  Gdg = 'gdg',
  Gdh = 'gdh',
  Gdi = 'gdi',
  Gdj = 'gdj',
  Gdk = 'gdk',
  Gdl = 'gdl',
  Gdm = 'gdm',
  Gdn = 'gdn',
  Gdo = 'gdo',
  Gdq = 'gdq',
  Gdr = 'gdr',
  Gds = 'gds',
  Gdt = 'gdt',
  Gdu = 'gdu',
  Gdx = 'gdx',
  Gea = 'gea',
  Geb = 'geb',
  Gec = 'gec',
  Ged = 'ged',
  Gef = 'gef',
  Geg = 'geg',
  Geh = 'geh',
  Gei = 'gei',
  Gej = 'gej',
  Gek = 'gek',
  Gel = 'gel',
  Geq = 'geq',
  Ges = 'ges',
  Gev = 'gev',
  Gew = 'gew',
  Gex = 'gex',
  Gey = 'gey',
  Gez = 'gez',
  Gfk = 'gfk',
  Gft = 'gft',
  Gga = 'gga',
  Ggb = 'ggb',
  Ggd = 'ggd',
  Gge = 'gge',
  Ggg = 'ggg',
  Ggk = 'ggk',
  Ggl = 'ggl',
  Ggt = 'ggt',
  Ggu = 'ggu',
  Ggw = 'ggw',
  Gha = 'gha',
  Ghc = 'ghc',
  Ghe = 'ghe',
  Ghh = 'ghh',
  Ghk = 'ghk',
  Ghl = 'ghl',
  Ghn = 'ghn',
  Gho = 'gho',
  Ghr = 'ghr',
  Ghs = 'ghs',
  Ght = 'ght',
  Gia = 'gia',
  Gib = 'gib',
  Gic = 'gic',
  Gid = 'gid',
  Gie = 'gie',
  Gig = 'gig',
  Gih = 'gih',
  Gil = 'gil',
  Gim = 'gim',
  Gin = 'gin',
  Gip = 'gip',
  Giq = 'giq',
  Gir = 'gir',
  Gis = 'gis',
  Git = 'git',
  Giu = 'giu',
  Giw = 'giw',
  Gix = 'gix',
  Giy = 'giy',
  Giz = 'giz',
  Gji = 'gji',
  Gjk = 'gjk',
  Gjm = 'gjm',
  Gjn = 'gjn',
  Gjr = 'gjr',
  Gju = 'gju',
  Gka = 'gka',
  Gkd = 'gkd',
  Gke = 'gke',
  Gkn = 'gkn',
  Gko = 'gko',
  Gkp = 'gkp',
  Gku = 'gku',
  Gla = 'gla',
  Glc = 'glc',
  Gld = 'gld',
  Gle = 'gle',
  Glg = 'glg',
  Glh = 'glh',
  Glj = 'glj',
  Glk = 'glk',
  Gll = 'gll',
  Glo = 'glo',
  Glr = 'glr',
  Glu = 'glu',
  Glv = 'glv',
  Glw = 'glw',
  Gly = 'gly',
  Gma = 'gma',
  Gmb = 'gmb',
  Gmd = 'gmd',
  Gmg = 'gmg',
  Gmh = 'gmh',
  Gml = 'gml',
  Gmm = 'gmm',
  Gmn = 'gmn',
  Gmr = 'gmr',
  Gmu = 'gmu',
  Gmv = 'gmv',
  Gmx = 'gmx',
  Gmy = 'gmy',
  Gmz = 'gmz',
  Gna = 'gna',
  Gnb = 'gnb',
  Gnc = 'gnc',
  Gnd = 'gnd',
  Gne = 'gne',
  Gng = 'gng',
  Gnh = 'gnh',
  Gni = 'gni',
  Gnj = 'gnj',
  Gnk = 'gnk',
  Gnl = 'gnl',
  Gnm = 'gnm',
  Gnn = 'gnn',
  Gno = 'gno',
  Gnq = 'gnq',
  Gnr = 'gnr',
  Gnt = 'gnt',
  Gnu = 'gnu',
  Gnw = 'gnw',
  Gnz = 'gnz',
  Goa = 'goa',
  Gob = 'gob',
  Goc = 'goc',
  God = 'god',
  Goe = 'goe',
  Gof = 'gof',
  Gog = 'gog',
  Goh = 'goh',
  Goi = 'goi',
  Goj = 'goj',
  Gok = 'gok',
  Gol = 'gol',
  Gom = 'gom',
  Gon = 'gon',
  Goo = 'goo',
  Gop = 'gop',
  Goq = 'goq',
  Gor = 'gor',
  Gos = 'gos',
  Got = 'got',
  Gou = 'gou',
  Gow = 'gow',
  Gox = 'gox',
  Goy = 'goy',
  Goz = 'goz',
  Gpa = 'gpa',
  Gpe = 'gpe',
  Gpn = 'gpn',
  Gqa = 'gqa',
  Gqi = 'gqi',
  Gqn = 'gqn',
  Gqr = 'gqr',
  Gqu = 'gqu',
  Gra = 'gra',
  Grb = 'grb',
  Grc = 'grc',
  Grd = 'grd',
  Grg = 'grg',
  Grh = 'grh',
  Gri = 'gri',
  Grj = 'grj',
  Grm = 'grm',
  Grn = 'grn',
  Gro = 'gro',
  Grq = 'grq',
  Grr = 'grr',
  Grs = 'grs',
  Grt = 'grt',
  Gru = 'gru',
  Grv = 'grv',
  Grw = 'grw',
  Grx = 'grx',
  Gry = 'gry',
  Grz = 'grz',
  Gse = 'gse',
  Gsg = 'gsg',
  Gsl = 'gsl',
  Gsm = 'gsm',
  Gsn = 'gsn',
  Gso = 'gso',
  Gsp = 'gsp',
  Gss = 'gss',
  Gsw = 'gsw',
  Gta = 'gta',
  Gtu = 'gtu',
  Gua = 'gua',
  Gub = 'gub',
  Guc = 'guc',
  Gud = 'gud',
  Gue = 'gue',
  Guf = 'guf',
  Gug = 'gug',
  Guh = 'guh',
  Gui = 'gui',
  Guj = 'guj',
  Guk = 'guk',
  Gul = 'gul',
  Gum = 'gum',
  Gun = 'gun',
  Guo = 'guo',
  Gup = 'gup',
  Guq = 'guq',
  Gur = 'gur',
  Gus = 'gus',
  Gut = 'gut',
  Guu = 'guu',
  Guw = 'guw',
  Gux = 'gux',
  Guz = 'guz',
  Gva = 'gva',
  Gvc = 'gvc',
  Gve = 'gve',
  Gvf = 'gvf',
  Gvj = 'gvj',
  Gvl = 'gvl',
  Gvm = 'gvm',
  Gvn = 'gvn',
  Gvo = 'gvo',
  Gvp = 'gvp',
  Gvr = 'gvr',
  Gvs = 'gvs',
  Gvy = 'gvy',
  Gwa = 'gwa',
  Gwb = 'gwb',
  Gwc = 'gwc',
  Gwd = 'gwd',
  Gwe = 'gwe',
  Gwf = 'gwf',
  Gwg = 'gwg',
  Gwi = 'gwi',
  Gwj = 'gwj',
  Gwm = 'gwm',
  Gwn = 'gwn',
  Gwr = 'gwr',
  Gwt = 'gwt',
  Gwu = 'gwu',
  Gww = 'gww',
  Gwx = 'gwx',
  Gxx = 'gxx',
  Gya = 'gya',
  Gyb = 'gyb',
  Gyd = 'gyd',
  Gye = 'gye',
  Gyf = 'gyf',
  Gyg = 'gyg',
  Gyi = 'gyi',
  Gyl = 'gyl',
  Gym = 'gym',
  Gyn = 'gyn',
  Gyo = 'gyo',
  Gyr = 'gyr',
  Gyy = 'gyy',
  Gza = 'gza',
  Gzi = 'gzi',
  Gzn = 'gzn',
  Haa = 'haa',
  Hab = 'hab',
  Hac = 'hac',
  Had = 'had',
  Hae = 'hae',
  Haf = 'haf',
  Hag = 'hag',
  Hah = 'hah',
  Hai = 'hai',
  Haj = 'haj',
  Hak = 'hak',
  Hal = 'hal',
  Ham = 'ham',
  Han = 'han',
  Hao = 'hao',
  Hap = 'hap',
  Haq = 'haq',
  Har = 'har',
  Has = 'has',
  Hat = 'hat',
  Hau = 'hau',
  Hav = 'hav',
  Haw = 'haw',
  Hax = 'hax',
  Hay = 'hay',
  Haz = 'haz',
  Hba = 'hba',
  Hbb = 'hbb',
  Hbn = 'hbn',
  Hbo = 'hbo',
  Hbs = 'hbs',
  Hbu = 'hbu',
  Hca = 'hca',
  Hch = 'hch',
  Hdn = 'hdn',
  Hds = 'hds',
  Hdy = 'hdy',
  Hea = 'hea',
  Heb = 'heb',
  Hed = 'hed',
  Heg = 'heg',
  Heh = 'heh',
  Hei = 'hei',
  Hem = 'hem',
  Her = 'her',
  Hgm = 'hgm',
  Hgw = 'hgw',
  Hhi = 'hhi',
  Hhr = 'hhr',
  Hhy = 'hhy',
  Hia = 'hia',
  Hib = 'hib',
  Hid = 'hid',
  Hif = 'hif',
  Hig = 'hig',
  Hih = 'hih',
  Hii = 'hii',
  Hij = 'hij',
  Hik = 'hik',
  Hil = 'hil',
  Hin = 'hin',
  Hio = 'hio',
  Hir = 'hir',
  Hit = 'hit',
  Hiw = 'hiw',
  Hix = 'hix',
  Hji = 'hji',
  Hka = 'hka',
  Hke = 'hke',
  Hkk = 'hkk',
  Hkn = 'hkn',
  Hks = 'hks',
  Hla = 'hla',
  Hlb = 'hlb',
  Hld = 'hld',
  Hle = 'hle',
  Hlt = 'hlt',
  Hlu = 'hlu',
  Hma = 'hma',
  Hmb = 'hmb',
  Hmc = 'hmc',
  Hmd = 'hmd',
  Hme = 'hme',
  Hmf = 'hmf',
  Hmg = 'hmg',
  Hmh = 'hmh',
  Hmi = 'hmi',
  Hmj = 'hmj',
  Hmk = 'hmk',
  Hml = 'hml',
  Hmm = 'hmm',
  Hmn = 'hmn',
  Hmo = 'hmo',
  Hmp = 'hmp',
  Hmq = 'hmq',
  Hmr = 'hmr',
  Hms = 'hms',
  Hmt = 'hmt',
  Hmu = 'hmu',
  Hmv = 'hmv',
  Hmw = 'hmw',
  Hmy = 'hmy',
  Hmz = 'hmz',
  Hna = 'hna',
  Hnd = 'hnd',
  Hne = 'hne',
  Hng = 'hng',
  Hnh = 'hnh',
  Hni = 'hni',
  Hnj = 'hnj',
  Hnn = 'hnn',
  Hno = 'hno',
  Hns = 'hns',
  Hnu = 'hnu',
  Hoa = 'hoa',
  Hob = 'hob',
  Hoc = 'hoc',
  Hod = 'hod',
  Hoe = 'hoe',
  Hoh = 'hoh',
  Hoi = 'hoi',
  Hoj = 'hoj',
  Hol = 'hol',
  Hom = 'hom',
  Hoo = 'hoo',
  Hop = 'hop',
  Hor = 'hor',
  Hos = 'hos',
  Hot = 'hot',
  Hov = 'hov',
  How = 'how',
  Hoy = 'hoy',
  Hoz = 'hoz',
  Hpo = 'hpo',
  Hps = 'hps',
  Hra = 'hra',
  Hrc = 'hrc',
  Hre = 'hre',
  Hrk = 'hrk',
  Hrm = 'hrm',
  Hro = 'hro',
  Hrp = 'hrp',
  Hrt = 'hrt',
  Hru = 'hru',
  Hrv = 'hrv',
  Hrw = 'hrw',
  Hrx = 'hrx',
  Hrz = 'hrz',
  Hsb = 'hsb',
  Hsh = 'hsh',
  Hsl = 'hsl',
  Hsn = 'hsn',
  Hss = 'hss',
  Hti = 'hti',
  Hto = 'hto',
  Hts = 'hts',
  Htu = 'htu',
  Htx = 'htx',
  Hub = 'hub',
  Huc = 'huc',
  Hud = 'hud',
  Hue = 'hue',
  Huf = 'huf',
  Hug = 'hug',
  Huh = 'huh',
  Hui = 'hui',
  Huj = 'huj',
  Huk = 'huk',
  Hul = 'hul',
  Hum = 'hum',
  Hun = 'hun',
  Huo = 'huo',
  Hup = 'hup',
  Huq = 'huq',
  Hur = 'hur',
  Hus = 'hus',
  Hut = 'hut',
  Huu = 'huu',
  Huv = 'huv',
  Huw = 'huw',
  Hux = 'hux',
  Huy = 'huy',
  Huz = 'huz',
  Hvc = 'hvc',
  Hve = 'hve',
  Hvk = 'hvk',
  Hvn = 'hvn',
  Hvv = 'hvv',
  Hwa = 'hwa',
  Hwc = 'hwc',
  Hwo = 'hwo',
  Hya = 'hya',
  Hye = 'hye',
  Hyw = 'hyw',
  Iai = 'iai',
  Ian = 'ian',
  Iar = 'iar',
  Iba = 'iba',
  Ibb = 'ibb',
  Ibd = 'ibd',
  Ibe = 'ibe',
  Ibg = 'ibg',
  Ibh = 'ibh',
  Ibl = 'ibl',
  Ibm = 'ibm',
  Ibn = 'ibn',
  Ibo = 'ibo',
  Ibr = 'ibr',
  Ibu = 'ibu',
  Iby = 'iby',
  Ica = 'ica',
  Ich = 'ich',
  Icl = 'icl',
  Icr = 'icr',
  Ida = 'ida',
  Idb = 'idb',
  Idc = 'idc',
  Idd = 'idd',
  Ide = 'ide',
  Idi = 'idi',
  Ido = 'ido',
  Idr = 'idr',
  Ids = 'ids',
  Idt = 'idt',
  Idu = 'idu',
  Ifa = 'ifa',
  Ifb = 'ifb',
  Ife = 'ife',
  Iff = 'iff',
  Ifk = 'ifk',
  Ifm = 'ifm',
  Ifu = 'ifu',
  Ify = 'ify',
  Igb = 'igb',
  Ige = 'ige',
  Igg = 'igg',
  Igl = 'igl',
  Igm = 'igm',
  Ign = 'ign',
  Igo = 'igo',
  Igs = 'igs',
  Igw = 'igw',
  Ihb = 'ihb',
  Ihi = 'ihi',
  Ihp = 'ihp',
  Ihw = 'ihw',
  Iii = 'iii',
  Iin = 'iin',
  Ijc = 'ijc',
  Ije = 'ije',
  Ijj = 'ijj',
  Ijn = 'ijn',
  Ijs = 'ijs',
  Ike = 'ike',
  Iki = 'iki',
  Ikk = 'ikk',
  Ikl = 'ikl',
  Iko = 'iko',
  Ikp = 'ikp',
  Ikr = 'ikr',
  Iks = 'iks',
  Ikt = 'ikt',
  Iku = 'iku',
  Ikv = 'ikv',
  Ikw = 'ikw',
  Ikx = 'ikx',
  Ikz = 'ikz',
  Ila = 'ila',
  Ilb = 'ilb',
  Ile = 'ile',
  Ilg = 'ilg',
  Ili = 'ili',
  Ilk = 'ilk',
  Ilm = 'ilm',
  Ilo = 'ilo',
  Ilp = 'ilp',
  Ils = 'ils',
  Ilu = 'ilu',
  Ilv = 'ilv',
  Ima = 'ima',
  Imi = 'imi',
  Iml = 'iml',
  Imn = 'imn',
  Imo = 'imo',
  Imr = 'imr',
  Ims = 'ims',
  Imy = 'imy',
  Ina = 'ina',
  Inb = 'inb',
  Ind = 'ind',
  Ing = 'ing',
  Inh = 'inh',
  Inj = 'inj',
  Inl = 'inl',
  Inm = 'inm',
  Inn = 'inn',
  Ino = 'ino',
  Inp = 'inp',
  Ins = 'ins',
  Int = 'int',
  Inz = 'inz',
  Ior = 'ior',
  Iou = 'iou',
  Iow = 'iow',
  Ipi = 'ipi',
  Ipk = 'ipk',
  Ipo = 'ipo',
  Iqu = 'iqu',
  Iqw = 'iqw',
  Ire = 'ire',
  Irh = 'irh',
  Iri = 'iri',
  Irk = 'irk',
  Irn = 'irn',
  Irr = 'irr',
  Iru = 'iru',
  Irx = 'irx',
  Iry = 'iry',
  Isa = 'isa',
  Isc = 'isc',
  Isd = 'isd',
  Ise = 'ise',
  Isg = 'isg',
  Ish = 'ish',
  Isi = 'isi',
  Isk = 'isk',
  Isl = 'isl',
  Ism = 'ism',
  Isn = 'isn',
  Iso = 'iso',
  Isr = 'isr',
  Ist = 'ist',
  Isu = 'isu',
  Ita = 'ita',
  Itb = 'itb',
  Itd = 'itd',
  Ite = 'ite',
  Iti = 'iti',
  Itk = 'itk',
  Itl = 'itl',
  Itm = 'itm',
  Ito = 'ito',
  Itr = 'itr',
  Its = 'its',
  Itt = 'itt',
  Itv = 'itv',
  Itw = 'itw',
  Itx = 'itx',
  Ity = 'ity',
  Itz = 'itz',
  Ium = 'ium',
  Ivb = 'ivb',
  Ivv = 'ivv',
  Iwk = 'iwk',
  Iwm = 'iwm',
  Iwo = 'iwo',
  Iws = 'iws',
  Ixc = 'ixc',
  Ixl = 'ixl',
  Iya = 'iya',
  Iyo = 'iyo',
  Iyx = 'iyx',
  Izh = 'izh',
  Izr = 'izr',
  Izz = 'izz',
  Jaa = 'jaa',
  Jab = 'jab',
  Jac = 'jac',
  Jad = 'jad',
  Jae = 'jae',
  Jaf = 'jaf',
  Jah = 'jah',
  Jaj = 'jaj',
  Jak = 'jak',
  Jal = 'jal',
  Jam = 'jam',
  Jan = 'jan',
  Jao = 'jao',
  Jaq = 'jaq',
  Jas = 'jas',
  Jat = 'jat',
  Jau = 'jau',
  Jav = 'jav',
  Jax = 'jax',
  Jay = 'jay',
  Jaz = 'jaz',
  Jbe = 'jbe',
  Jbi = 'jbi',
  Jbj = 'jbj',
  Jbk = 'jbk',
  Jbn = 'jbn',
  Jbo = 'jbo',
  Jbr = 'jbr',
  Jbt = 'jbt',
  Jbu = 'jbu',
  Jbw = 'jbw',
  Jcs = 'jcs',
  Jct = 'jct',
  Jda = 'jda',
  Jdg = 'jdg',
  Jdt = 'jdt',
  Jeb = 'jeb',
  Jee = 'jee',
  Jeh = 'jeh',
  Jei = 'jei',
  Jek = 'jek',
  Jel = 'jel',
  Jen = 'jen',
  Jer = 'jer',
  Jet = 'jet',
  Jeu = 'jeu',
  Jgb = 'jgb',
  Jge = 'jge',
  Jgk = 'jgk',
  Jgo = 'jgo',
  Jhi = 'jhi',
  Jhs = 'jhs',
  Jia = 'jia',
  Jib = 'jib',
  Jic = 'jic',
  Jid = 'jid',
  Jie = 'jie',
  Jig = 'jig',
  Jih = 'jih',
  Jii = 'jii',
  Jil = 'jil',
  Jim = 'jim',
  Jio = 'jio',
  Jiq = 'jiq',
  Jit = 'jit',
  Jiu = 'jiu',
  Jiv = 'jiv',
  Jiy = 'jiy',
  Jje = 'jje',
  Jjr = 'jjr',
  Jka = 'jka',
  Jkm = 'jkm',
  Jko = 'jko',
  Jkp = 'jkp',
  Jkr = 'jkr',
  Jku = 'jku',
  Jle = 'jle',
  Jls = 'jls',
  Jma = 'jma',
  Jmb = 'jmb',
  Jmc = 'jmc',
  Jmd = 'jmd',
  Jmi = 'jmi',
  Jml = 'jml',
  Jmn = 'jmn',
  Jmr = 'jmr',
  Jms = 'jms',
  Jmw = 'jmw',
  Jmx = 'jmx',
  Jna = 'jna',
  Jnd = 'jnd',
  Jng = 'jng',
  Jni = 'jni',
  Jnj = 'jnj',
  Jnl = 'jnl',
  Jns = 'jns',
  Job = 'job',
  Jod = 'jod',
  Jog = 'jog',
  Jor = 'jor',
  Jos = 'jos',
  Jow = 'jow',
  Jpa = 'jpa',
  Jpn = 'jpn',
  Jpr = 'jpr',
  Jqr = 'jqr',
  Jra = 'jra',
  Jrb = 'jrb',
  Jrr = 'jrr',
  Jrt = 'jrt',
  Jru = 'jru',
  Jsl = 'jsl',
  Jua = 'jua',
  Jub = 'jub',
  Juc = 'juc',
  Jud = 'jud',
  Juh = 'juh',
  Jui = 'jui',
  Juk = 'juk',
  Jul = 'jul',
  Jum = 'jum',
  Jun = 'jun',
  Juo = 'juo',
  Jup = 'jup',
  Jur = 'jur',
  Jus = 'jus',
  Jut = 'jut',
  Juu = 'juu',
  Juw = 'juw',
  Juy = 'juy',
  Jvd = 'jvd',
  Jvn = 'jvn',
  Jwi = 'jwi',
  Jya = 'jya',
  Jye = 'jye',
  Jyy = 'jyy',
  Kaa = 'kaa',
  Kab = 'kab',
  Kac = 'kac',
  Kad = 'kad',
  Kae = 'kae',
  Kaf = 'kaf',
  Kag = 'kag',
  Kah = 'kah',
  Kai = 'kai',
  Kaj = 'kaj',
  Kak = 'kak',
  Kal = 'kal',
  Kam = 'kam',
  Kan = 'kan',
  Kao = 'kao',
  Kap = 'kap',
  Kaq = 'kaq',
  Kas = 'kas',
  Kat = 'kat',
  Kau = 'kau',
  Kav = 'kav',
  Kaw = 'kaw',
  Kax = 'kax',
  Kay = 'kay',
  Kaz = 'kaz',
  Kba = 'kba',
  Kbb = 'kbb',
  Kbc = 'kbc',
  Kbd = 'kbd',
  Kbe = 'kbe',
  Kbg = 'kbg',
  Kbh = 'kbh',
  Kbi = 'kbi',
  Kbj = 'kbj',
  Kbk = 'kbk',
  Kbl = 'kbl',
  Kbm = 'kbm',
  Kbn = 'kbn',
  Kbo = 'kbo',
  Kbp = 'kbp',
  Kbq = 'kbq',
  Kbr = 'kbr',
  Kbs = 'kbs',
  Kbt = 'kbt',
  Kbu = 'kbu',
  Kbv = 'kbv',
  Kbw = 'kbw',
  Kbx = 'kbx',
  Kby = 'kby',
  Kbz = 'kbz',
  Kca = 'kca',
  Kcb = 'kcb',
  Kcc = 'kcc',
  Kcd = 'kcd',
  Kce = 'kce',
  Kcf = 'kcf',
  Kcg = 'kcg',
  Kch = 'kch',
  Kci = 'kci',
  Kcj = 'kcj',
  Kck = 'kck',
  Kcl = 'kcl',
  Kcm = 'kcm',
  Kcn = 'kcn',
  Kco = 'kco',
  Kcp = 'kcp',
  Kcq = 'kcq',
  Kcr = 'kcr',
  Kcs = 'kcs',
  Kct = 'kct',
  Kcu = 'kcu',
  Kcv = 'kcv',
  Kcw = 'kcw',
  Kcx = 'kcx',
  Kcy = 'kcy',
  Kcz = 'kcz',
  Kda = 'kda',
  Kdc = 'kdc',
  Kdd = 'kdd',
  Kde = 'kde',
  Kdf = 'kdf',
  Kdg = 'kdg',
  Kdh = 'kdh',
  Kdi = 'kdi',
  Kdj = 'kdj',
  Kdk = 'kdk',
  Kdl = 'kdl',
  Kdm = 'kdm',
  Kdn = 'kdn',
  Kdp = 'kdp',
  Kdq = 'kdq',
  Kdr = 'kdr',
  Kdt = 'kdt',
  Kdu = 'kdu',
  Kdw = 'kdw',
  Kdx = 'kdx',
  Kdy = 'kdy',
  Kdz = 'kdz',
  Kea = 'kea',
  Keb = 'keb',
  Kec = 'kec',
  Ked = 'ked',
  Kee = 'kee',
  Kef = 'kef',
  Keg = 'keg',
  Keh = 'keh',
  Kei = 'kei',
  Kej = 'kej',
  Kek = 'kek',
  Kel = 'kel',
  Kem = 'kem',
  Ken = 'ken',
  Keo = 'keo',
  Kep = 'kep',
  Keq = 'keq',
  Ker = 'ker',
  Kes = 'kes',
  Ket = 'ket',
  Keu = 'keu',
  Kev = 'kev',
  Kew = 'kew',
  Kex = 'kex',
  Key = 'key',
  Kez = 'kez',
  Kfa = 'kfa',
  Kfb = 'kfb',
  Kfc = 'kfc',
  Kfd = 'kfd',
  Kfe = 'kfe',
  Kff = 'kff',
  Kfg = 'kfg',
  Kfh = 'kfh',
  Kfi = 'kfi',
  Kfj = 'kfj',
  Kfk = 'kfk',
  Kfl = 'kfl',
  Kfm = 'kfm',
  Kfn = 'kfn',
  Kfo = 'kfo',
  Kfp = 'kfp',
  Kfq = 'kfq',
  Kfr = 'kfr',
  Kfs = 'kfs',
  Kft = 'kft',
  Kfu = 'kfu',
  Kfv = 'kfv',
  Kfw = 'kfw',
  Kfx = 'kfx',
  Kfy = 'kfy',
  Kfz = 'kfz',
  Kga = 'kga',
  Kgb = 'kgb',
  Kge = 'kge',
  Kgf = 'kgf',
  Kgg = 'kgg',
  Kgi = 'kgi',
  Kgj = 'kgj',
  Kgk = 'kgk',
  Kgl = 'kgl',
  Kgm = 'kgm',
  Kgn = 'kgn',
  Kgo = 'kgo',
  Kgp = 'kgp',
  Kgq = 'kgq',
  Kgr = 'kgr',
  Kgs = 'kgs',
  Kgt = 'kgt',
  Kgu = 'kgu',
  Kgv = 'kgv',
  Kgw = 'kgw',
  Kgx = 'kgx',
  Kgy = 'kgy',
  Kha = 'kha',
  Khb = 'khb',
  Khc = 'khc',
  Khd = 'khd',
  Khe = 'khe',
  Khf = 'khf',
  Khg = 'khg',
  Khh = 'khh',
  Khj = 'khj',
  Khk = 'khk',
  Khl = 'khl',
  Khm = 'khm',
  Khn = 'khn',
  Kho = 'kho',
  Khp = 'khp',
  Khq = 'khq',
  Khr = 'khr',
  Khs = 'khs',
  Kht = 'kht',
  Khu = 'khu',
  Khv = 'khv',
  Khw = 'khw',
  Khx = 'khx',
  Khy = 'khy',
  Khz = 'khz',
  Kia = 'kia',
  Kib = 'kib',
  Kic = 'kic',
  Kid = 'kid',
  Kie = 'kie',
  Kif = 'kif',
  Kig = 'kig',
  Kih = 'kih',
  Kii = 'kii',
  Kij = 'kij',
  Kik = 'kik',
  Kil = 'kil',
  Kim = 'kim',
  Kin = 'kin',
  Kio = 'kio',
  Kip = 'kip',
  Kiq = 'kiq',
  Kir = 'kir',
  Kis = 'kis',
  Kit = 'kit',
  Kiu = 'kiu',
  Kiv = 'kiv',
  Kiw = 'kiw',
  Kix = 'kix',
  Kiy = 'kiy',
  Kiz = 'kiz',
  Kja = 'kja',
  Kjb = 'kjb',
  Kjc = 'kjc',
  Kjd = 'kjd',
  Kje = 'kje',
  Kjg = 'kjg',
  Kjh = 'kjh',
  Kji = 'kji',
  Kjj = 'kjj',
  Kjk = 'kjk',
  Kjl = 'kjl',
  Kjm = 'kjm',
  Kjn = 'kjn',
  Kjo = 'kjo',
  Kjp = 'kjp',
  Kjq = 'kjq',
  Kjr = 'kjr',
  Kjs = 'kjs',
  Kjt = 'kjt',
  Kju = 'kju',
  Kjv = 'kjv',
  Kjx = 'kjx',
  Kjy = 'kjy',
  Kjz = 'kjz',
  Kka = 'kka',
  Kkb = 'kkb',
  Kkc = 'kkc',
  Kkd = 'kkd',
  Kke = 'kke',
  Kkf = 'kkf',
  Kkg = 'kkg',
  Kkh = 'kkh',
  Kki = 'kki',
  Kkj = 'kkj',
  Kkk = 'kkk',
  Kkl = 'kkl',
  Kkm = 'kkm',
  Kkn = 'kkn',
  Kko = 'kko',
  Kkp = 'kkp',
  Kkq = 'kkq',
  Kkr = 'kkr',
  Kks = 'kks',
  Kkt = 'kkt',
  Kku = 'kku',
  Kkv = 'kkv',
  Kkw = 'kkw',
  Kkx = 'kkx',
  Kky = 'kky',
  Kkz = 'kkz',
  Kla = 'kla',
  Klb = 'klb',
  Klc = 'klc',
  Kld = 'kld',
  Kle = 'kle',
  Klf = 'klf',
  Klg = 'klg',
  Klh = 'klh',
  Kli = 'kli',
  Klj = 'klj',
  Klk = 'klk',
  Kll = 'kll',
  Klm = 'klm',
  Kln = 'kln',
  Klo = 'klo',
  Klp = 'klp',
  Klq = 'klq',
  Klr = 'klr',
  Kls = 'kls',
  Klt = 'klt',
  Klu = 'klu',
  Klv = 'klv',
  Klw = 'klw',
  Klx = 'klx',
  Kly = 'kly',
  Klz = 'klz',
  Kma = 'kma',
  Kmb = 'kmb',
  Kmc = 'kmc',
  Kmd = 'kmd',
  Kme = 'kme',
  Kmf = 'kmf',
  Kmg = 'kmg',
  Kmh = 'kmh',
  Kmi = 'kmi',
  Kmj = 'kmj',
  Kmk = 'kmk',
  Kml = 'kml',
  Kmm = 'kmm',
  Kmn = 'kmn',
  Kmo = 'kmo',
  Kmp = 'kmp',
  Kmq = 'kmq',
  Kmr = 'kmr',
  Kms = 'kms',
  Kmt = 'kmt',
  Kmu = 'kmu',
  Kmv = 'kmv',
  Kmw = 'kmw',
  Kmx = 'kmx',
  Kmy = 'kmy',
  Kmz = 'kmz',
  Kna = 'kna',
  Knb = 'knb',
  Knc = 'knc',
  Knd = 'knd',
  Kne = 'kne',
  Knf = 'knf',
  Kng = 'kng',
  Kni = 'kni',
  Knj = 'knj',
  Knk = 'knk',
  Knl = 'knl',
  Knm = 'knm',
  Knn = 'knn',
  Kno = 'kno',
  Knp = 'knp',
  Knq = 'knq',
  Knr = 'knr',
  Kns = 'kns',
  Knt = 'knt',
  Knu = 'knu',
  Knv = 'knv',
  Knw = 'knw',
  Knx = 'knx',
  Kny = 'kny',
  Knz = 'knz',
  Koa = 'koa',
  Koc = 'koc',
  Kod = 'kod',
  Koe = 'koe',
  Kof = 'kof',
  Kog = 'kog',
  Koh = 'koh',
  Koi = 'koi',
  Kok = 'kok',
  Kol = 'kol',
  Kom = 'kom',
  Kon = 'kon',
  Koo = 'koo',
  Kop = 'kop',
  Koq = 'koq',
  Kor = 'kor',
  Kos = 'kos',
  Kot = 'kot',
  Kou = 'kou',
  Kov = 'kov',
  Kow = 'kow',
  Koy = 'koy',
  Koz = 'koz',
  Kpa = 'kpa',
  Kpb = 'kpb',
  Kpc = 'kpc',
  Kpd = 'kpd',
  Kpe = 'kpe',
  Kpf = 'kpf',
  Kpg = 'kpg',
  Kph = 'kph',
  Kpi = 'kpi',
  Kpj = 'kpj',
  Kpk = 'kpk',
  Kpl = 'kpl',
  Kpm = 'kpm',
  Kpn = 'kpn',
  Kpo = 'kpo',
  Kpq = 'kpq',
  Kpr = 'kpr',
  Kps = 'kps',
  Kpt = 'kpt',
  Kpu = 'kpu',
  Kpv = 'kpv',
  Kpw = 'kpw',
  Kpx = 'kpx',
  Kpy = 'kpy',
  Kpz = 'kpz',
  Kqa = 'kqa',
  Kqb = 'kqb',
  Kqc = 'kqc',
  Kqd = 'kqd',
  Kqe = 'kqe',
  Kqf = 'kqf',
  Kqg = 'kqg',
  Kqh = 'kqh',
  Kqi = 'kqi',
  Kqj = 'kqj',
  Kqk = 'kqk',
  Kql = 'kql',
  Kqm = 'kqm',
  Kqn = 'kqn',
  Kqo = 'kqo',
  Kqp = 'kqp',
  Kqq = 'kqq',
  Kqr = 'kqr',
  Kqs = 'kqs',
  Kqt = 'kqt',
  Kqu = 'kqu',
  Kqv = 'kqv',
  Kqw = 'kqw',
  Kqx = 'kqx',
  Kqy = 'kqy',
  Kqz = 'kqz',
  Kra = 'kra',
  Krb = 'krb',
  Krc = 'krc',
  Krd = 'krd',
  Kre = 'kre',
  Krf = 'krf',
  Krh = 'krh',
  Kri = 'kri',
  Krj = 'krj',
  Krk = 'krk',
  Krl = 'krl',
  Krn = 'krn',
  Krp = 'krp',
  Krr = 'krr',
  Krs = 'krs',
  Krt = 'krt',
  Kru = 'kru',
  Krv = 'krv',
  Krw = 'krw',
  Krx = 'krx',
  Kry = 'kry',
  Krz = 'krz',
  Ksa = 'ksa',
  Ksb = 'ksb',
  Ksc = 'ksc',
  Ksd = 'ksd',
  Kse = 'kse',
  Ksf = 'ksf',
  Ksg = 'ksg',
  Ksh = 'ksh',
  Ksi = 'ksi',
  Ksj = 'ksj',
  Ksk = 'ksk',
  Ksl = 'ksl',
  Ksm = 'ksm',
  Ksn = 'ksn',
  Kso = 'kso',
  Ksp = 'ksp',
  Ksq = 'ksq',
  Ksr = 'ksr',
  Kss = 'kss',
  Kst = 'kst',
  Ksu = 'ksu',
  Ksv = 'ksv',
  Ksw = 'ksw',
  Ksx = 'ksx',
  Ksy = 'ksy',
  Ksz = 'ksz',
  Kta = 'kta',
  Ktb = 'ktb',
  Ktc = 'ktc',
  Ktd = 'ktd',
  Kte = 'kte',
  Ktf = 'ktf',
  Ktg = 'ktg',
  Kth = 'kth',
  Kti = 'kti',
  Ktj = 'ktj',
  Ktk = 'ktk',
  Ktl = 'ktl',
  Ktm = 'ktm',
  Ktn = 'ktn',
  Kto = 'kto',
  Ktp = 'ktp',
  Ktq = 'ktq',
  Kts = 'kts',
  Ktt = 'ktt',
  Ktu = 'ktu',
  Ktv = 'ktv',
  Ktw = 'ktw',
  Ktx = 'ktx',
  Kty = 'kty',
  Ktz = 'ktz',
  Kua = 'kua',
  Kub = 'kub',
  Kuc = 'kuc',
  Kud = 'kud',
  Kue = 'kue',
  Kuf = 'kuf',
  Kug = 'kug',
  Kuh = 'kuh',
  Kui = 'kui',
  Kuj = 'kuj',
  Kuk = 'kuk',
  Kul = 'kul',
  Kum = 'kum',
  Kun = 'kun',
  Kuo = 'kuo',
  Kup = 'kup',
  Kuq = 'kuq',
  Kur = 'kur',
  Kus = 'kus',
  Kut = 'kut',
  Kuu = 'kuu',
  Kuv = 'kuv',
  Kuw = 'kuw',
  Kux = 'kux',
  Kuy = 'kuy',
  Kuz = 'kuz',
  Kva = 'kva',
  Kvb = 'kvb',
  Kvc = 'kvc',
  Kvd = 'kvd',
  Kve = 'kve',
  Kvf = 'kvf',
  Kvg = 'kvg',
  Kvh = 'kvh',
  Kvi = 'kvi',
  Kvj = 'kvj',
  Kvk = 'kvk',
  Kvl = 'kvl',
  Kvm = 'kvm',
  Kvn = 'kvn',
  Kvo = 'kvo',
  Kvp = 'kvp',
  Kvq = 'kvq',
  Kvr = 'kvr',
  Kvt = 'kvt',
  Kvu = 'kvu',
  Kvv = 'kvv',
  Kvw = 'kvw',
  Kvx = 'kvx',
  Kvy = 'kvy',
  Kvz = 'kvz',
  Kwa = 'kwa',
  Kwb = 'kwb',
  Kwc = 'kwc',
  Kwd = 'kwd',
  Kwe = 'kwe',
  Kwf = 'kwf',
  Kwg = 'kwg',
  Kwh = 'kwh',
  Kwi = 'kwi',
  Kwj = 'kwj',
  Kwk = 'kwk',
  Kwl = 'kwl',
  Kwm = 'kwm',
  Kwn = 'kwn',
  Kwo = 'kwo',
  Kwp = 'kwp',
  Kwr = 'kwr',
  Kws = 'kws',
  Kwt = 'kwt',
  Kwu = 'kwu',
  Kwv = 'kwv',
  Kww = 'kww',
  Kwx = 'kwx',
  Kwy = 'kwy',
  Kwz = 'kwz',
  Kxa = 'kxa',
  Kxb = 'kxb',
  Kxc = 'kxc',
  Kxd = 'kxd',
  Kxf = 'kxf',
  Kxh = 'kxh',
  Kxi = 'kxi',
  Kxj = 'kxj',
  Kxk = 'kxk',
  Kxm = 'kxm',
  Kxn = 'kxn',
  Kxo = 'kxo',
  Kxp = 'kxp',
  Kxq = 'kxq',
  Kxr = 'kxr',
  Kxs = 'kxs',
  Kxt = 'kxt',
  Kxv = 'kxv',
  Kxw = 'kxw',
  Kxx = 'kxx',
  Kxy = 'kxy',
  Kxz = 'kxz',
  Kya = 'kya',
  Kyb = 'kyb',
  Kyc = 'kyc',
  Kyd = 'kyd',
  Kye = 'kye',
  Kyf = 'kyf',
  Kyg = 'kyg',
  Kyh = 'kyh',
  Kyi = 'kyi',
  Kyj = 'kyj',
  Kyk = 'kyk',
  Kyl = 'kyl',
  Kym = 'kym',
  Kyn = 'kyn',
  Kyo = 'kyo',
  Kyp = 'kyp',
  Kyq = 'kyq',
  Kyr = 'kyr',
  Kys = 'kys',
  Kyt = 'kyt',
  Kyu = 'kyu',
  Kyv = 'kyv',
  Kyw = 'kyw',
  Kyx = 'kyx',
  Kyy = 'kyy',
  Kyz = 'kyz',
  Kza = 'kza',
  Kzb = 'kzb',
  Kzc = 'kzc',
  Kzd = 'kzd',
  Kze = 'kze',
  Kzf = 'kzf',
  Kzg = 'kzg',
  Kzi = 'kzi',
  Kzk = 'kzk',
  Kzl = 'kzl',
  Kzm = 'kzm',
  Kzn = 'kzn',
  Kzo = 'kzo',
  Kzp = 'kzp',
  Kzq = 'kzq',
  Kzr = 'kzr',
  Kzs = 'kzs',
  Kzu = 'kzu',
  Kzv = 'kzv',
  Kzw = 'kzw',
  Kzx = 'kzx',
  Kzy = 'kzy',
  Kzz = 'kzz',
  Laa = 'laa',
  Lab = 'lab',
  Lac = 'lac',
  Lad = 'lad',
  Lae = 'lae',
  Laf = 'laf',
  Lag = 'lag',
  Lah = 'lah',
  Lai = 'lai',
  Laj = 'laj',
  Lak = 'lak',
  Lal = 'lal',
  Lam = 'lam',
  Lan = 'lan',
  Lao = 'lao',
  Lap = 'lap',
  Laq = 'laq',
  Lar = 'lar',
  Las = 'las',
  Lat = 'lat',
  Lau = 'lau',
  Lav = 'lav',
  Law = 'law',
  Lax = 'lax',
  Lay = 'lay',
  Laz = 'laz',
  Lbb = 'lbb',
  Lbc = 'lbc',
  Lbe = 'lbe',
  Lbf = 'lbf',
  Lbg = 'lbg',
  Lbi = 'lbi',
  Lbj = 'lbj',
  Lbk = 'lbk',
  Lbl = 'lbl',
  Lbm = 'lbm',
  Lbn = 'lbn',
  Lbo = 'lbo',
  Lbq = 'lbq',
  Lbr = 'lbr',
  Lbs = 'lbs',
  Lbt = 'lbt',
  Lbu = 'lbu',
  Lbv = 'lbv',
  Lbw = 'lbw',
  Lbx = 'lbx',
  Lby = 'lby',
  Lbz = 'lbz',
  Lcc = 'lcc',
  Lcd = 'lcd',
  Lce = 'lce',
  Lcf = 'lcf',
  Lch = 'lch',
  Lcl = 'lcl',
  Lcm = 'lcm',
  Lcp = 'lcp',
  Lcq = 'lcq',
  Lcs = 'lcs',
  Lda = 'lda',
  Ldb = 'ldb',
  Ldd = 'ldd',
  Ldg = 'ldg',
  Ldh = 'ldh',
  Ldi = 'ldi',
  Ldj = 'ldj',
  Ldk = 'ldk',
  Ldl = 'ldl',
  Ldm = 'ldm',
  Ldn = 'ldn',
  Ldo = 'ldo',
  Ldp = 'ldp',
  Ldq = 'ldq',
  Lea = 'lea',
  Leb = 'leb',
  Lec = 'lec',
  Led = 'led',
  Lee = 'lee',
  Lef = 'lef',
  Leh = 'leh',
  Lei = 'lei',
  Lej = 'lej',
  Lek = 'lek',
  Lel = 'lel',
  Lem = 'lem',
  Len = 'len',
  Leo = 'leo',
  Lep = 'lep',
  Leq = 'leq',
  Ler = 'ler',
  Les = 'les',
  Let = 'let',
  Leu = 'leu',
  Lev = 'lev',
  Lew = 'lew',
  Lex = 'lex',
  Ley = 'ley',
  Lez = 'lez',
  Lfa = 'lfa',
  Lfn = 'lfn',
  Lga = 'lga',
  Lgb = 'lgb',
  Lgg = 'lgg',
  Lgh = 'lgh',
  Lgi = 'lgi',
  Lgk = 'lgk',
  Lgl = 'lgl',
  Lgm = 'lgm',
  Lgn = 'lgn',
  Lgq = 'lgq',
  Lgr = 'lgr',
  Lgt = 'lgt',
  Lgu = 'lgu',
  Lgz = 'lgz',
  Lha = 'lha',
  Lhh = 'lhh',
  Lhi = 'lhi',
  Lhl = 'lhl',
  Lhm = 'lhm',
  Lhn = 'lhn',
  Lhp = 'lhp',
  Lhs = 'lhs',
  Lht = 'lht',
  Lhu = 'lhu',
  Lia = 'lia',
  Lib = 'lib',
  Lic = 'lic',
  Lid = 'lid',
  Lie = 'lie',
  Lif = 'lif',
  Lig = 'lig',
  Lih = 'lih',
  Lij = 'lij',
  Lik = 'lik',
  Lil = 'lil',
  Lim = 'lim',
  Lin = 'lin',
  Lio = 'lio',
  Lip = 'lip',
  Liq = 'liq',
  Lir = 'lir',
  Lis = 'lis',
  Lit = 'lit',
  Liu = 'liu',
  Liv = 'liv',
  Liw = 'liw',
  Lix = 'lix',
  Liy = 'liy',
  Liz = 'liz',
  Lja = 'lja',
  Lje = 'lje',
  Lji = 'lji',
  Ljl = 'ljl',
  Ljp = 'ljp',
  Ljw = 'ljw',
  Ljx = 'ljx',
  Lka = 'lka',
  Lkb = 'lkb',
  Lkc = 'lkc',
  Lkd = 'lkd',
  Lke = 'lke',
  Lkh = 'lkh',
  Lki = 'lki',
  Lkj = 'lkj',
  Lkl = 'lkl',
  Lkm = 'lkm',
  Lkn = 'lkn',
  Lko = 'lko',
  Lkr = 'lkr',
  Lks = 'lks',
  Lkt = 'lkt',
  Lku = 'lku',
  Lky = 'lky',
  Lla = 'lla',
  Llb = 'llb',
  Llc = 'llc',
  Lld = 'lld',
  Lle = 'lle',
  Llf = 'llf',
  Llg = 'llg',
  Llh = 'llh',
  Lli = 'lli',
  Llj = 'llj',
  Llk = 'llk',
  Lll = 'lll',
  Llm = 'llm',
  Lln = 'lln',
  Llp = 'llp',
  Llq = 'llq',
  Lls = 'lls',
  Llu = 'llu',
  Llx = 'llx',
  Lma = 'lma',
  Lmb = 'lmb',
  Lmc = 'lmc',
  Lmd = 'lmd',
  Lme = 'lme',
  Lmf = 'lmf',
  Lmg = 'lmg',
  Lmh = 'lmh',
  Lmi = 'lmi',
  Lmj = 'lmj',
  Lmk = 'lmk',
  Lml = 'lml',
  Lmn = 'lmn',
  Lmo = 'lmo',
  Lmp = 'lmp',
  Lmq = 'lmq',
  Lmr = 'lmr',
  Lmu = 'lmu',
  Lmv = 'lmv',
  Lmw = 'lmw',
  Lmx = 'lmx',
  Lmy = 'lmy',
  Lna = 'lna',
  Lnb = 'lnb',
  Lnd = 'lnd',
  Lng = 'lng',
  Lnh = 'lnh',
  Lni = 'lni',
  Lnj = 'lnj',
  Lnl = 'lnl',
  Lnm = 'lnm',
  Lnn = 'lnn',
  Lno = 'lno',
  Lns = 'lns',
  Lnu = 'lnu',
  Lnw = 'lnw',
  Lnz = 'lnz',
  Loa = 'loa',
  Lob = 'lob',
  Loc = 'loc',
  Loe = 'loe',
  Lof = 'lof',
  Log = 'log',
  Loh = 'loh',
  Loi = 'loi',
  Loj = 'loj',
  Lok = 'lok',
  Lol = 'lol',
  Lom = 'lom',
  Lon = 'lon',
  Loo = 'loo',
  Lop = 'lop',
  Loq = 'loq',
  Lor = 'lor',
  Los = 'los',
  Lot = 'lot',
  Lou = 'lou',
  Lov = 'lov',
  Low = 'low',
  Lox = 'lox',
  Loy = 'loy',
  Loz = 'loz',
  Lpa = 'lpa',
  Lpe = 'lpe',
  Lpn = 'lpn',
  Lpo = 'lpo',
  Lpx = 'lpx',
  Lra = 'lra',
  Lrc = 'lrc',
  Lre = 'lre',
  Lrg = 'lrg',
  Lri = 'lri',
  Lrk = 'lrk',
  Lrl = 'lrl',
  Lrm = 'lrm',
  Lrn = 'lrn',
  Lro = 'lro',
  Lrr = 'lrr',
  Lrt = 'lrt',
  Lrv = 'lrv',
  Lrz = 'lrz',
  Lsa = 'lsa',
  Lsd = 'lsd',
  Lse = 'lse',
  Lsh = 'lsh',
  Lsi = 'lsi',
  Lsl = 'lsl',
  Lsm = 'lsm',
  Lsn = 'lsn',
  Lso = 'lso',
  Lsp = 'lsp',
  Lsr = 'lsr',
  Lss = 'lss',
  Lst = 'lst',
  Lsv = 'lsv',
  Lsy = 'lsy',
  Ltc = 'ltc',
  Ltg = 'ltg',
  Lth = 'lth',
  Lti = 'lti',
  Ltn = 'ltn',
  Lto = 'lto',
  Lts = 'lts',
  Ltu = 'ltu',
  Ltz = 'ltz',
  Lua = 'lua',
  Lub = 'lub',
  Luc = 'luc',
  Lud = 'lud',
  Lue = 'lue',
  Luf = 'luf',
  Lug = 'lug',
  Lui = 'lui',
  Luj = 'luj',
  Luk = 'luk',
  Lul = 'lul',
  Lum = 'lum',
  Lun = 'lun',
  Luo = 'luo',
  Lup = 'lup',
  Luq = 'luq',
  Lur = 'lur',
  Lus = 'lus',
  Lut = 'lut',
  Luu = 'luu',
  Luv = 'luv',
  Luw = 'luw',
  Luy = 'luy',
  Luz = 'luz',
  Lva = 'lva',
  Lvi = 'lvi',
  Lvk = 'lvk',
  Lvs = 'lvs',
  Lvu = 'lvu',
  Lwa = 'lwa',
  Lwe = 'lwe',
  Lwg = 'lwg',
  Lwh = 'lwh',
  Lwl = 'lwl',
  Lwm = 'lwm',
  Lwo = 'lwo',
  Lws = 'lws',
  Lwt = 'lwt',
  Lwu = 'lwu',
  Lww = 'lww',
  Lya = 'lya',
  Lyg = 'lyg',
  Lyn = 'lyn',
  Lzh = 'lzh',
  Lzl = 'lzl',
  Lzn = 'lzn',
  Lzz = 'lzz',
  Maa = 'maa',
  Mab = 'mab',
  Mad = 'mad',
  Mae = 'mae',
  Maf = 'maf',
  Mag = 'mag',
  Mah = 'mah',
  Mai = 'mai',
  Maj = 'maj',
  Mak = 'mak',
  Mal = 'mal',
  Mam = 'mam',
  Man = 'man',
  Maq = 'maq',
  Mar = 'mar',
  Mas = 'mas',
  Mat = 'mat',
  Mau = 'mau',
  Mav = 'mav',
  Maw = 'maw',
  Max = 'max',
  Maz = 'maz',
  Mba = 'mba',
  Mbb = 'mbb',
  Mbc = 'mbc',
  Mbd = 'mbd',
  Mbe = 'mbe',
  Mbf = 'mbf',
  Mbh = 'mbh',
  Mbi = 'mbi',
  Mbj = 'mbj',
  Mbk = 'mbk',
  Mbl = 'mbl',
  Mbm = 'mbm',
  Mbn = 'mbn',
  Mbo = 'mbo',
  Mbp = 'mbp',
  Mbq = 'mbq',
  Mbr = 'mbr',
  Mbs = 'mbs',
  Mbt = 'mbt',
  Mbu = 'mbu',
  Mbv = 'mbv',
  Mbw = 'mbw',
  Mbx = 'mbx',
  Mby = 'mby',
  Mbz = 'mbz',
  Mca = 'mca',
  Mcb = 'mcb',
  Mcc = 'mcc',
  Mcd = 'mcd',
  Mce = 'mce',
  Mcf = 'mcf',
  Mcg = 'mcg',
  Mch = 'mch',
  Mci = 'mci',
  Mcj = 'mcj',
  Mck = 'mck',
  Mcl = 'mcl',
  Mcm = 'mcm',
  Mcn = 'mcn',
  Mco = 'mco',
  Mcp = 'mcp',
  Mcq = 'mcq',
  Mcr = 'mcr',
  Mcs = 'mcs',
  Mct = 'mct',
  Mcu = 'mcu',
  Mcv = 'mcv',
  Mcw = 'mcw',
  Mcx = 'mcx',
  Mcy = 'mcy',
  Mcz = 'mcz',
  Mda = 'mda',
  Mdb = 'mdb',
  Mdc = 'mdc',
  Mdd = 'mdd',
  Mde = 'mde',
  Mdf = 'mdf',
  Mdg = 'mdg',
  Mdh = 'mdh',
  Mdi = 'mdi',
  Mdj = 'mdj',
  Mdk = 'mdk',
  Mdl = 'mdl',
  Mdm = 'mdm',
  Mdn = 'mdn',
  Mdp = 'mdp',
  Mdq = 'mdq',
  Mdr = 'mdr',
  Mds = 'mds',
  Mdt = 'mdt',
  Mdu = 'mdu',
  Mdv = 'mdv',
  Mdw = 'mdw',
  Mdx = 'mdx',
  Mdy = 'mdy',
  Mdz = 'mdz',
  Mea = 'mea',
  Meb = 'meb',
  Mec = 'mec',
  Med = 'med',
  Mee = 'mee',
  Mef = 'mef',
  Meh = 'meh',
  Mei = 'mei',
  Mej = 'mej',
  Mek = 'mek',
  Mel = 'mel',
  Mem = 'mem',
  Men = 'men',
  Meo = 'meo',
  Mep = 'mep',
  Meq = 'meq',
  Mer = 'mer',
  Mes = 'mes',
  Met = 'met',
  Meu = 'meu',
  Mev = 'mev',
  Mew = 'mew',
  Mey = 'mey',
  Mez = 'mez',
  Mfa = 'mfa',
  Mfb = 'mfb',
  Mfc = 'mfc',
  Mfd = 'mfd',
  Mfe = 'mfe',
  Mff = 'mff',
  Mfg = 'mfg',
  Mfh = 'mfh',
  Mfi = 'mfi',
  Mfj = 'mfj',
  Mfk = 'mfk',
  Mfl = 'mfl',
  Mfm = 'mfm',
  Mfn = 'mfn',
  Mfo = 'mfo',
  Mfp = 'mfp',
  Mfq = 'mfq',
  Mfr = 'mfr',
  Mfs = 'mfs',
  Mft = 'mft',
  Mfu = 'mfu',
  Mfv = 'mfv',
  Mfw = 'mfw',
  Mfx = 'mfx',
  Mfy = 'mfy',
  Mfz = 'mfz',
  Mga = 'mga',
  Mgb = 'mgb',
  Mgc = 'mgc',
  Mgd = 'mgd',
  Mge = 'mge',
  Mgf = 'mgf',
  Mgg = 'mgg',
  Mgh = 'mgh',
  Mgi = 'mgi',
  Mgj = 'mgj',
  Mgk = 'mgk',
  Mgl = 'mgl',
  Mgm = 'mgm',
  Mgn = 'mgn',
  Mgo = 'mgo',
  Mgp = 'mgp',
  Mgq = 'mgq',
  Mgr = 'mgr',
  Mgs = 'mgs',
  Mgt = 'mgt',
  Mgu = 'mgu',
  Mgv = 'mgv',
  Mgw = 'mgw',
  Mgy = 'mgy',
  Mgz = 'mgz',
  Mha = 'mha',
  Mhb = 'mhb',
  Mhc = 'mhc',
  Mhd = 'mhd',
  Mhe = 'mhe',
  Mhf = 'mhf',
  Mhg = 'mhg',
  Mhi = 'mhi',
  Mhj = 'mhj',
  Mhk = 'mhk',
  Mhl = 'mhl',
  Mhm = 'mhm',
  Mhn = 'mhn',
  Mho = 'mho',
  Mhp = 'mhp',
  Mhq = 'mhq',
  Mhr = 'mhr',
  Mhs = 'mhs',
  Mht = 'mht',
  Mhu = 'mhu',
  Mhw = 'mhw',
  Mhx = 'mhx',
  Mhy = 'mhy',
  Mhz = 'mhz',
  Mia = 'mia',
  Mib = 'mib',
  Mic = 'mic',
  Mid = 'mid',
  Mie = 'mie',
  Mif = 'mif',
  Mig = 'mig',
  Mih = 'mih',
  Mii = 'mii',
  Mij = 'mij',
  Mik = 'mik',
  Mil = 'mil',
  Mim = 'mim',
  Min = 'min',
  Mio = 'mio',
  Mip = 'mip',
  Miq = 'miq',
  Mir = 'mir',
  Mis = 'mis',
  Mit = 'mit',
  Miu = 'miu',
  Miw = 'miw',
  Mix = 'mix',
  Miy = 'miy',
  Miz = 'miz',
  Mjb = 'mjb',
  Mjc = 'mjc',
  Mjd = 'mjd',
  Mje = 'mje',
  Mjg = 'mjg',
  Mjh = 'mjh',
  Mji = 'mji',
  Mjj = 'mjj',
  Mjk = 'mjk',
  Mjl = 'mjl',
  Mjm = 'mjm',
  Mjn = 'mjn',
  Mjo = 'mjo',
  Mjp = 'mjp',
  Mjq = 'mjq',
  Mjr = 'mjr',
  Mjs = 'mjs',
  Mjt = 'mjt',
  Mju = 'mju',
  Mjv = 'mjv',
  Mjw = 'mjw',
  Mjx = 'mjx',
  Mjy = 'mjy',
  Mjz = 'mjz',
  Mka = 'mka',
  Mkb = 'mkb',
  Mkc = 'mkc',
  Mkd = 'mkd',
  Mke = 'mke',
  Mkf = 'mkf',
  Mkg = 'mkg',
  Mki = 'mki',
  Mkj = 'mkj',
  Mkk = 'mkk',
  Mkl = 'mkl',
  Mkm = 'mkm',
  Mkn = 'mkn',
  Mko = 'mko',
  Mkp = 'mkp',
  Mkq = 'mkq',
  Mkr = 'mkr',
  Mks = 'mks',
  Mkt = 'mkt',
  Mku = 'mku',
  Mkv = 'mkv',
  Mkw = 'mkw',
  Mkx = 'mkx',
  Mky = 'mky',
  Mkz = 'mkz',
  Mla = 'mla',
  Mlb = 'mlb',
  Mlc = 'mlc',
  Mle = 'mle',
  Mlf = 'mlf',
  Mlg = 'mlg',
  Mlh = 'mlh',
  Mli = 'mli',
  Mlj = 'mlj',
  Mlk = 'mlk',
  Mll = 'mll',
  Mlm = 'mlm',
  Mln = 'mln',
  Mlo = 'mlo',
  Mlp = 'mlp',
  Mlq = 'mlq',
  Mlr = 'mlr',
  Mls = 'mls',
  Mlt = 'mlt',
  Mlu = 'mlu',
  Mlv = 'mlv',
  Mlw = 'mlw',
  Mlx = 'mlx',
  Mlz = 'mlz',
  Mma = 'mma',
  Mmb = 'mmb',
  Mmc = 'mmc',
  Mmd = 'mmd',
  Mme = 'mme',
  Mmf = 'mmf',
  Mmg = 'mmg',
  Mmh = 'mmh',
  Mmi = 'mmi',
  Mmj = 'mmj',
  Mmk = 'mmk',
  Mml = 'mml',
  Mmm = 'mmm',
  Mmn = 'mmn',
  Mmo = 'mmo',
  Mmp = 'mmp',
  Mmq = 'mmq',
  Mmr = 'mmr',
  Mmt = 'mmt',
  Mmu = 'mmu',
  Mmv = 'mmv',
  Mmw = 'mmw',
  Mmx = 'mmx',
  Mmy = 'mmy',
  Mmz = 'mmz',
  Mna = 'mna',
  Mnb = 'mnb',
  Mnc = 'mnc',
  Mnd = 'mnd',
  Mne = 'mne',
  Mnf = 'mnf',
  Mng = 'mng',
  Mnh = 'mnh',
  Mni = 'mni',
  Mnj = 'mnj',
  Mnk = 'mnk',
  Mnl = 'mnl',
  Mnm = 'mnm',
  Mnn = 'mnn',
  Mnp = 'mnp',
  Mnq = 'mnq',
  Mnr = 'mnr',
  Mns = 'mns',
  Mnu = 'mnu',
  Mnv = 'mnv',
  Mnw = 'mnw',
  Mnx = 'mnx',
  Mny = 'mny',
  Mnz = 'mnz',
  Moa = 'moa',
  Moc = 'moc',
  Mod = 'mod',
  Moe = 'moe',
  Mog = 'mog',
  Moh = 'moh',
  Moi = 'moi',
  Moj = 'moj',
  Mok = 'mok',
  Mom = 'mom',
  Mon = 'mon',
  Moo = 'moo',
  Mop = 'mop',
  Moq = 'moq',
  Mor = 'mor',
  Mos = 'mos',
  Mot = 'mot',
  Mou = 'mou',
  Mov = 'mov',
  Mow = 'mow',
  Mox = 'mox',
  Moy = 'moy',
  Moz = 'moz',
  Mpa = 'mpa',
  Mpb = 'mpb',
  Mpc = 'mpc',
  Mpd = 'mpd',
  Mpe = 'mpe',
  Mpg = 'mpg',
  Mph = 'mph',
  Mpi = 'mpi',
  Mpj = 'mpj',
  Mpk = 'mpk',
  Mpl = 'mpl',
  Mpm = 'mpm',
  Mpn = 'mpn',
  Mpo = 'mpo',
  Mpp = 'mpp',
  Mpq = 'mpq',
  Mpr = 'mpr',
  Mps = 'mps',
  Mpt = 'mpt',
  Mpu = 'mpu',
  Mpv = 'mpv',
  Mpw = 'mpw',
  Mpx = 'mpx',
  Mpy = 'mpy',
  Mpz = 'mpz',
  Mqa = 'mqa',
  Mqb = 'mqb',
  Mqc = 'mqc',
  Mqe = 'mqe',
  Mqf = 'mqf',
  Mqg = 'mqg',
  Mqh = 'mqh',
  Mqi = 'mqi',
  Mqj = 'mqj',
  Mqk = 'mqk',
  Mql = 'mql',
  Mqm = 'mqm',
  Mqn = 'mqn',
  Mqo = 'mqo',
  Mqp = 'mqp',
  Mqq = 'mqq',
  Mqr = 'mqr',
  Mqs = 'mqs',
  Mqt = 'mqt',
  Mqu = 'mqu',
  Mqv = 'mqv',
  Mqw = 'mqw',
  Mqx = 'mqx',
  Mqy = 'mqy',
  Mqz = 'mqz',
  Mra = 'mra',
  Mrb = 'mrb',
  Mrc = 'mrc',
  Mrd = 'mrd',
  Mre = 'mre',
  Mrf = 'mrf',
  Mrg = 'mrg',
  Mrh = 'mrh',
  Mri = 'mri',
  Mrj = 'mrj',
  Mrk = 'mrk',
  Mrl = 'mrl',
  Mrm = 'mrm',
  Mrn = 'mrn',
  Mro = 'mro',
  Mrp = 'mrp',
  Mrq = 'mrq',
  Mrr = 'mrr',
  Mrs = 'mrs',
  Mrt = 'mrt',
  Mru = 'mru',
  Mrv = 'mrv',
  Mrw = 'mrw',
  Mrx = 'mrx',
  Mry = 'mry',
  Mrz = 'mrz',
  Msa = 'msa',
  Msb = 'msb',
  Msc = 'msc',
  Msd = 'msd',
  Mse = 'mse',
  Msf = 'msf',
  Msg = 'msg',
  Msh = 'msh',
  Msi = 'msi',
  Msj = 'msj',
  Msk = 'msk',
  Msl = 'msl',
  Msm = 'msm',
  Msn = 'msn',
  Mso = 'mso',
  Msp = 'msp',
  Msq = 'msq',
  Msr = 'msr',
  Mss = 'mss',
  Msu = 'msu',
  Msv = 'msv',
  Msw = 'msw',
  Msx = 'msx',
  Msy = 'msy',
  Msz = 'msz',
  Mta = 'mta',
  Mtb = 'mtb',
  Mtc = 'mtc',
  Mtd = 'mtd',
  Mte = 'mte',
  Mtf = 'mtf',
  Mtg = 'mtg',
  Mth = 'mth',
  Mti = 'mti',
  Mtj = 'mtj',
  Mtk = 'mtk',
  Mtl = 'mtl',
  Mtm = 'mtm',
  Mtn = 'mtn',
  Mto = 'mto',
  Mtp = 'mtp',
  Mtq = 'mtq',
  Mtr = 'mtr',
  Mts = 'mts',
  Mtt = 'mtt',
  Mtu = 'mtu',
  Mtv = 'mtv',
  Mtw = 'mtw',
  Mtx = 'mtx',
  Mty = 'mty',
  Mua = 'mua',
  Mub = 'mub',
  Muc = 'muc',
  Mud = 'mud',
  Mue = 'mue',
  Mug = 'mug',
  Muh = 'muh',
  Mui = 'mui',
  Muj = 'muj',
  Muk = 'muk',
  Mul = 'mul',
  Mum = 'mum',
  Muo = 'muo',
  Mup = 'mup',
  Muq = 'muq',
  Mur = 'mur',
  Mus = 'mus',
  Mut = 'mut',
  Muu = 'muu',
  Muv = 'muv',
  Mux = 'mux',
  Muy = 'muy',
  Muz = 'muz',
  Mva = 'mva',
  Mvb = 'mvb',
  Mvd = 'mvd',
  Mve = 'mve',
  Mvf = 'mvf',
  Mvg = 'mvg',
  Mvh = 'mvh',
  Mvi = 'mvi',
  Mvk = 'mvk',
  Mvl = 'mvl',
  Mvm = 'mvm',
  Mvn = 'mvn',
  Mvo = 'mvo',
  Mvp = 'mvp',
  Mvq = 'mvq',
  Mvr = 'mvr',
  Mvs = 'mvs',
  Mvt = 'mvt',
  Mvu = 'mvu',
  Mvv = 'mvv',
  Mvw = 'mvw',
  Mvx = 'mvx',
  Mvy = 'mvy',
  Mvz = 'mvz',
  Mwa = 'mwa',
  Mwb = 'mwb',
  Mwc = 'mwc',
  Mwe = 'mwe',
  Mwf = 'mwf',
  Mwg = 'mwg',
  Mwh = 'mwh',
  Mwi = 'mwi',
  Mwk = 'mwk',
  Mwl = 'mwl',
  Mwm = 'mwm',
  Mwn = 'mwn',
  Mwo = 'mwo',
  Mwp = 'mwp',
  Mwq = 'mwq',
  Mwr = 'mwr',
  Mws = 'mws',
  Mwt = 'mwt',
  Mwu = 'mwu',
  Mwv = 'mwv',
  Mww = 'mww',
  Mwz = 'mwz',
  Mxa = 'mxa',
  Mxb = 'mxb',
  Mxc = 'mxc',
  Mxd = 'mxd',
  Mxe = 'mxe',
  Mxf = 'mxf',
  Mxg = 'mxg',
  Mxh = 'mxh',
  Mxi = 'mxi',
  Mxj = 'mxj',
  Mxk = 'mxk',
  Mxl = 'mxl',
  Mxm = 'mxm',
  Mxn = 'mxn',
  Mxo = 'mxo',
  Mxp = 'mxp',
  Mxq = 'mxq',
  Mxr = 'mxr',
  Mxs = 'mxs',
  Mxt = 'mxt',
  Mxu = 'mxu',
  Mxv = 'mxv',
  Mxw = 'mxw',
  Mxx = 'mxx',
  Mxy = 'mxy',
  Mxz = 'mxz',
  Mya = 'mya',
  Myb = 'myb',
  Myc = 'myc',
  Mye = 'mye',
  Myf = 'myf',
  Myg = 'myg',
  Myh = 'myh',
  Myj = 'myj',
  Myk = 'myk',
  Myl = 'myl',
  Mym = 'mym',
  Myo = 'myo',
  Myp = 'myp',
  Myr = 'myr',
  Mys = 'mys',
  Myu = 'myu',
  Myv = 'myv',
  Myw = 'myw',
  Myx = 'myx',
  Myy = 'myy',
  Myz = 'myz',
  Mza = 'mza',
  Mzb = 'mzb',
  Mzc = 'mzc',
  Mzd = 'mzd',
  Mze = 'mze',
  Mzg = 'mzg',
  Mzh = 'mzh',
  Mzi = 'mzi',
  Mzj = 'mzj',
  Mzk = 'mzk',
  Mzl = 'mzl',
  Mzm = 'mzm',
  Mzn = 'mzn',
  Mzo = 'mzo',
  Mzp = 'mzp',
  Mzq = 'mzq',
  Mzr = 'mzr',
  Mzs = 'mzs',
  Mzt = 'mzt',
  Mzu = 'mzu',
  Mzv = 'mzv',
  Mzw = 'mzw',
  Mzx = 'mzx',
  Mzy = 'mzy',
  Mzz = 'mzz',
  Naa = 'naa',
  Nab = 'nab',
  Nac = 'nac',
  Nae = 'nae',
  Naf = 'naf',
  Nag = 'nag',
  Naj = 'naj',
  Nak = 'nak',
  Nal = 'nal',
  Nam = 'nam',
  Nan = 'nan',
  Nao = 'nao',
  Nap = 'nap',
  Naq = 'naq',
  Nar = 'nar',
  Nas = 'nas',
  Nat = 'nat',
  Nau = 'nau',
  Nav = 'nav',
  Naw = 'naw',
  Nax = 'nax',
  Nay = 'nay',
  Naz = 'naz',
  Nba = 'nba',
  Nbb = 'nbb',
  Nbc = 'nbc',
  Nbd = 'nbd',
  Nbe = 'nbe',
  Nbg = 'nbg',
  Nbh = 'nbh',
  Nbi = 'nbi',
  Nbj = 'nbj',
  Nbk = 'nbk',
  Nbl = 'nbl',
  Nbm = 'nbm',
  Nbn = 'nbn',
  Nbo = 'nbo',
  Nbp = 'nbp',
  Nbq = 'nbq',
  Nbr = 'nbr',
  Nbs = 'nbs',
  Nbt = 'nbt',
  Nbu = 'nbu',
  Nbv = 'nbv',
  Nbw = 'nbw',
  Nby = 'nby',
  Nca = 'nca',
  Ncb = 'ncb',
  Ncc = 'ncc',
  Ncd = 'ncd',
  Nce = 'nce',
  Ncf = 'ncf',
  Ncg = 'ncg',
  Nch = 'nch',
  Nci = 'nci',
  Ncj = 'ncj',
  Nck = 'nck',
  Ncl = 'ncl',
  Ncm = 'ncm',
  Ncn = 'ncn',
  Nco = 'nco',
  Ncq = 'ncq',
  Ncr = 'ncr',
  Ncs = 'ncs',
  Nct = 'nct',
  Ncu = 'ncu',
  Ncx = 'ncx',
  Ncz = 'ncz',
  Nda = 'nda',
  Ndb = 'ndb',
  Ndc = 'ndc',
  Ndd = 'ndd',
  Nde = 'nde',
  Ndf = 'ndf',
  Ndg = 'ndg',
  Ndh = 'ndh',
  Ndi = 'ndi',
  Ndj = 'ndj',
  Ndk = 'ndk',
  Ndl = 'ndl',
  Ndm = 'ndm',
  Ndn = 'ndn',
  Ndo = 'ndo',
  Ndp = 'ndp',
  Ndq = 'ndq',
  Ndr = 'ndr',
  Nds = 'nds',
  Ndt = 'ndt',
  Ndu = 'ndu',
  Ndv = 'ndv',
  Ndw = 'ndw',
  Ndx = 'ndx',
  Ndy = 'ndy',
  Ndz = 'ndz',
  Nea = 'nea',
  Neb = 'neb',
  Nec = 'nec',
  Ned = 'ned',
  Nee = 'nee',
  Nef = 'nef',
  Neg = 'neg',
  Neh = 'neh',
  Nei = 'nei',
  Nej = 'nej',
  Nek = 'nek',
  Nem = 'nem',
  Nen = 'nen',
  Neo = 'neo',
  Nep = 'nep',
  Neq = 'neq',
  Ner = 'ner',
  Nes = 'nes',
  Net = 'net',
  Neu = 'neu',
  Nev = 'nev',
  New = 'new',
  Nex = 'nex',
  Ney = 'ney',
  Nez = 'nez',
  Nfa = 'nfa',
  Nfd = 'nfd',
  Nfl = 'nfl',
  Nfr = 'nfr',
  Nfu = 'nfu',
  Nga = 'nga',
  Ngb = 'ngb',
  Ngc = 'ngc',
  Ngd = 'ngd',
  Nge = 'nge',
  Ngg = 'ngg',
  Ngh = 'ngh',
  Ngi = 'ngi',
  Ngj = 'ngj',
  Ngk = 'ngk',
  Ngl = 'ngl',
  Ngm = 'ngm',
  Ngn = 'ngn',
  Ngo = 'ngo',
  Ngp = 'ngp',
  Ngq = 'ngq',
  Ngr = 'ngr',
  Ngs = 'ngs',
  Ngt = 'ngt',
  Ngu = 'ngu',
  Ngv = 'ngv',
  Ngw = 'ngw',
  Ngx = 'ngx',
  Ngy = 'ngy',
  Ngz = 'ngz',
  Nha = 'nha',
  Nhb = 'nhb',
  Nhc = 'nhc',
  Nhd = 'nhd',
  Nhe = 'nhe',
  Nhf = 'nhf',
  Nhg = 'nhg',
  Nhh = 'nhh',
  Nhi = 'nhi',
  Nhk = 'nhk',
  Nhm = 'nhm',
  Nhn = 'nhn',
  Nho = 'nho',
  Nhp = 'nhp',
  Nhq = 'nhq',
  Nhr = 'nhr',
  Nht = 'nht',
  Nhu = 'nhu',
  Nhv = 'nhv',
  Nhw = 'nhw',
  Nhx = 'nhx',
  Nhy = 'nhy',
  Nhz = 'nhz',
  Nia = 'nia',
  Nib = 'nib',
  Nid = 'nid',
  Nie = 'nie',
  Nif = 'nif',
  Nig = 'nig',
  Nih = 'nih',
  Nii = 'nii',
  Nij = 'nij',
  Nik = 'nik',
  Nil = 'nil',
  Nim = 'nim',
  Nin = 'nin',
  Nio = 'nio',
  Niq = 'niq',
  Nir = 'nir',
  Nis = 'nis',
  Nit = 'nit',
  Niu = 'niu',
  Niv = 'niv',
  Niw = 'niw',
  Nix = 'nix',
  Niy = 'niy',
  Niz = 'niz',
  Nja = 'nja',
  Njb = 'njb',
  Njd = 'njd',
  Njh = 'njh',
  Nji = 'nji',
  Njj = 'njj',
  Njl = 'njl',
  Njm = 'njm',
  Njn = 'njn',
  Njo = 'njo',
  Njr = 'njr',
  Njs = 'njs',
  Njt = 'njt',
  Nju = 'nju',
  Njx = 'njx',
  Njy = 'njy',
  Njz = 'njz',
  Nka = 'nka',
  Nkb = 'nkb',
  Nkc = 'nkc',
  Nkd = 'nkd',
  Nke = 'nke',
  Nkf = 'nkf',
  Nkg = 'nkg',
  Nkh = 'nkh',
  Nki = 'nki',
  Nkj = 'nkj',
  Nkk = 'nkk',
  Nkm = 'nkm',
  Nkn = 'nkn',
  Nko = 'nko',
  Nkp = 'nkp',
  Nkq = 'nkq',
  Nkr = 'nkr',
  Nks = 'nks',
  Nkt = 'nkt',
  Nku = 'nku',
  Nkv = 'nkv',
  Nkw = 'nkw',
  Nkx = 'nkx',
  Nkz = 'nkz',
  Nla = 'nla',
  Nlc = 'nlc',
  Nld = 'nld',
  Nle = 'nle',
  Nlg = 'nlg',
  Nli = 'nli',
  Nlj = 'nlj',
  Nlk = 'nlk',
  Nll = 'nll',
  Nlm = 'nlm',
  Nlo = 'nlo',
  Nlq = 'nlq',
  Nlu = 'nlu',
  Nlv = 'nlv',
  Nlw = 'nlw',
  Nlx = 'nlx',
  Nly = 'nly',
  Nlz = 'nlz',
  Nma = 'nma',
  Nmb = 'nmb',
  Nmc = 'nmc',
  Nmd = 'nmd',
  Nme = 'nme',
  Nmf = 'nmf',
  Nmg = 'nmg',
  Nmh = 'nmh',
  Nmi = 'nmi',
  Nmj = 'nmj',
  Nmk = 'nmk',
  Nml = 'nml',
  Nmm = 'nmm',
  Nmn = 'nmn',
  Nmo = 'nmo',
  Nmp = 'nmp',
  Nmq = 'nmq',
  Nmr = 'nmr',
  Nms = 'nms',
  Nmt = 'nmt',
  Nmu = 'nmu',
  Nmv = 'nmv',
  Nmw = 'nmw',
  Nmx = 'nmx',
  Nmy = 'nmy',
  Nmz = 'nmz',
  Nna = 'nna',
  Nnb = 'nnb',
  Nnc = 'nnc',
  Nnd = 'nnd',
  Nne = 'nne',
  Nnf = 'nnf',
  Nng = 'nng',
  Nnh = 'nnh',
  Nni = 'nni',
  Nnj = 'nnj',
  Nnk = 'nnk',
  Nnl = 'nnl',
  Nnm = 'nnm',
  Nnn = 'nnn',
  Nno = 'nno',
  Nnp = 'nnp',
  Nnq = 'nnq',
  Nnr = 'nnr',
  Nnt = 'nnt',
  Nnu = 'nnu',
  Nnv = 'nnv',
  Nnw = 'nnw',
  Nny = 'nny',
  Nnz = 'nnz',
  Noa = 'noa',
  Nob = 'nob',
  Noc = 'noc',
  Nod = 'nod',
  Noe = 'noe',
  Nof = 'nof',
  Nog = 'nog',
  Noh = 'noh',
  Noi = 'noi',
  Noj = 'noj',
  Nok = 'nok',
  Nol = 'nol',
  Nom = 'nom',
  Non = 'non',
  Nop = 'nop',
  Noq = 'noq',
  Nor = 'nor',
  Nos = 'nos',
  Not = 'not',
  Nou = 'nou',
  Nov = 'nov',
  Now = 'now',
  Noy = 'noy',
  Noz = 'noz',
  Npa = 'npa',
  Npb = 'npb',
  Npg = 'npg',
  Nph = 'nph',
  Npi = 'npi',
  Npl = 'npl',
  Npn = 'npn',
  Npo = 'npo',
  Nps = 'nps',
  Npu = 'npu',
  Npx = 'npx',
  Npy = 'npy',
  Nqg = 'nqg',
  Nqk = 'nqk',
  Nql = 'nql',
  Nqm = 'nqm',
  Nqn = 'nqn',
  Nqo = 'nqo',
  Nqq = 'nqq',
  Nqy = 'nqy',
  Nra = 'nra',
  Nrb = 'nrb',
  Nrc = 'nrc',
  Nre = 'nre',
  Nrf = 'nrf',
  Nrg = 'nrg',
  Nri = 'nri',
  Nrk = 'nrk',
  Nrl = 'nrl',
  Nrm = 'nrm',
  Nrn = 'nrn',
  Nrp = 'nrp',
  Nrr = 'nrr',
  Nrt = 'nrt',
  Nru = 'nru',
  Nrx = 'nrx',
  Nrz = 'nrz',
  Nsa = 'nsa',
  Nsb = 'nsb',
  Nsc = 'nsc',
  Nsd = 'nsd',
  Nse = 'nse',
  Nsf = 'nsf',
  Nsg = 'nsg',
  Nsh = 'nsh',
  Nsi = 'nsi',
  Nsk = 'nsk',
  Nsl = 'nsl',
  Nsm = 'nsm',
  Nsn = 'nsn',
  Nso = 'nso',
  Nsp = 'nsp',
  Nsq = 'nsq',
  Nsr = 'nsr',
  Nss = 'nss',
  Nst = 'nst',
  Nsu = 'nsu',
  Nsv = 'nsv',
  Nsw = 'nsw',
  Nsx = 'nsx',
  Nsy = 'nsy',
  Nsz = 'nsz',
  Ntd = 'ntd',
  Nte = 'nte',
  Ntg = 'ntg',
  Nti = 'nti',
  Ntj = 'ntj',
  Ntk = 'ntk',
  Ntm = 'ntm',
  Nto = 'nto',
  Ntp = 'ntp',
  Ntr = 'ntr',
  Ntu = 'ntu',
  Ntw = 'ntw',
  Ntx = 'ntx',
  Nty = 'nty',
  Ntz = 'ntz',
  Nua = 'nua',
  Nuc = 'nuc',
  Nud = 'nud',
  Nue = 'nue',
  Nuf = 'nuf',
  Nug = 'nug',
  Nuh = 'nuh',
  Nui = 'nui',
  Nuj = 'nuj',
  Nuk = 'nuk',
  Nul = 'nul',
  Num = 'num',
  Nun = 'nun',
  Nuo = 'nuo',
  Nup = 'nup',
  Nuq = 'nuq',
  Nur = 'nur',
  Nus = 'nus',
  Nut = 'nut',
  Nuu = 'nuu',
  Nuv = 'nuv',
  Nuw = 'nuw',
  Nux = 'nux',
  Nuy = 'nuy',
  Nuz = 'nuz',
  Nvh = 'nvh',
  Nvm = 'nvm',
  Nvo = 'nvo',
  Nwa = 'nwa',
  Nwb = 'nwb',
  Nwc = 'nwc',
  Nwe = 'nwe',
  Nwg = 'nwg',
  Nwi = 'nwi',
  Nwm = 'nwm',
  Nwo = 'nwo',
  Nwr = 'nwr',
  Nwx = 'nwx',
  Nwy = 'nwy',
  Nxa = 'nxa',
  Nxd = 'nxd',
  Nxe = 'nxe',
  Nxg = 'nxg',
  Nxi = 'nxi',
  Nxk = 'nxk',
  Nxl = 'nxl',
  Nxm = 'nxm',
  Nxn = 'nxn',
  Nxo = 'nxo',
  Nxq = 'nxq',
  Nxr = 'nxr',
  Nxx = 'nxx',
  Nya = 'nya',
  Nyb = 'nyb',
  Nyc = 'nyc',
  Nyd = 'nyd',
  Nye = 'nye',
  Nyf = 'nyf',
  Nyg = 'nyg',
  Nyh = 'nyh',
  Nyi = 'nyi',
  Nyj = 'nyj',
  Nyk = 'nyk',
  Nyl = 'nyl',
  Nym = 'nym',
  Nyn = 'nyn',
  Nyo = 'nyo',
  Nyp = 'nyp',
  Nyq = 'nyq',
  Nyr = 'nyr',
  Nys = 'nys',
  Nyt = 'nyt',
  Nyu = 'nyu',
  Nyv = 'nyv',
  Nyw = 'nyw',
  Nyx = 'nyx',
  Nyy = 'nyy',
  Nza = 'nza',
  Nzb = 'nzb',
  Nzd = 'nzd',
  Nzi = 'nzi',
  Nzk = 'nzk',
  Nzm = 'nzm',
  Nzs = 'nzs',
  Nzu = 'nzu',
  Nzy = 'nzy',
  Nzz = 'nzz',
  Oaa = 'oaa',
  Oac = 'oac',
  Oar = 'oar',
  Oav = 'oav',
  Obi = 'obi',
  Obk = 'obk',
  Obl = 'obl',
  Obm = 'obm',
  Obo = 'obo',
  Obr = 'obr',
  Obt = 'obt',
  Obu = 'obu',
  Oca = 'oca',
  Och = 'och',
  Oci = 'oci',
  Oco = 'oco',
  Ocu = 'ocu',
  Oda = 'oda',
  Odk = 'odk',
  Odt = 'odt',
  Odu = 'odu',
  Ofo = 'ofo',
  Ofs = 'ofs',
  Ofu = 'ofu',
  Ogb = 'ogb',
  Ogc = 'ogc',
  Oge = 'oge',
  Ogg = 'ogg',
  Ogo = 'ogo',
  Ogu = 'ogu',
  Oht = 'oht',
  Ohu = 'ohu',
  Oia = 'oia',
  Oin = 'oin',
  Ojb = 'ojb',
  Ojc = 'ojc',
  Ojg = 'ojg',
  Oji = 'oji',
  Ojp = 'ojp',
  Ojs = 'ojs',
  Ojv = 'ojv',
  Ojw = 'ojw',
  Oka = 'oka',
  Okb = 'okb',
  Okd = 'okd',
  Oke = 'oke',
  Okg = 'okg',
  Okh = 'okh',
  Oki = 'oki',
  Okj = 'okj',
  Okk = 'okk',
  Okl = 'okl',
  Okm = 'okm',
  Okn = 'okn',
  Oko = 'oko',
  Okr = 'okr',
  Oks = 'oks',
  Oku = 'oku',
  Okv = 'okv',
  Okx = 'okx',
  Ola = 'ola',
  Old = 'old',
  Ole = 'ole',
  Olk = 'olk',
  Olm = 'olm',
  Olo = 'olo',
  Olr = 'olr',
  Olt = 'olt',
  Olu = 'olu',
  Oma = 'oma',
  Omb = 'omb',
  Omc = 'omc',
  Omg = 'omg',
  Omi = 'omi',
  Omk = 'omk',
  Oml = 'oml',
  Omn = 'omn',
  Omo = 'omo',
  Omp = 'omp',
  Omr = 'omr',
  Omt = 'omt',
  Omu = 'omu',
  Omw = 'omw',
  Omx = 'omx',
  Ona = 'ona',
  Onb = 'onb',
  One = 'one',
  Ong = 'ong',
  Oni = 'oni',
  Onj = 'onj',
  Onk = 'onk',
  Onn = 'onn',
  Ono = 'ono',
  Onp = 'onp',
  Onr = 'onr',
  Ons = 'ons',
  Ont = 'ont',
  Onu = 'onu',
  Onw = 'onw',
  Onx = 'onx',
  Ood = 'ood',
  Oog = 'oog',
  Oon = 'oon',
  Oor = 'oor',
  Oos = 'oos',
  Opa = 'opa',
  Opk = 'opk',
  Opm = 'opm',
  Opo = 'opo',
  Opt = 'opt',
  Opy = 'opy',
  Ora = 'ora',
  Orc = 'orc',
  Ore = 'ore',
  Org = 'org',
  Orh = 'orh',
  Ori = 'ori',
  Orm = 'orm',
  Orn = 'orn',
  Oro = 'oro',
  Orr = 'orr',
  Ors = 'ors',
  Ort = 'ort',
  Oru = 'oru',
  Orv = 'orv',
  Orw = 'orw',
  Orx = 'orx',
  Ory = 'ory',
  Orz = 'orz',
  Osa = 'osa',
  Osc = 'osc',
  Osi = 'osi',
  Oso = 'oso',
  Osp = 'osp',
  Oss = 'oss',
  Ost = 'ost',
  Osu = 'osu',
  Osx = 'osx',
  Ota = 'ota',
  Otb = 'otb',
  Otd = 'otd',
  Ote = 'ote',
  Oti = 'oti',
  Otk = 'otk',
  Otl = 'otl',
  Otm = 'otm',
  Otn = 'otn',
  Otq = 'otq',
  Otr = 'otr',
  Ots = 'ots',
  Ott = 'ott',
  Otu = 'otu',
  Otw = 'otw',
  Otx = 'otx',
  Oty = 'oty',
  Otz = 'otz',
  Oua = 'oua',
  Oub = 'oub',
  Oue = 'oue',
  Oui = 'oui',
  Oum = 'oum',
  Ovd = 'ovd',
  Owi = 'owi',
  Owl = 'owl',
  Oyb = 'oyb',
  Oyd = 'oyd',
  Oym = 'oym',
  Oyy = 'oyy',
  Ozm = 'ozm',
  Pab = 'pab',
  Pac = 'pac',
  Pad = 'pad',
  Pae = 'pae',
  Paf = 'paf',
  Pag = 'pag',
  Pah = 'pah',
  Pai = 'pai',
  Pak = 'pak',
  Pal = 'pal',
  Pam = 'pam',
  Pan = 'pan',
  Pao = 'pao',
  Pap = 'pap',
  Paq = 'paq',
  Par = 'par',
  Pas = 'pas',
  Pat = 'pat',
  Pau = 'pau',
  Pav = 'pav',
  Paw = 'paw',
  Pax = 'pax',
  Pay = 'pay',
  Paz = 'paz',
  Pbb = 'pbb',
  Pbc = 'pbc',
  Pbe = 'pbe',
  Pbf = 'pbf',
  Pbg = 'pbg',
  Pbh = 'pbh',
  Pbi = 'pbi',
  Pbl = 'pbl',
  Pbm = 'pbm',
  Pbn = 'pbn',
  Pbo = 'pbo',
  Pbp = 'pbp',
  Pbr = 'pbr',
  Pbs = 'pbs',
  Pbt = 'pbt',
  Pbu = 'pbu',
  Pbv = 'pbv',
  Pby = 'pby',
  Pca = 'pca',
  Pcb = 'pcb',
  Pcc = 'pcc',
  Pcd = 'pcd',
  Pce = 'pce',
  Pcf = 'pcf',
  Pcg = 'pcg',
  Pch = 'pch',
  Pci = 'pci',
  Pcj = 'pcj',
  Pck = 'pck',
  Pcl = 'pcl',
  Pcm = 'pcm',
  Pcn = 'pcn',
  Pcp = 'pcp',
  Pcw = 'pcw',
  Pda = 'pda',
  Pdc = 'pdc',
  Pdi = 'pdi',
  Pdn = 'pdn',
  Pdo = 'pdo',
  Pdt = 'pdt',
  Pdu = 'pdu',
  Pea = 'pea',
  Peb = 'peb',
  Ped = 'ped',
  Pee = 'pee',
  Pef = 'pef',
  Peg = 'peg',
  Peh = 'peh',
  Pei = 'pei',
  Pej = 'pej',
  Pek = 'pek',
  Pel = 'pel',
  Pem = 'pem',
  Peo = 'peo',
  Pep = 'pep',
  Peq = 'peq',
  Pes = 'pes',
  Pev = 'pev',
  Pex = 'pex',
  Pey = 'pey',
  Pez = 'pez',
  Pfa = 'pfa',
  Pfe = 'pfe',
  Pfl = 'pfl',
  Pga = 'pga',
  Pgd = 'pgd',
  Pgg = 'pgg',
  Pgi = 'pgi',
  Pgk = 'pgk',
  Pgl = 'pgl',
  Pgn = 'pgn',
  Pgs = 'pgs',
  Pgu = 'pgu',
  Pgz = 'pgz',
  Pha = 'pha',
  Phd = 'phd',
  Phg = 'phg',
  Phh = 'phh',
  Phk = 'phk',
  Phl = 'phl',
  Phm = 'phm',
  Phn = 'phn',
  Pho = 'pho',
  Phq = 'phq',
  Phr = 'phr',
  Pht = 'pht',
  Phu = 'phu',
  Phv = 'phv',
  Phw = 'phw',
  Pia = 'pia',
  Pib = 'pib',
  Pic = 'pic',
  Pid = 'pid',
  Pie = 'pie',
  Pif = 'pif',
  Pig = 'pig',
  Pih = 'pih',
  Pii = 'pii',
  Pij = 'pij',
  Pil = 'pil',
  Pim = 'pim',
  Pin = 'pin',
  Pio = 'pio',
  Pip = 'pip',
  Pir = 'pir',
  Pis = 'pis',
  Pit = 'pit',
  Piu = 'piu',
  Piv = 'piv',
  Piw = 'piw',
  Pix = 'pix',
  Piy = 'piy',
  Piz = 'piz',
  Pjt = 'pjt',
  Pka = 'pka',
  Pkb = 'pkb',
  Pkc = 'pkc',
  Pkg = 'pkg',
  Pkh = 'pkh',
  Pkn = 'pkn',
  Pko = 'pko',
  Pkp = 'pkp',
  Pkr = 'pkr',
  Pks = 'pks',
  Pkt = 'pkt',
  Pku = 'pku',
  Pla = 'pla',
  Plb = 'plb',
  Plc = 'plc',
  Pld = 'pld',
  Ple = 'ple',
  Plg = 'plg',
  Plh = 'plh',
  Pli = 'pli',
  Plj = 'plj',
  Plk = 'plk',
  Pll = 'pll',
  Pln = 'pln',
  Plo = 'plo',
  Plq = 'plq',
  Plr = 'plr',
  Pls = 'pls',
  Plt = 'plt',
  Plu = 'plu',
  Plv = 'plv',
  Plw = 'plw',
  Ply = 'ply',
  Plz = 'plz',
  Pma = 'pma',
  Pmb = 'pmb',
  Pmd = 'pmd',
  Pme = 'pme',
  Pmf = 'pmf',
  Pmh = 'pmh',
  Pmi = 'pmi',
  Pmj = 'pmj',
  Pmk = 'pmk',
  Pml = 'pml',
  Pmm = 'pmm',
  Pmn = 'pmn',
  Pmo = 'pmo',
  Pmq = 'pmq',
  Pmr = 'pmr',
  Pms = 'pms',
  Pmt = 'pmt',
  Pmw = 'pmw',
  Pmx = 'pmx',
  Pmy = 'pmy',
  Pmz = 'pmz',
  Pna = 'pna',
  Pnb = 'pnb',
  Pnc = 'pnc',
  Pnd = 'pnd',
  Pne = 'pne',
  Png = 'png',
  Pnh = 'pnh',
  Pni = 'pni',
  Pnj = 'pnj',
  Pnk = 'pnk',
  Pnl = 'pnl',
  Pnm = 'pnm',
  Pnn = 'pnn',
  Pno = 'pno',
  Pnp = 'pnp',
  Pnq = 'pnq',
  Pnr = 'pnr',
  Pns = 'pns',
  Pnt = 'pnt',
  Pnu = 'pnu',
  Pnv = 'pnv',
  Pnw = 'pnw',
  Pnx = 'pnx',
  Pny = 'pny',
  Pnz = 'pnz',
  Poc = 'poc',
  Poe = 'poe',
  Pof = 'pof',
  Pog = 'pog',
  Poh = 'poh',
  Poi = 'poi',
  Pok = 'pok',
  Pol = 'pol',
  Pom = 'pom',
  Pon = 'pon',
  Poo = 'poo',
  Pop = 'pop',
  Poq = 'poq',
  Por = 'por',
  Pos = 'pos',
  Pot = 'pot',
  Pov = 'pov',
  Pow = 'pow',
  Pox = 'pox',
  Poy = 'poy',
  Ppe = 'ppe',
  Ppi = 'ppi',
  Ppk = 'ppk',
  Ppl = 'ppl',
  Ppm = 'ppm',
  Ppn = 'ppn',
  Ppo = 'ppo',
  Ppp = 'ppp',
  Ppq = 'ppq',
  Pps = 'pps',
  Ppt = 'ppt',
  Ppu = 'ppu',
  Pqa = 'pqa',
  Pqm = 'pqm',
  Prc = 'prc',
  Prd = 'prd',
  Pre = 'pre',
  Prf = 'prf',
  Prg = 'prg',
  Prh = 'prh',
  Pri = 'pri',
  Prk = 'prk',
  Prl = 'prl',
  Prm = 'prm',
  Prn = 'prn',
  Pro = 'pro',
  Prp = 'prp',
  Prq = 'prq',
  Prr = 'prr',
  Prs = 'prs',
  Prt = 'prt',
  Pru = 'pru',
  Prw = 'prw',
  Prx = 'prx',
  Prz = 'prz',
  Psa = 'psa',
  Psc = 'psc',
  Psd = 'psd',
  Pse = 'pse',
  Psg = 'psg',
  Psh = 'psh',
  Psi = 'psi',
  Psl = 'psl',
  Psm = 'psm',
  Psn = 'psn',
  Pso = 'pso',
  Psp = 'psp',
  Psq = 'psq',
  Psr = 'psr',
  Pss = 'pss',
  Pst = 'pst',
  Psu = 'psu',
  Psw = 'psw',
  Psy = 'psy',
  Pta = 'pta',
  Pth = 'pth',
  Pti = 'pti',
  Ptn = 'ptn',
  Pto = 'pto',
  Ptp = 'ptp',
  Ptq = 'ptq',
  Ptr = 'ptr',
  Ptt = 'ptt',
  Ptu = 'ptu',
  Ptv = 'ptv',
  Ptw = 'ptw',
  Pty = 'pty',
  Pua = 'pua',
  Pub = 'pub',
  Puc = 'puc',
  Pud = 'pud',
  Pue = 'pue',
  Puf = 'puf',
  Pug = 'pug',
  Pui = 'pui',
  Puj = 'puj',
  Pum = 'pum',
  Puo = 'puo',
  Pup = 'pup',
  Puq = 'puq',
  Pur = 'pur',
  Pus = 'pus',
  Put = 'put',
  Puu = 'puu',
  Puw = 'puw',
  Pux = 'pux',
  Puy = 'puy',
  Pwa = 'pwa',
  Pwb = 'pwb',
  Pwg = 'pwg',
  Pwi = 'pwi',
  Pwm = 'pwm',
  Pwn = 'pwn',
  Pwo = 'pwo',
  Pwr = 'pwr',
  Pww = 'pww',
  Pxm = 'pxm',
  Pye = 'pye',
  Pym = 'pym',
  Pyn = 'pyn',
  Pys = 'pys',
  Pyu = 'pyu',
  Pyx = 'pyx',
  Pyy = 'pyy',
  Pzn = 'pzn',
  Qua = 'qua',
  Qub = 'qub',
  Quc = 'quc',
  Qud = 'qud',
  Que = 'que',
  Quf = 'quf',
  Qug = 'qug',
  Quh = 'quh',
  Qui = 'qui',
  Quk = 'quk',
  Qul = 'qul',
  Qum = 'qum',
  Qun = 'qun',
  Qup = 'qup',
  Quq = 'quq',
  Qur = 'qur',
  Qus = 'qus',
  Quv = 'quv',
  Quw = 'quw',
  Qux = 'qux',
  Quy = 'quy',
  Quz = 'quz',
  Qva = 'qva',
  Qvc = 'qvc',
  Qve = 'qve',
  Qvh = 'qvh',
  Qvi = 'qvi',
  Qvj = 'qvj',
  Qvl = 'qvl',
  Qvm = 'qvm',
  Qvn = 'qvn',
  Qvo = 'qvo',
  Qvp = 'qvp',
  Qvs = 'qvs',
  Qvw = 'qvw',
  Qvy = 'qvy',
  Qvz = 'qvz',
  Qwa = 'qwa',
  Qwc = 'qwc',
  Qwh = 'qwh',
  Qwm = 'qwm',
  Qws = 'qws',
  Qwt = 'qwt',
  Qxa = 'qxa',
  Qxc = 'qxc',
  Qxh = 'qxh',
  Qxl = 'qxl',
  Qxn = 'qxn',
  Qxo = 'qxo',
  Qxp = 'qxp',
  Qxq = 'qxq',
  Qxr = 'qxr',
  Qxs = 'qxs',
  Qxt = 'qxt',
  Qxu = 'qxu',
  Qxw = 'qxw',
  Qya = 'qya',
  Qyp = 'qyp',
  Raa = 'raa',
  Rab = 'rab',
  Rac = 'rac',
  Rad = 'rad',
  Raf = 'raf',
  Rag = 'rag',
  Rah = 'rah',
  Rai = 'rai',
  Raj = 'raj',
  Rak = 'rak',
  Ral = 'ral',
  Ram = 'ram',
  Ran = 'ran',
  Rao = 'rao',
  Rap = 'rap',
  Raq = 'raq',
  Rar = 'rar',
  Ras = 'ras',
  Rat = 'rat',
  Rau = 'rau',
  Rav = 'rav',
  Raw = 'raw',
  Rax = 'rax',
  Ray = 'ray',
  Raz = 'raz',
  Rbb = 'rbb',
  Rbk = 'rbk',
  Rbl = 'rbl',
  Rbp = 'rbp',
  Rcf = 'rcf',
  Rdb = 'rdb',
  Rea = 'rea',
  Reb = 'reb',
  Ree = 'ree',
  Reg = 'reg',
  Rei = 'rei',
  Rej = 'rej',
  Rel = 'rel',
  Rem = 'rem',
  Ren = 'ren',
  Rer = 'rer',
  Res = 'res',
  Ret = 'ret',
  Rey = 'rey',
  Rga = 'rga',
  Rge = 'rge',
  Rgk = 'rgk',
  Rgn = 'rgn',
  Rgr = 'rgr',
  Rgs = 'rgs',
  Rgu = 'rgu',
  Rhg = 'rhg',
  Rhp = 'rhp',
  Ria = 'ria',
  Rif = 'rif',
  Ril = 'ril',
  Rim = 'rim',
  Rin = 'rin',
  Rir = 'rir',
  Rit = 'rit',
  Riu = 'riu',
  Rjg = 'rjg',
  Rji = 'rji',
  Rjs = 'rjs',
  Rka = 'rka',
  Rkb = 'rkb',
  Rkh = 'rkh',
  Rki = 'rki',
  Rkm = 'rkm',
  Rkt = 'rkt',
  Rkw = 'rkw',
  Rma = 'rma',
  Rmb = 'rmb',
  Rmc = 'rmc',
  Rmd = 'rmd',
  Rme = 'rme',
  Rmf = 'rmf',
  Rmg = 'rmg',
  Rmh = 'rmh',
  Rmi = 'rmi',
  Rmk = 'rmk',
  Rml = 'rml',
  Rmm = 'rmm',
  Rmn = 'rmn',
  Rmo = 'rmo',
  Rmp = 'rmp',
  Rmq = 'rmq',
  Rms = 'rms',
  Rmt = 'rmt',
  Rmu = 'rmu',
  Rmv = 'rmv',
  Rmw = 'rmw',
  Rmx = 'rmx',
  Rmy = 'rmy',
  Rmz = 'rmz',
  Rnd = 'rnd',
  Rng = 'rng',
  Rnl = 'rnl',
  Rnn = 'rnn',
  Rnp = 'rnp',
  Rnr = 'rnr',
  Rnw = 'rnw',
  Rob = 'rob',
  Roc = 'roc',
  Rod = 'rod',
  Roe = 'roe',
  Rof = 'rof',
  Rog = 'rog',
  Roh = 'roh',
  Rol = 'rol',
  Rom = 'rom',
  Ron = 'ron',
  Roo = 'roo',
  Rop = 'rop',
  Ror = 'ror',
  Rou = 'rou',
  Row = 'row',
  Rpn = 'rpn',
  Rpt = 'rpt',
  Rri = 'rri',
  Rro = 'rro',
  Rrt = 'rrt',
  Rsb = 'rsb',
  Rsl = 'rsl',
  Rsm = 'rsm',
  Rtc = 'rtc',
  Rth = 'rth',
  Rtm = 'rtm',
  Rts = 'rts',
  Rtw = 'rtw',
  Rub = 'rub',
  Ruc = 'ruc',
  Rue = 'rue',
  Ruf = 'ruf',
  Rug = 'rug',
  Ruh = 'ruh',
  Rui = 'rui',
  Ruk = 'ruk',
  Run = 'run',
  Ruo = 'ruo',
  Rup = 'rup',
  Ruq = 'ruq',
  Rus = 'rus',
  Rut = 'rut',
  Ruu = 'ruu',
  Ruy = 'ruy',
  Ruz = 'ruz',
  Rwa = 'rwa',
  Rwk = 'rwk',
  Rwm = 'rwm',
  Rwo = 'rwo',
  Rwr = 'rwr',
  Rxd = 'rxd',
  Rxw = 'rxw',
  Ryn = 'ryn',
  Rys = 'rys',
  Ryu = 'ryu',
  Rzh = 'rzh',
  Saa = 'saa',
  Sab = 'sab',
  Sac = 'sac',
  Sad = 'sad',
  Sae = 'sae',
  Saf = 'saf',
  Sag = 'sag',
  Sah = 'sah',
  Saj = 'saj',
  Sak = 'sak',
  Sam = 'sam',
  San = 'san',
  Sao = 'sao',
  Saq = 'saq',
  Sar = 'sar',
  Sas = 'sas',
  Sat = 'sat',
  Sau = 'sau',
  Sav = 'sav',
  Saw = 'saw',
  Sax = 'sax',
  Say = 'say',
  Saz = 'saz',
  Sba = 'sba',
  Sbb = 'sbb',
  Sbc = 'sbc',
  Sbd = 'sbd',
  Sbe = 'sbe',
  Sbf = 'sbf',
  Sbg = 'sbg',
  Sbh = 'sbh',
  Sbi = 'sbi',
  Sbj = 'sbj',
  Sbk = 'sbk',
  Sbl = 'sbl',
  Sbm = 'sbm',
  Sbn = 'sbn',
  Sbo = 'sbo',
  Sbp = 'sbp',
  Sbq = 'sbq',
  Sbr = 'sbr',
  Sbs = 'sbs',
  Sbt = 'sbt',
  Sbu = 'sbu',
  Sbv = 'sbv',
  Sbw = 'sbw',
  Sbx = 'sbx',
  Sby = 'sby',
  Sbz = 'sbz',
  Scb = 'scb',
  Sce = 'sce',
  Scf = 'scf',
  Scg = 'scg',
  Sch = 'sch',
  Sci = 'sci',
  Sck = 'sck',
  Scl = 'scl',
  Scn = 'scn',
  Sco = 'sco',
  Scp = 'scp',
  Scq = 'scq',
  Scs = 'scs',
  Sct = 'sct',
  Scu = 'scu',
  Scv = 'scv',
  Scw = 'scw',
  Scx = 'scx',
  Sda = 'sda',
  Sdb = 'sdb',
  Sdc = 'sdc',
  Sde = 'sde',
  Sdf = 'sdf',
  Sdg = 'sdg',
  Sdh = 'sdh',
  Sdj = 'sdj',
  Sdk = 'sdk',
  Sdl = 'sdl',
  Sdn = 'sdn',
  Sdo = 'sdo',
  Sdp = 'sdp',
  Sdq = 'sdq',
  Sdr = 'sdr',
  Sds = 'sds',
  Sdt = 'sdt',
  Sdu = 'sdu',
  Sdx = 'sdx',
  Sdz = 'sdz',
  Sea = 'sea',
  Seb = 'seb',
  Sec = 'sec',
  Sed = 'sed',
  See = 'see',
  Sef = 'sef',
  Seg = 'seg',
  Seh = 'seh',
  Sei = 'sei',
  Sej = 'sej',
  Sek = 'sek',
  Sel = 'sel',
  Sen = 'sen',
  Seo = 'seo',
  Sep = 'sep',
  Seq = 'seq',
  Ser = 'ser',
  Ses = 'ses',
  Set = 'set',
  Seu = 'seu',
  Sev = 'sev',
  Sew = 'sew',
  Sey = 'sey',
  Sez = 'sez',
  Sfb = 'sfb',
  Sfe = 'sfe',
  Sfm = 'sfm',
  Sfs = 'sfs',
  Sfw = 'sfw',
  Sga = 'sga',
  Sgb = 'sgb',
  Sgc = 'sgc',
  Sgd = 'sgd',
  Sge = 'sge',
  Sgg = 'sgg',
  Sgh = 'sgh',
  Sgi = 'sgi',
  Sgj = 'sgj',
  Sgk = 'sgk',
  Sgm = 'sgm',
  Sgp = 'sgp',
  Sgr = 'sgr',
  Sgs = 'sgs',
  Sgt = 'sgt',
  Sgu = 'sgu',
  Sgw = 'sgw',
  Sgx = 'sgx',
  Sgy = 'sgy',
  Sgz = 'sgz',
  Sha = 'sha',
  Shb = 'shb',
  Shc = 'shc',
  Shd = 'shd',
  She = 'she',
  Shg = 'shg',
  Shh = 'shh',
  Shi = 'shi',
  Shj = 'shj',
  Shk = 'shk',
  Shl = 'shl',
  Shm = 'shm',
  Shn = 'shn',
  Sho = 'sho',
  Shp = 'shp',
  Shq = 'shq',
  Shr = 'shr',
  Shs = 'shs',
  Sht = 'sht',
  Shu = 'shu',
  Shv = 'shv',
  Shw = 'shw',
  Shx = 'shx',
  Shy = 'shy',
  Shz = 'shz',
  Sia = 'sia',
  Sib = 'sib',
  Sid = 'sid',
  Sie = 'sie',
  Sif = 'sif',
  Sig = 'sig',
  Sih = 'sih',
  Sii = 'sii',
  Sij = 'sij',
  Sik = 'sik',
  Sil = 'sil',
  Sim = 'sim',
  Sin = 'sin',
  Sip = 'sip',
  Siq = 'siq',
  Sir = 'sir',
  Sis = 'sis',
  Siu = 'siu',
  Siv = 'siv',
  Siw = 'siw',
  Six = 'six',
  Siy = 'siy',
  Siz = 'siz',
  Sja = 'sja',
  Sjb = 'sjb',
  Sjd = 'sjd',
  Sje = 'sje',
  Sjg = 'sjg',
  Sjk = 'sjk',
  Sjl = 'sjl',
  Sjm = 'sjm',
  Sjn = 'sjn',
  Sjo = 'sjo',
  Sjp = 'sjp',
  Sjr = 'sjr',
  Sjs = 'sjs',
  Sjt = 'sjt',
  Sju = 'sju',
  Sjw = 'sjw',
  Ska = 'ska',
  Skb = 'skb',
  Skc = 'skc',
  Skd = 'skd',
  Ske = 'ske',
  Skf = 'skf',
  Skg = 'skg',
  Skh = 'skh',
  Ski = 'ski',
  Skj = 'skj',
  Skm = 'skm',
  Skn = 'skn',
  Sko = 'sko',
  Skp = 'skp',
  Skq = 'skq',
  Skr = 'skr',
  Sks = 'sks',
  Skt = 'skt',
  Sku = 'sku',
  Skv = 'skv',
  Skw = 'skw',
  Skx = 'skx',
  Sky = 'sky',
  Skz = 'skz',
  Slc = 'slc',
  Sld = 'sld',
  Sle = 'sle',
  Slf = 'slf',
  Slg = 'slg',
  Slh = 'slh',
  Sli = 'sli',
  Slj = 'slj',
  Slk = 'slk',
  Sll = 'sll',
  Slm = 'slm',
  Sln = 'sln',
  Slp = 'slp',
  Slq = 'slq',
  Slr = 'slr',
  Sls = 'sls',
  Slt = 'slt',
  Slu = 'slu',
  Slv = 'slv',
  Slw = 'slw',
  Slx = 'slx',
  Sly = 'sly',
  Slz = 'slz',
  Sma = 'sma',
  Smb = 'smb',
  Smc = 'smc',
  Smd = 'smd',
  Sme = 'sme',
  Smf = 'smf',
  Smg = 'smg',
  Smh = 'smh',
  Smj = 'smj',
  Smk = 'smk',
  Sml = 'sml',
  Smm = 'smm',
  Smn = 'smn',
  Smo = 'smo',
  Smp = 'smp',
  Smq = 'smq',
  Smr = 'smr',
  Sms = 'sms',
  Smt = 'smt',
  Smu = 'smu',
  Smv = 'smv',
  Smw = 'smw',
  Smx = 'smx',
  Smy = 'smy',
  Smz = 'smz',
  Sna = 'sna',
  Snb = 'snb',
  Snc = 'snc',
  Snd = 'snd',
  Sne = 'sne',
  Snf = 'snf',
  Sng = 'sng',
  Sni = 'sni',
  Snj = 'snj',
  Snk = 'snk',
  Snl = 'snl',
  Snm = 'snm',
  Snn = 'snn',
  Sno = 'sno',
  Snp = 'snp',
  Snq = 'snq',
  Snr = 'snr',
  Sns = 'sns',
  Snu = 'snu',
  Snv = 'snv',
  Snw = 'snw',
  Snx = 'snx',
  Sny = 'sny',
  Snz = 'snz',
  Soa = 'soa',
  Sob = 'sob',
  Soc = 'soc',
  Sod = 'sod',
  Soe = 'soe',
  Sog = 'sog',
  Soh = 'soh',
  Soi = 'soi',
  Soj = 'soj',
  Sok = 'sok',
  Sol = 'sol',
  Som = 'som',
  Soo = 'soo',
  Sop = 'sop',
  Soq = 'soq',
  Sor = 'sor',
  Sos = 'sos',
  Sot = 'sot',
  Sou = 'sou',
  Sov = 'sov',
  Sow = 'sow',
  Sox = 'sox',
  Soy = 'soy',
  Soz = 'soz',
  Spa = 'spa',
  Spb = 'spb',
  Spc = 'spc',
  Spd = 'spd',
  Spe = 'spe',
  Spg = 'spg',
  Spi = 'spi',
  Spk = 'spk',
  Spl = 'spl',
  Spm = 'spm',
  Spn = 'spn',
  Spo = 'spo',
  Spp = 'spp',
  Spq = 'spq',
  Spr = 'spr',
  Sps = 'sps',
  Spt = 'spt',
  Spu = 'spu',
  Spv = 'spv',
  Spx = 'spx',
  Spy = 'spy',
  Sqa = 'sqa',
  Sqh = 'sqh',
  Sqi = 'sqi',
  Sqk = 'sqk',
  Sqm = 'sqm',
  Sqn = 'sqn',
  Sqo = 'sqo',
  Sqq = 'sqq',
  Sqr = 'sqr',
  Sqs = 'sqs',
  Sqt = 'sqt',
  Squ = 'squ',
  Sra = 'sra',
  Srb = 'srb',
  Src = 'src',
  Srd = 'srd',
  Sre = 'sre',
  Srf = 'srf',
  Srg = 'srg',
  Srh = 'srh',
  Sri = 'sri',
  Srk = 'srk',
  Srl = 'srl',
  Srm = 'srm',
  Srn = 'srn',
  Sro = 'sro',
  Srp = 'srp',
  Srq = 'srq',
  Srr = 'srr',
  Srs = 'srs',
  Srt = 'srt',
  Sru = 'sru',
  Srv = 'srv',
  Srw = 'srw',
  Srx = 'srx',
  Sry = 'sry',
  Srz = 'srz',
  Ssb = 'ssb',
  Ssc = 'ssc',
  Ssd = 'ssd',
  Sse = 'sse',
  Ssf = 'ssf',
  Ssg = 'ssg',
  Ssh = 'ssh',
  Ssi = 'ssi',
  Ssj = 'ssj',
  Ssk = 'ssk',
  Ssl = 'ssl',
  Ssm = 'ssm',
  Ssn = 'ssn',
  Sso = 'sso',
  Ssp = 'ssp',
  Ssq = 'ssq',
  Ssr = 'ssr',
  Sss = 'sss',
  Sst = 'sst',
  Ssu = 'ssu',
  Ssv = 'ssv',
  Ssw = 'ssw',
  Ssx = 'ssx',
  Ssy = 'ssy',
  Ssz = 'ssz',
  Sta = 'sta',
  Stb = 'stb',
  Std = 'std',
  Ste = 'ste',
  Stf = 'stf',
  Stg = 'stg',
  Sth = 'sth',
  Sti = 'sti',
  Stj = 'stj',
  Stk = 'stk',
  Stl = 'stl',
  Stm = 'stm',
  Stn = 'stn',
  Sto = 'sto',
  Stp = 'stp',
  Stq = 'stq',
  Str = 'str',
  Sts = 'sts',
  Stt = 'stt',
  Stu = 'stu',
  Stv = 'stv',
  Stw = 'stw',
  Sty = 'sty',
  Sua = 'sua',
  Sub = 'sub',
  Suc = 'suc',
  Sue = 'sue',
  Sug = 'sug',
  Sui = 'sui',
  Suj = 'suj',
  Suk = 'suk',
  Sun = 'sun',
  Suq = 'suq',
  Sur = 'sur',
  Sus = 'sus',
  Sut = 'sut',
  Suv = 'suv',
  Suw = 'suw',
  Sux = 'sux',
  Suy = 'suy',
  Suz = 'suz',
  Sva = 'sva',
  Svb = 'svb',
  Svc = 'svc',
  Sve = 'sve',
  Svk = 'svk',
  Svm = 'svm',
  Svs = 'svs',
  Svx = 'svx',
  Swa = 'swa',
  Swb = 'swb',
  Swc = 'swc',
  Swe = 'swe',
  Swf = 'swf',
  Swg = 'swg',
  Swh = 'swh',
  Swi = 'swi',
  Swj = 'swj',
  Swk = 'swk',
  Swl = 'swl',
  Swm = 'swm',
  Swn = 'swn',
  Swo = 'swo',
  Swp = 'swp',
  Swq = 'swq',
  Swr = 'swr',
  Sws = 'sws',
  Swt = 'swt',
  Swu = 'swu',
  Swv = 'swv',
  Sww = 'sww',
  Swx = 'swx',
  Swy = 'swy',
  Sxb = 'sxb',
  Sxc = 'sxc',
  Sxe = 'sxe',
  Sxg = 'sxg',
  Sxk = 'sxk',
  Sxl = 'sxl',
  Sxm = 'sxm',
  Sxn = 'sxn',
  Sxo = 'sxo',
  Sxr = 'sxr',
  Sxs = 'sxs',
  Sxu = 'sxu',
  Sxw = 'sxw',
  Sya = 'sya',
  Syb = 'syb',
  Syc = 'syc',
  Syi = 'syi',
  Syk = 'syk',
  Syl = 'syl',
  Sym = 'sym',
  Syn = 'syn',
  Syo = 'syo',
  Syr = 'syr',
  Sys = 'sys',
  Syw = 'syw',
  Syx = 'syx',
  Syy = 'syy',
  Sza = 'sza',
  Szb = 'szb',
  Szc = 'szc',
  Szd = 'szd',
  Sze = 'sze',
  Szg = 'szg',
  Szl = 'szl',
  Szn = 'szn',
  Szp = 'szp',
  Szs = 'szs',
  Szv = 'szv',
  Szw = 'szw',
  Szy = 'szy',
  Taa = 'taa',
  Tab = 'tab',
  Tac = 'tac',
  Tad = 'tad',
  Tae = 'tae',
  Taf = 'taf',
  Tag = 'tag',
  Tah = 'tah',
  Taj = 'taj',
  Tak = 'tak',
  Tal = 'tal',
  Tam = 'tam',
  Tan = 'tan',
  Tao = 'tao',
  Tap = 'tap',
  Taq = 'taq',
  Tar = 'tar',
  Tas = 'tas',
  Tat = 'tat',
  Tau = 'tau',
  Tav = 'tav',
  Taw = 'taw',
  Tax = 'tax',
  Tay = 'tay',
  Taz = 'taz',
  Tba = 'tba',
  Tbc = 'tbc',
  Tbd = 'tbd',
  Tbe = 'tbe',
  Tbf = 'tbf',
  Tbg = 'tbg',
  Tbh = 'tbh',
  Tbi = 'tbi',
  Tbj = 'tbj',
  Tbk = 'tbk',
  Tbl = 'tbl',
  Tbm = 'tbm',
  Tbn = 'tbn',
  Tbo = 'tbo',
  Tbp = 'tbp',
  Tbr = 'tbr',
  Tbs = 'tbs',
  Tbt = 'tbt',
  Tbu = 'tbu',
  Tbv = 'tbv',
  Tbw = 'tbw',
  Tbx = 'tbx',
  Tby = 'tby',
  Tbz = 'tbz',
  Tca = 'tca',
  Tcb = 'tcb',
  Tcc = 'tcc',
  Tcd = 'tcd',
  Tce = 'tce',
  Tcf = 'tcf',
  Tcg = 'tcg',
  Tch = 'tch',
  Tci = 'tci',
  Tck = 'tck',
  Tcl = 'tcl',
  Tcm = 'tcm',
  Tcn = 'tcn',
  Tco = 'tco',
  Tcp = 'tcp',
  Tcq = 'tcq',
  Tcs = 'tcs',
  Tct = 'tct',
  Tcu = 'tcu',
  Tcw = 'tcw',
  Tcx = 'tcx',
  Tcy = 'tcy',
  Tcz = 'tcz',
  Tda = 'tda',
  Tdb = 'tdb',
  Tdc = 'tdc',
  Tdd = 'tdd',
  Tde = 'tde',
  Tdf = 'tdf',
  Tdg = 'tdg',
  Tdh = 'tdh',
  Tdi = 'tdi',
  Tdj = 'tdj',
  Tdk = 'tdk',
  Tdl = 'tdl',
  Tdm = 'tdm',
  Tdn = 'tdn',
  Tdo = 'tdo',
  Tdq = 'tdq',
  Tdr = 'tdr',
  Tds = 'tds',
  Tdt = 'tdt',
  Tdv = 'tdv',
  Tdx = 'tdx',
  Tdy = 'tdy',
  Tea = 'tea',
  Teb = 'teb',
  Tec = 'tec',
  Ted = 'ted',
  Tee = 'tee',
  Tef = 'tef',
  Teg = 'teg',
  Teh = 'teh',
  Tei = 'tei',
  Tek = 'tek',
  Tel = 'tel',
  Tem = 'tem',
  Ten = 'ten',
  Teo = 'teo',
  Tep = 'tep',
  Teq = 'teq',
  Ter = 'ter',
  Tes = 'tes',
  Tet = 'tet',
  Teu = 'teu',
  Tev = 'tev',
  Tew = 'tew',
  Tex = 'tex',
  Tey = 'tey',
  Tez = 'tez',
  Tfi = 'tfi',
  Tfn = 'tfn',
  Tfo = 'tfo',
  Tfr = 'tfr',
  Tft = 'tft',
  Tga = 'tga',
  Tgb = 'tgb',
  Tgc = 'tgc',
  Tgd = 'tgd',
  Tge = 'tge',
  Tgf = 'tgf',
  Tgh = 'tgh',
  Tgi = 'tgi',
  Tgj = 'tgj',
  Tgk = 'tgk',
  Tgl = 'tgl',
  Tgn = 'tgn',
  Tgo = 'tgo',
  Tgp = 'tgp',
  Tgq = 'tgq',
  Tgr = 'tgr',
  Tgs = 'tgs',
  Tgt = 'tgt',
  Tgu = 'tgu',
  Tgv = 'tgv',
  Tgw = 'tgw',
  Tgx = 'tgx',
  Tgy = 'tgy',
  Tgz = 'tgz',
  Tha = 'tha',
  Thd = 'thd',
  The = 'the',
  Thf = 'thf',
  Thh = 'thh',
  Thi = 'thi',
  Thk = 'thk',
  Thl = 'thl',
  Thm = 'thm',
  Thn = 'thn',
  Thp = 'thp',
  Thq = 'thq',
  Thr = 'thr',
  Ths = 'ths',
  Tht = 'tht',
  Thu = 'thu',
  Thv = 'thv',
  Thy = 'thy',
  Thz = 'thz',
  Tia = 'tia',
  Tic = 'tic',
  Tif = 'tif',
  Tig = 'tig',
  Tih = 'tih',
  Tii = 'tii',
  Tij = 'tij',
  Tik = 'tik',
  Til = 'til',
  Tim = 'tim',
  Tin = 'tin',
  Tio = 'tio',
  Tip = 'tip',
  Tiq = 'tiq',
  Tir = 'tir',
  Tis = 'tis',
  Tit = 'tit',
  Tiu = 'tiu',
  Tiv = 'tiv',
  Tiw = 'tiw',
  Tix = 'tix',
  Tiy = 'tiy',
  Tiz = 'tiz',
  Tja = 'tja',
  Tjg = 'tjg',
  Tji = 'tji',
  Tjj = 'tjj',
  Tjl = 'tjl',
  Tjm = 'tjm',
  Tjn = 'tjn',
  Tjo = 'tjo',
  Tjp = 'tjp',
  Tjs = 'tjs',
  Tju = 'tju',
  Tjw = 'tjw',
  Tka = 'tka',
  Tkb = 'tkb',
  Tkd = 'tkd',
  Tke = 'tke',
  Tkf = 'tkf',
  Tkg = 'tkg',
  Tkl = 'tkl',
  Tkm = 'tkm',
  Tkn = 'tkn',
  Tkp = 'tkp',
  Tkq = 'tkq',
  Tkr = 'tkr',
  Tks = 'tks',
  Tkt = 'tkt',
  Tku = 'tku',
  Tkv = 'tkv',
  Tkw = 'tkw',
  Tkx = 'tkx',
  Tkz = 'tkz',
  Tla = 'tla',
  Tlb = 'tlb',
  Tlc = 'tlc',
  Tld = 'tld',
  Tlf = 'tlf',
  Tlg = 'tlg',
  Tlh = 'tlh',
  Tli = 'tli',
  Tlj = 'tlj',
  Tlk = 'tlk',
  Tll = 'tll',
  Tlm = 'tlm',
  Tln = 'tln',
  Tlo = 'tlo',
  Tlp = 'tlp',
  Tlq = 'tlq',
  Tlr = 'tlr',
  Tls = 'tls',
  Tlt = 'tlt',
  Tlu = 'tlu',
  Tlv = 'tlv',
  Tlx = 'tlx',
  Tly = 'tly',
  Tma = 'tma',
  Tmb = 'tmb',
  Tmc = 'tmc',
  Tmd = 'tmd',
  Tme = 'tme',
  Tmf = 'tmf',
  Tmg = 'tmg',
  Tmh = 'tmh',
  Tmi = 'tmi',
  Tmj = 'tmj',
  Tmk = 'tmk',
  Tml = 'tml',
  Tmm = 'tmm',
  Tmn = 'tmn',
  Tmo = 'tmo',
  Tmq = 'tmq',
  Tmr = 'tmr',
  Tms = 'tms',
  Tmt = 'tmt',
  Tmu = 'tmu',
  Tmv = 'tmv',
  Tmw = 'tmw',
  Tmy = 'tmy',
  Tmz = 'tmz',
  Tna = 'tna',
  Tnb = 'tnb',
  Tnc = 'tnc',
  Tnd = 'tnd',
  Tng = 'tng',
  Tnh = 'tnh',
  Tni = 'tni',
  Tnk = 'tnk',
  Tnl = 'tnl',
  Tnm = 'tnm',
  Tnn = 'tnn',
  Tno = 'tno',
  Tnp = 'tnp',
  Tnq = 'tnq',
  Tnr = 'tnr',
  Tns = 'tns',
  Tnt = 'tnt',
  Tnu = 'tnu',
  Tnv = 'tnv',
  Tnw = 'tnw',
  Tnx = 'tnx',
  Tny = 'tny',
  Tnz = 'tnz',
  Tob = 'tob',
  Toc = 'toc',
  Tod = 'tod',
  Tof = 'tof',
  Tog = 'tog',
  Toh = 'toh',
  Toi = 'toi',
  Toj = 'toj',
  Tol = 'tol',
  Tom = 'tom',
  Ton = 'ton',
  Too = 'too',
  Top = 'top',
  Toq = 'toq',
  Tor = 'tor',
  Tos = 'tos',
  Tou = 'tou',
  Tov = 'tov',
  Tow = 'tow',
  Tox = 'tox',
  Toy = 'toy',
  Toz = 'toz',
  Tpa = 'tpa',
  Tpc = 'tpc',
  Tpe = 'tpe',
  Tpf = 'tpf',
  Tpg = 'tpg',
  Tpi = 'tpi',
  Tpj = 'tpj',
  Tpk = 'tpk',
  Tpl = 'tpl',
  Tpm = 'tpm',
  Tpn = 'tpn',
  Tpo = 'tpo',
  Tpp = 'tpp',
  Tpq = 'tpq',
  Tpr = 'tpr',
  Tpt = 'tpt',
  Tpu = 'tpu',
  Tpv = 'tpv',
  Tpw = 'tpw',
  Tpx = 'tpx',
  Tpy = 'tpy',
  Tpz = 'tpz',
  Tqb = 'tqb',
  Tql = 'tql',
  Tqm = 'tqm',
  Tqn = 'tqn',
  Tqo = 'tqo',
  Tqp = 'tqp',
  Tqq = 'tqq',
  Tqr = 'tqr',
  Tqt = 'tqt',
  Tqu = 'tqu',
  Tqw = 'tqw',
  Tra = 'tra',
  Trb = 'trb',
  Trc = 'trc',
  Trd = 'trd',
  Tre = 'tre',
  Trf = 'trf',
  Trg = 'trg',
  Trh = 'trh',
  Tri = 'tri',
  Trj = 'trj',
  Trl = 'trl',
  Trm = 'trm',
  Trn = 'trn',
  Tro = 'tro',
  Trp = 'trp',
  Trq = 'trq',
  Trr = 'trr',
  Trs = 'trs',
  Trt = 'trt',
  Tru = 'tru',
  Trv = 'trv',
  Trw = 'trw',
  Trx = 'trx',
  Try = 'try',
  Trz = 'trz',
  Tsa = 'tsa',
  Tsb = 'tsb',
  Tsc = 'tsc',
  Tsd = 'tsd',
  Tse = 'tse',
  Tsg = 'tsg',
  Tsh = 'tsh',
  Tsi = 'tsi',
  Tsj = 'tsj',
  Tsk = 'tsk',
  Tsl = 'tsl',
  Tsm = 'tsm',
  Tsn = 'tsn',
  Tso = 'tso',
  Tsp = 'tsp',
  Tsq = 'tsq',
  Tsr = 'tsr',
  Tss = 'tss',
  Tst = 'tst',
  Tsu = 'tsu',
  Tsv = 'tsv',
  Tsw = 'tsw',
  Tsx = 'tsx',
  Tsy = 'tsy',
  Tsz = 'tsz',
  Tta = 'tta',
  Ttb = 'ttb',
  Ttc = 'ttc',
  Ttd = 'ttd',
  Tte = 'tte',
  Ttf = 'ttf',
  Ttg = 'ttg',
  Tth = 'tth',
  Tti = 'tti',
  Ttj = 'ttj',
  Ttk = 'ttk',
  Ttl = 'ttl',
  Ttm = 'ttm',
  Ttn = 'ttn',
  Tto = 'tto',
  Ttp = 'ttp',
  Ttq = 'ttq',
  Ttr = 'ttr',
  Tts = 'tts',
  Ttt = 'ttt',
  Ttu = 'ttu',
  Ttv = 'ttv',
  Ttw = 'ttw',
  Tty = 'tty',
  Ttz = 'ttz',
  Tua = 'tua',
  Tub = 'tub',
  Tuc = 'tuc',
  Tud = 'tud',
  Tue = 'tue',
  Tuf = 'tuf',
  Tug = 'tug',
  Tuh = 'tuh',
  Tui = 'tui',
  Tuj = 'tuj',
  Tuk = 'tuk',
  Tul = 'tul',
  Tum = 'tum',
  Tun = 'tun',
  Tuo = 'tuo',
  Tuq = 'tuq',
  Tur = 'tur',
  Tus = 'tus',
  Tuu = 'tuu',
  Tuv = 'tuv',
  Tux = 'tux',
  Tuy = 'tuy',
  Tuz = 'tuz',
  Tva = 'tva',
  Tvd = 'tvd',
  Tve = 'tve',
  Tvk = 'tvk',
  Tvl = 'tvl',
  Tvm = 'tvm',
  Tvn = 'tvn',
  Tvo = 'tvo',
  Tvs = 'tvs',
  Tvt = 'tvt',
  Tvu = 'tvu',
  Tvw = 'tvw',
  Tvx = 'tvx',
  Tvy = 'tvy',
  Twa = 'twa',
  Twb = 'twb',
  Twc = 'twc',
  Twd = 'twd',
  Twe = 'twe',
  Twf = 'twf',
  Twg = 'twg',
  Twh = 'twh',
  Twi = 'twi',
  Twl = 'twl',
  Twm = 'twm',
  Twn = 'twn',
  Two = 'two',
  Twp = 'twp',
  Twq = 'twq',
  Twr = 'twr',
  Twt = 'twt',
  Twu = 'twu',
  Tww = 'tww',
  Twx = 'twx',
  Twy = 'twy',
  Txa = 'txa',
  Txb = 'txb',
  Txc = 'txc',
  Txe = 'txe',
  Txg = 'txg',
  Txh = 'txh',
  Txi = 'txi',
  Txj = 'txj',
  Txm = 'txm',
  Txn = 'txn',
  Txo = 'txo',
  Txq = 'txq',
  Txr = 'txr',
  Txs = 'txs',
  Txt = 'txt',
  Txu = 'txu',
  Txx = 'txx',
  Txy = 'txy',
  Tya = 'tya',
  Tye = 'tye',
  Tyh = 'tyh',
  Tyi = 'tyi',
  Tyj = 'tyj',
  Tyl = 'tyl',
  Tyn = 'tyn',
  Typ = 'typ',
  Tyr = 'tyr',
  Tys = 'tys',
  Tyt = 'tyt',
  Tyu = 'tyu',
  Tyv = 'tyv',
  Tyx = 'tyx',
  Tyz = 'tyz',
  Tza = 'tza',
  Tzh = 'tzh',
  Tzj = 'tzj',
  Tzl = 'tzl',
  Tzm = 'tzm',
  Tzn = 'tzn',
  Tzo = 'tzo',
  Tzx = 'tzx',
  Uam = 'uam',
  Uan = 'uan',
  Uar = 'uar',
  Uba = 'uba',
  Ubi = 'ubi',
  Ubl = 'ubl',
  Ubr = 'ubr',
  Ubu = 'ubu',
  Uby = 'uby',
  Uda = 'uda',
  Ude = 'ude',
  Udg = 'udg',
  Udi = 'udi',
  Udj = 'udj',
  Udl = 'udl',
  Udm = 'udm',
  Udu = 'udu',
  Ues = 'ues',
  Ufi = 'ufi',
  Uga = 'uga',
  Ugb = 'ugb',
  Uge = 'uge',
  Ugn = 'ugn',
  Ugo = 'ugo',
  Ugy = 'ugy',
  Uha = 'uha',
  Uhn = 'uhn',
  Uig = 'uig',
  Uis = 'uis',
  Uiv = 'uiv',
  Uji = 'uji',
  Uka = 'uka',
  Ukg = 'ukg',
  Ukh = 'ukh',
  Uki = 'uki',
  Ukk = 'ukk',
  Ukl = 'ukl',
  Ukp = 'ukp',
  Ukq = 'ukq',
  Ukr = 'ukr',
  Uks = 'uks',
  Uku = 'uku',
  Ukv = 'ukv',
  Ukw = 'ukw',
  Uky = 'uky',
  Ula = 'ula',
  Ulb = 'ulb',
  Ulc = 'ulc',
  Ule = 'ule',
  Ulf = 'ulf',
  Uli = 'uli',
  Ulk = 'ulk',
  Ull = 'ull',
  Ulm = 'ulm',
  Uln = 'uln',
  Ulu = 'ulu',
  Ulw = 'ulw',
  Uma = 'uma',
  Umb = 'umb',
  Umc = 'umc',
  Umd = 'umd',
  Umg = 'umg',
  Umi = 'umi',
  Umm = 'umm',
  Umn = 'umn',
  Umo = 'umo',
  Ump = 'ump',
  Umr = 'umr',
  Ums = 'ums',
  Umu = 'umu',
  Una = 'una',
  Und = 'und',
  Une = 'une',
  Ung = 'ung',
  Unk = 'unk',
  Unm = 'unm',
  Unn = 'unn',
  Unr = 'unr',
  Unu = 'unu',
  Unx = 'unx',
  Unz = 'unz',
  Upi = 'upi',
  Upv = 'upv',
  Ura = 'ura',
  Urb = 'urb',
  Urc = 'urc',
  Urd = 'urd',
  Ure = 'ure',
  Urf = 'urf',
  Urg = 'urg',
  Urh = 'urh',
  Uri = 'uri',
  Urk = 'urk',
  Url = 'url',
  Urm = 'urm',
  Urn = 'urn',
  Uro = 'uro',
  Urp = 'urp',
  Urr = 'urr',
  Urt = 'urt',
  Uru = 'uru',
  Urv = 'urv',
  Urw = 'urw',
  Urx = 'urx',
  Ury = 'ury',
  Urz = 'urz',
  Usa = 'usa',
  Ush = 'ush',
  Usi = 'usi',
  Usk = 'usk',
  Usp = 'usp',
  Uss = 'uss',
  Usu = 'usu',
  Uta = 'uta',
  Ute = 'ute',
  Uth = 'uth',
  Utp = 'utp',
  Utr = 'utr',
  Utu = 'utu',
  Uum = 'uum',
  Uun = 'uun',
  Uur = 'uur',
  Uuu = 'uuu',
  Uve = 'uve',
  Uvh = 'uvh',
  Uvl = 'uvl',
  Uwa = 'uwa',
  Uya = 'uya',
  Uzb = 'uzb',
  Uzn = 'uzn',
  Uzs = 'uzs',
  Vaa = 'vaa',
  Vae = 'vae',
  Vaf = 'vaf',
  Vag = 'vag',
  Vah = 'vah',
  Vai = 'vai',
  Vaj = 'vaj',
  Val = 'val',
  Vam = 'vam',
  Van = 'van',
  Vao = 'vao',
  Vap = 'vap',
  Var = 'var',
  Vas = 'vas',
  Vau = 'vau',
  Vav = 'vav',
  Vay = 'vay',
  Vbb = 'vbb',
  Vbk = 'vbk',
  Vec = 'vec',
  Ved = 'ved',
  Vel = 'vel',
  Vem = 'vem',
  Ven = 'ven',
  Veo = 'veo',
  Vep = 'vep',
  Ver = 'ver',
  Vgr = 'vgr',
  Vgt = 'vgt',
  Vic = 'vic',
  Vid = 'vid',
  Vie = 'vie',
  Vif = 'vif',
  Vig = 'vig',
  Vil = 'vil',
  Vin = 'vin',
  Vis = 'vis',
  Vit = 'vit',
  Viv = 'viv',
  Vka = 'vka',
  Vki = 'vki',
  Vkj = 'vkj',
  Vkk = 'vkk',
  Vkl = 'vkl',
  Vkm = 'vkm',
  Vko = 'vko',
  Vkp = 'vkp',
  Vkt = 'vkt',
  Vku = 'vku',
  Vlp = 'vlp',
  Vls = 'vls',
  Vma = 'vma',
  Vmb = 'vmb',
  Vmc = 'vmc',
  Vmd = 'vmd',
  Vme = 'vme',
  Vmf = 'vmf',
  Vmg = 'vmg',
  Vmh = 'vmh',
  Vmi = 'vmi',
  Vmj = 'vmj',
  Vmk = 'vmk',
  Vml = 'vml',
  Vmm = 'vmm',
  Vmp = 'vmp',
  Vmq = 'vmq',
  Vmr = 'vmr',
  Vms = 'vms',
  Vmu = 'vmu',
  Vmv = 'vmv',
  Vmw = 'vmw',
  Vmx = 'vmx',
  Vmy = 'vmy',
  Vmz = 'vmz',
  Vnk = 'vnk',
  Vnm = 'vnm',
  Vnp = 'vnp',
  Vol = 'vol',
  Vor = 'vor',
  Vot = 'vot',
  Vra = 'vra',
  Vro = 'vro',
  Vrs = 'vrs',
  Vrt = 'vrt',
  Vsi = 'vsi',
  Vsl = 'vsl',
  Vsv = 'vsv',
  Vto = 'vto',
  Vum = 'vum',
  Vun = 'vun',
  Vut = 'vut',
  Vwa = 'vwa',
  Waa = 'waa',
  Wab = 'wab',
  Wac = 'wac',
  Wad = 'wad',
  Wae = 'wae',
  Waf = 'waf',
  Wag = 'wag',
  Wah = 'wah',
  Wai = 'wai',
  Waj = 'waj',
  Wal = 'wal',
  Wam = 'wam',
  Wan = 'wan',
  Wao = 'wao',
  Wap = 'wap',
  Waq = 'waq',
  War = 'war',
  Was = 'was',
  Wat = 'wat',
  Wau = 'wau',
  Wav = 'wav',
  Waw = 'waw',
  Wax = 'wax',
  Way = 'way',
  Waz = 'waz',
  Wba = 'wba',
  Wbb = 'wbb',
  Wbe = 'wbe',
  Wbf = 'wbf',
  Wbh = 'wbh',
  Wbi = 'wbi',
  Wbj = 'wbj',
  Wbk = 'wbk',
  Wbl = 'wbl',
  Wbm = 'wbm',
  Wbp = 'wbp',
  Wbq = 'wbq',
  Wbr = 'wbr',
  Wbs = 'wbs',
  Wbt = 'wbt',
  Wbv = 'wbv',
  Wbw = 'wbw',
  Wca = 'wca',
  Wci = 'wci',
  Wdd = 'wdd',
  Wdg = 'wdg',
  Wdj = 'wdj',
  Wdk = 'wdk',
  Wdu = 'wdu',
  Wdy = 'wdy',
  Wea = 'wea',
  Wec = 'wec',
  Wed = 'wed',
  Weg = 'weg',
  Weh = 'weh',
  Wei = 'wei',
  Wem = 'wem',
  Weo = 'weo',
  Wep = 'wep',
  Wer = 'wer',
  Wes = 'wes',
  Wet = 'wet',
  Weu = 'weu',
  Wew = 'wew',
  Wfg = 'wfg',
  Wga = 'wga',
  Wgb = 'wgb',
  Wgg = 'wgg',
  Wgi = 'wgi',
  Wgo = 'wgo',
  Wgu = 'wgu',
  Wgy = 'wgy',
  Wha = 'wha',
  Whg = 'whg',
  Whk = 'whk',
  Whu = 'whu',
  Wib = 'wib',
  Wic = 'wic',
  Wie = 'wie',
  Wif = 'wif',
  Wig = 'wig',
  Wih = 'wih',
  Wii = 'wii',
  Wij = 'wij',
  Wik = 'wik',
  Wil = 'wil',
  Wim = 'wim',
  Win = 'win',
  Wir = 'wir',
  Wiu = 'wiu',
  Wiv = 'wiv',
  Wiy = 'wiy',
  Wja = 'wja',
  Wji = 'wji',
  Wka = 'wka',
  Wkb = 'wkb',
  Wkd = 'wkd',
  Wkl = 'wkl',
  Wkr = 'wkr',
  Wku = 'wku',
  Wkw = 'wkw',
  Wky = 'wky',
  Wla = 'wla',
  Wlc = 'wlc',
  Wle = 'wle',
  Wlg = 'wlg',
  Wlh = 'wlh',
  Wli = 'wli',
  Wlk = 'wlk',
  Wll = 'wll',
  Wlm = 'wlm',
  Wln = 'wln',
  Wlo = 'wlo',
  Wlr = 'wlr',
  Wls = 'wls',
  Wlu = 'wlu',
  Wlv = 'wlv',
  Wlw = 'wlw',
  Wlx = 'wlx',
  Wly = 'wly',
  Wma = 'wma',
  Wmb = 'wmb',
  Wmc = 'wmc',
  Wmd = 'wmd',
  Wme = 'wme',
  Wmh = 'wmh',
  Wmi = 'wmi',
  Wmm = 'wmm',
  Wmn = 'wmn',
  Wmo = 'wmo',
  Wms = 'wms',
  Wmt = 'wmt',
  Wmw = 'wmw',
  Wmx = 'wmx',
  Wnb = 'wnb',
  Wnc = 'wnc',
  Wnd = 'wnd',
  Wne = 'wne',
  Wng = 'wng',
  Wni = 'wni',
  Wnk = 'wnk',
  Wnm = 'wnm',
  Wnn = 'wnn',
  Wno = 'wno',
  Wnp = 'wnp',
  Wnu = 'wnu',
  Wnw = 'wnw',
  Wny = 'wny',
  Woa = 'woa',
  Wob = 'wob',
  Woc = 'woc',
  Wod = 'wod',
  Woe = 'woe',
  Wof = 'wof',
  Wog = 'wog',
  Woi = 'woi',
  Wok = 'wok',
  Wol = 'wol',
  Wom = 'wom',
  Won = 'won',
  Woo = 'woo',
  Wor = 'wor',
  Wos = 'wos',
  Wow = 'wow',
  Woy = 'woy',
  Wpc = 'wpc',
  Wra = 'wra',
  Wrb = 'wrb',
  Wrd = 'wrd',
  Wrg = 'wrg',
  Wrh = 'wrh',
  Wri = 'wri',
  Wrk = 'wrk',
  Wrl = 'wrl',
  Wrm = 'wrm',
  Wrn = 'wrn',
  Wro = 'wro',
  Wrp = 'wrp',
  Wrr = 'wrr',
  Wrs = 'wrs',
  Wru = 'wru',
  Wrv = 'wrv',
  Wrw = 'wrw',
  Wrx = 'wrx',
  Wry = 'wry',
  Wrz = 'wrz',
  Wsa = 'wsa',
  Wsg = 'wsg',
  Wsi = 'wsi',
  Wsk = 'wsk',
  Wsr = 'wsr',
  Wss = 'wss',
  Wsu = 'wsu',
  Wsv = 'wsv',
  Wtf = 'wtf',
  Wth = 'wth',
  Wti = 'wti',
  Wtk = 'wtk',
  Wtm = 'wtm',
  Wtw = 'wtw',
  Wua = 'wua',
  Wub = 'wub',
  Wud = 'wud',
  Wuh = 'wuh',
  Wul = 'wul',
  Wum = 'wum',
  Wun = 'wun',
  Wur = 'wur',
  Wut = 'wut',
  Wuu = 'wuu',
  Wuv = 'wuv',
  Wux = 'wux',
  Wuy = 'wuy',
  Wwa = 'wwa',
  Wwb = 'wwb',
  Wwo = 'wwo',
  Wwr = 'wwr',
  Www = 'www',
  Wxa = 'wxa',
  Wxw = 'wxw',
  Wya = 'wya',
  Wyb = 'wyb',
  Wyi = 'wyi',
  Wym = 'wym',
  Wyr = 'wyr',
  Wyy = 'wyy',
  Xaa = 'xaa',
  Xab = 'xab',
  Xac = 'xac',
  Xad = 'xad',
  Xae = 'xae',
  Xag = 'xag',
  Xai = 'xai',
  Xaj = 'xaj',
  Xak = 'xak',
  Xal = 'xal',
  Xam = 'xam',
  Xan = 'xan',
  Xao = 'xao',
  Xap = 'xap',
  Xaq = 'xaq',
  Xar = 'xar',
  Xas = 'xas',
  Xat = 'xat',
  Xau = 'xau',
  Xav = 'xav',
  Xaw = 'xaw',
  Xay = 'xay',
  Xbb = 'xbb',
  Xbc = 'xbc',
  Xbd = 'xbd',
  Xbe = 'xbe',
  Xbg = 'xbg',
  Xbi = 'xbi',
  Xbj = 'xbj',
  Xbm = 'xbm',
  Xbn = 'xbn',
  Xbo = 'xbo',
  Xbp = 'xbp',
  Xbr = 'xbr',
  Xbw = 'xbw',
  Xby = 'xby',
  Xcb = 'xcb',
  Xcc = 'xcc',
  Xce = 'xce',
  Xcg = 'xcg',
  Xch = 'xch',
  Xcl = 'xcl',
  Xcm = 'xcm',
  Xcn = 'xcn',
  Xco = 'xco',
  Xcr = 'xcr',
  Xct = 'xct',
  Xcu = 'xcu',
  Xcv = 'xcv',
  Xcw = 'xcw',
  Xcy = 'xcy',
  Xda = 'xda',
  Xdc = 'xdc',
  Xdk = 'xdk',
  Xdm = 'xdm',
  Xdo = 'xdo',
  Xdy = 'xdy',
  Xeb = 'xeb',
  Xed = 'xed',
  Xeg = 'xeg',
  Xel = 'xel',
  Xem = 'xem',
  Xep = 'xep',
  Xer = 'xer',
  Xes = 'xes',
  Xet = 'xet',
  Xeu = 'xeu',
  Xfa = 'xfa',
  Xga = 'xga',
  Xgb = 'xgb',
  Xgd = 'xgd',
  Xgf = 'xgf',
  Xgg = 'xgg',
  Xgi = 'xgi',
  Xgl = 'xgl',
  Xgm = 'xgm',
  Xgr = 'xgr',
  Xgu = 'xgu',
  Xgw = 'xgw',
  Xha = 'xha',
  Xhc = 'xhc',
  Xhd = 'xhd',
  Xhe = 'xhe',
  Xho = 'xho',
  Xhr = 'xhr',
  Xht = 'xht',
  Xhu = 'xhu',
  Xhv = 'xhv',
  Xib = 'xib',
  Xii = 'xii',
  Xil = 'xil',
  Xin = 'xin',
  Xir = 'xir',
  Xis = 'xis',
  Xiv = 'xiv',
  Xiy = 'xiy',
  Xjb = 'xjb',
  Xjt = 'xjt',
  Xka = 'xka',
  Xkb = 'xkb',
  Xkc = 'xkc',
  Xkd = 'xkd',
  Xke = 'xke',
  Xkf = 'xkf',
  Xkg = 'xkg',
  Xki = 'xki',
  Xkj = 'xkj',
  Xkk = 'xkk',
  Xkl = 'xkl',
  Xkn = 'xkn',
  Xko = 'xko',
  Xkp = 'xkp',
  Xkq = 'xkq',
  Xkr = 'xkr',
  Xks = 'xks',
  Xkt = 'xkt',
  Xku = 'xku',
  Xkv = 'xkv',
  Xkw = 'xkw',
  Xkx = 'xkx',
  Xky = 'xky',
  Xkz = 'xkz',
  Xla = 'xla',
  Xlb = 'xlb',
  Xlc = 'xlc',
  Xld = 'xld',
  Xle = 'xle',
  Xlg = 'xlg',
  Xli = 'xli',
  Xln = 'xln',
  Xlo = 'xlo',
  Xlp = 'xlp',
  Xls = 'xls',
  Xlu = 'xlu',
  Xly = 'xly',
  Xma = 'xma',
  Xmb = 'xmb',
  Xmc = 'xmc',
  Xmd = 'xmd',
  Xme = 'xme',
  Xmf = 'xmf',
  Xmg = 'xmg',
  Xmh = 'xmh',
  Xmj = 'xmj',
  Xmk = 'xmk',
  Xml = 'xml',
  Xmm = 'xmm',
  Xmn = 'xmn',
  Xmo = 'xmo',
  Xmp = 'xmp',
  Xmq = 'xmq',
  Xmr = 'xmr',
  Xms = 'xms',
  Xmt = 'xmt',
  Xmu = 'xmu',
  Xmv = 'xmv',
  Xmw = 'xmw',
  Xmx = 'xmx',
  Xmy = 'xmy',
  Xmz = 'xmz',
  Xna = 'xna',
  Xnb = 'xnb',
  Xng = 'xng',
  Xnh = 'xnh',
  Xni = 'xni',
  Xnk = 'xnk',
  Xnm = 'xnm',
  Xnn = 'xnn',
  Xno = 'xno',
  Xnr = 'xnr',
  Xns = 'xns',
  Xnt = 'xnt',
  Xnu = 'xnu',
  Xny = 'xny',
  Xnz = 'xnz',
  Xoc = 'xoc',
  Xod = 'xod',
  Xog = 'xog',
  Xoi = 'xoi',
  Xok = 'xok',
  Xom = 'xom',
  Xon = 'xon',
  Xoo = 'xoo',
  Xop = 'xop',
  Xor = 'xor',
  Xow = 'xow',
  Xpa = 'xpa',
  Xpb = 'xpb',
  Xpc = 'xpc',
  Xpd = 'xpd',
  Xpe = 'xpe',
  Xpf = 'xpf',
  Xpg = 'xpg',
  Xph = 'xph',
  Xpi = 'xpi',
  Xpj = 'xpj',
  Xpk = 'xpk',
  Xpl = 'xpl',
  Xpm = 'xpm',
  Xpn = 'xpn',
  Xpo = 'xpo',
  Xpp = 'xpp',
  Xpq = 'xpq',
  Xpr = 'xpr',
  Xps = 'xps',
  Xpt = 'xpt',
  Xpu = 'xpu',
  Xpv = 'xpv',
  Xpw = 'xpw',
  Xpx = 'xpx',
  Xpy = 'xpy',
  Xpz = 'xpz',
  Xqa = 'xqa',
  Xqt = 'xqt',
  Xra = 'xra',
  Xrb = 'xrb',
  Xrd = 'xrd',
  Xre = 'xre',
  Xrg = 'xrg',
  Xri = 'xri',
  Xrm = 'xrm',
  Xrn = 'xrn',
  Xrr = 'xrr',
  Xrt = 'xrt',
  Xru = 'xru',
  Xrw = 'xrw',
  Xsa = 'xsa',
  Xsb = 'xsb',
  Xsc = 'xsc',
  Xsd = 'xsd',
  Xse = 'xse',
  Xsh = 'xsh',
  Xsi = 'xsi',
  Xsj = 'xsj',
  Xsl = 'xsl',
  Xsm = 'xsm',
  Xsn = 'xsn',
  Xso = 'xso',
  Xsp = 'xsp',
  Xsq = 'xsq',
  Xsr = 'xsr',
  Xss = 'xss',
  Xsu = 'xsu',
  Xsv = 'xsv',
  Xsy = 'xsy',
  Xta = 'xta',
  Xtb = 'xtb',
  Xtc = 'xtc',
  Xtd = 'xtd',
  Xte = 'xte',
  Xtg = 'xtg',
  Xth = 'xth',
  Xti = 'xti',
  Xtj = 'xtj',
  Xtl = 'xtl',
  Xtm = 'xtm',
  Xtn = 'xtn',
  Xto = 'xto',
  Xtp = 'xtp',
  Xtq = 'xtq',
  Xtr = 'xtr',
  Xts = 'xts',
  Xtt = 'xtt',
  Xtu = 'xtu',
  Xtv = 'xtv',
  Xtw = 'xtw',
  Xty = 'xty',
  Xua = 'xua',
  Xub = 'xub',
  Xud = 'xud',
  Xug = 'xug',
  Xuj = 'xuj',
  Xul = 'xul',
  Xum = 'xum',
  Xun = 'xun',
  Xuo = 'xuo',
  Xup = 'xup',
  Xur = 'xur',
  Xut = 'xut',
  Xuu = 'xuu',
  Xve = 'xve',
  Xvi = 'xvi',
  Xvn = 'xvn',
  Xvo = 'xvo',
  Xvs = 'xvs',
  Xwa = 'xwa',
  Xwc = 'xwc',
  Xwd = 'xwd',
  Xwe = 'xwe',
  Xwg = 'xwg',
  Xwj = 'xwj',
  Xwk = 'xwk',
  Xwl = 'xwl',
  Xwo = 'xwo',
  Xwr = 'xwr',
  Xwt = 'xwt',
  Xww = 'xww',
  Xxb = 'xxb',
  Xxk = 'xxk',
  Xxm = 'xxm',
  Xxr = 'xxr',
  Xxt = 'xxt',
  Xya = 'xya',
  Xyb = 'xyb',
  Xyj = 'xyj',
  Xyk = 'xyk',
  Xyl = 'xyl',
  Xyt = 'xyt',
  Xyy = 'xyy',
  Xzh = 'xzh',
  Xzm = 'xzm',
  Xzp = 'xzp',
  Yaa = 'yaa',
  Yab = 'yab',
  Yac = 'yac',
  Yad = 'yad',
  Yae = 'yae',
  Yaf = 'yaf',
  Yag = 'yag',
  Yah = 'yah',
  Yai = 'yai',
  Yaj = 'yaj',
  Yak = 'yak',
  Yal = 'yal',
  Yam = 'yam',
  Yan = 'yan',
  Yao = 'yao',
  Yap = 'yap',
  Yaq = 'yaq',
  Yar = 'yar',
  Yas = 'yas',
  Yat = 'yat',
  Yau = 'yau',
  Yav = 'yav',
  Yaw = 'yaw',
  Yax = 'yax',
  Yay = 'yay',
  Yaz = 'yaz',
  Yba = 'yba',
  Ybb = 'ybb',
  Ybe = 'ybe',
  Ybh = 'ybh',
  Ybi = 'ybi',
  Ybj = 'ybj',
  Ybk = 'ybk',
  Ybl = 'ybl',
  Ybm = 'ybm',
  Ybn = 'ybn',
  Ybo = 'ybo',
  Ybx = 'ybx',
  Yby = 'yby',
  Ych = 'ych',
  Ycl = 'ycl',
  Ycn = 'ycn',
  Ycp = 'ycp',
  Yda = 'yda',
  Ydd = 'ydd',
  Yde = 'yde',
  Ydg = 'ydg',
  Ydk = 'ydk',
  Yea = 'yea',
  Yec = 'yec',
  Yee = 'yee',
  Yei = 'yei',
  Yej = 'yej',
  Yel = 'yel',
  Yer = 'yer',
  Yes = 'yes',
  Yet = 'yet',
  Yeu = 'yeu',
  Yev = 'yev',
  Yey = 'yey',
  Yga = 'yga',
  Ygi = 'ygi',
  Ygl = 'ygl',
  Ygm = 'ygm',
  Ygp = 'ygp',
  Ygr = 'ygr',
  Ygs = 'ygs',
  Ygu = 'ygu',
  Ygw = 'ygw',
  Yha = 'yha',
  Yhd = 'yhd',
  Yhl = 'yhl',
  Yhs = 'yhs',
  Yia = 'yia',
  Yid = 'yid',
  Yif = 'yif',
  Yig = 'yig',
  Yih = 'yih',
  Yii = 'yii',
  Yij = 'yij',
  Yik = 'yik',
  Yil = 'yil',
  Yim = 'yim',
  Yin = 'yin',
  Yip = 'yip',
  Yiq = 'yiq',
  Yir = 'yir',
  Yis = 'yis',
  Yit = 'yit',
  Yiu = 'yiu',
  Yiv = 'yiv',
  Yix = 'yix',
  Yiz = 'yiz',
  Yka = 'yka',
  Ykg = 'ykg',
  Yki = 'yki',
  Ykk = 'ykk',
  Ykl = 'ykl',
  Ykm = 'ykm',
  Ykn = 'ykn',
  Yko = 'yko',
  Ykr = 'ykr',
  Ykt = 'ykt',
  Yku = 'yku',
  Yky = 'yky',
  Yla = 'yla',
  Ylb = 'ylb',
  Yle = 'yle',
  Ylg = 'ylg',
  Yli = 'yli',
  Yll = 'yll',
  Ylm = 'ylm',
  Yln = 'yln',
  Ylo = 'ylo',
  Ylr = 'ylr',
  Ylu = 'ylu',
  Yly = 'yly',
  Ymb = 'ymb',
  Ymc = 'ymc',
  Ymd = 'ymd',
  Yme = 'yme',
  Ymg = 'ymg',
  Ymh = 'ymh',
  Ymi = 'ymi',
  Ymk = 'ymk',
  Yml = 'yml',
  Ymm = 'ymm',
  Ymn = 'ymn',
  Ymo = 'ymo',
  Ymp = 'ymp',
  Ymq = 'ymq',
  Ymr = 'ymr',
  Yms = 'yms',
  Ymx = 'ymx',
  Ymz = 'ymz',
  Yna = 'yna',
  Ynd = 'ynd',
  Yne = 'yne',
  Yng = 'yng',
  Ynk = 'ynk',
  Ynl = 'ynl',
  Ynn = 'ynn',
  Yno = 'yno',
  Ynq = 'ynq',
  Yns = 'yns',
  Ynu = 'ynu',
  Yob = 'yob',
  Yog = 'yog',
  Yoi = 'yoi',
  Yok = 'yok',
  Yol = 'yol',
  Yom = 'yom',
  Yon = 'yon',
  Yor = 'yor',
  Yot = 'yot',
  Yox = 'yox',
  Yoy = 'yoy',
  Ypa = 'ypa',
  Ypb = 'ypb',
  Ypg = 'ypg',
  Yph = 'yph',
  Ypm = 'ypm',
  Ypn = 'ypn',
  Ypo = 'ypo',
  Ypp = 'ypp',
  Ypz = 'ypz',
  Yra = 'yra',
  Yrb = 'yrb',
  Yre = 'yre',
  Yrk = 'yrk',
  Yrl = 'yrl',
  Yrm = 'yrm',
  Yrn = 'yrn',
  Yro = 'yro',
  Yrs = 'yrs',
  Yrw = 'yrw',
  Yry = 'yry',
  Ysc = 'ysc',
  Ysd = 'ysd',
  Ysg = 'ysg',
  Ysl = 'ysl',
  Ysn = 'ysn',
  Yso = 'yso',
  Ysp = 'ysp',
  Ysr = 'ysr',
  Yss = 'yss',
  Ysy = 'ysy',
  Yta = 'yta',
  Ytl = 'ytl',
  Ytp = 'ytp',
  Ytw = 'ytw',
  Yty = 'yty',
  Yua = 'yua',
  Yub = 'yub',
  Yuc = 'yuc',
  Yud = 'yud',
  Yue = 'yue',
  Yuf = 'yuf',
  Yug = 'yug',
  Yui = 'yui',
  Yuj = 'yuj',
  Yuk = 'yuk',
  Yul = 'yul',
  Yum = 'yum',
  Yun = 'yun',
  Yup = 'yup',
  Yuq = 'yuq',
  Yur = 'yur',
  Yut = 'yut',
  Yuw = 'yuw',
  Yux = 'yux',
  Yuy = 'yuy',
  Yuz = 'yuz',
  Yva = 'yva',
  Yvt = 'yvt',
  Ywa = 'ywa',
  Ywg = 'ywg',
  Ywl = 'ywl',
  Ywn = 'ywn',
  Ywq = 'ywq',
  Ywr = 'ywr',
  Ywt = 'ywt',
  Ywu = 'ywu',
  Yww = 'yww',
  Yxa = 'yxa',
  Yxg = 'yxg',
  Yxl = 'yxl',
  Yxm = 'yxm',
  Yxu = 'yxu',
  Yxy = 'yxy',
  Yyr = 'yyr',
  Yyu = 'yyu',
  Yyz = 'yyz',
  Yzg = 'yzg',
  Yzk = 'yzk',
  Zaa = 'zaa',
  Zab = 'zab',
  Zac = 'zac',
  Zad = 'zad',
  Zae = 'zae',
  Zaf = 'zaf',
  Zag = 'zag',
  Zah = 'zah',
  Zai = 'zai',
  Zaj = 'zaj',
  Zak = 'zak',
  Zal = 'zal',
  Zam = 'zam',
  Zao = 'zao',
  Zap = 'zap',
  Zaq = 'zaq',
  Zar = 'zar',
  Zas = 'zas',
  Zat = 'zat',
  Zau = 'zau',
  Zav = 'zav',
  Zaw = 'zaw',
  Zax = 'zax',
  Zay = 'zay',
  Zaz = 'zaz',
  Zba = 'zba',
  Zbc = 'zbc',
  Zbe = 'zbe',
  Zbl = 'zbl',
  Zbt = 'zbt',
  Zbw = 'zbw',
  Zca = 'zca',
  Zch = 'zch',
  Zdj = 'zdj',
  Zea = 'zea',
  Zeg = 'zeg',
  Zeh = 'zeh',
  Zen = 'zen',
  Zga = 'zga',
  Zgb = 'zgb',
  Zgh = 'zgh',
  Zgm = 'zgm',
  Zgn = 'zgn',
  Zgr = 'zgr',
  Zha = 'zha',
  Zhb = 'zhb',
  Zhd = 'zhd',
  Zhi = 'zhi',
  Zhn = 'zhn',
  Zho = 'zho',
  Zhw = 'zhw',
  Zia = 'zia',
  Zib = 'zib',
  Zik = 'zik',
  Zil = 'zil',
  Zim = 'zim',
  Zin = 'zin',
  Ziw = 'ziw',
  Ziz = 'ziz',
  Zka = 'zka',
  Zkb = 'zkb',
  Zkd = 'zkd',
  Zkg = 'zkg',
  Zkh = 'zkh',
  Zkk = 'zkk',
  Zkn = 'zkn',
  Zko = 'zko',
  Zkp = 'zkp',
  Zkr = 'zkr',
  Zkt = 'zkt',
  Zku = 'zku',
  Zkv = 'zkv',
  Zkz = 'zkz',
  Zlj = 'zlj',
  Zlm = 'zlm',
  Zln = 'zln',
  Zlq = 'zlq',
  Zma = 'zma',
  Zmb = 'zmb',
  Zmc = 'zmc',
  Zmd = 'zmd',
  Zme = 'zme',
  Zmf = 'zmf',
  Zmg = 'zmg',
  Zmh = 'zmh',
  Zmi = 'zmi',
  Zmj = 'zmj',
  Zmk = 'zmk',
  Zml = 'zml',
  Zmm = 'zmm',
  Zmn = 'zmn',
  Zmo = 'zmo',
  Zmp = 'zmp',
  Zmq = 'zmq',
  Zmr = 'zmr',
  Zms = 'zms',
  Zmt = 'zmt',
  Zmu = 'zmu',
  Zmv = 'zmv',
  Zmw = 'zmw',
  Zmx = 'zmx',
  Zmy = 'zmy',
  Zmz = 'zmz',
  Zna = 'zna',
  Zne = 'zne',
  Zng = 'zng',
  Znk = 'znk',
  Zns = 'zns',
  Zoc = 'zoc',
  Zoh = 'zoh',
  Zom = 'zom',
  Zoo = 'zoo',
  Zoq = 'zoq',
  Zor = 'zor',
  Zos = 'zos',
  Zpa = 'zpa',
  Zpb = 'zpb',
  Zpc = 'zpc',
  Zpd = 'zpd',
  Zpe = 'zpe',
  Zpf = 'zpf',
  Zpg = 'zpg',
  Zph = 'zph',
  Zpi = 'zpi',
  Zpj = 'zpj',
  Zpk = 'zpk',
  Zpl = 'zpl',
  Zpm = 'zpm',
  Zpn = 'zpn',
  Zpo = 'zpo',
  Zpp = 'zpp',
  Zpq = 'zpq',
  Zpr = 'zpr',
  Zps = 'zps',
  Zpt = 'zpt',
  Zpu = 'zpu',
  Zpv = 'zpv',
  Zpw = 'zpw',
  Zpx = 'zpx',
  Zpy = 'zpy',
  Zpz = 'zpz',
  Zqe = 'zqe',
  Zra = 'zra',
  Zrg = 'zrg',
  Zrn = 'zrn',
  Zro = 'zro',
  Zrp = 'zrp',
  Zrs = 'zrs',
  Zsa = 'zsa',
  Zsk = 'zsk',
  Zsl = 'zsl',
  Zsm = 'zsm',
  Zsr = 'zsr',
  Zsu = 'zsu',
  Zte = 'zte',
  Ztg = 'ztg',
  Ztl = 'ztl',
  Ztm = 'ztm',
  Ztn = 'ztn',
  Ztp = 'ztp',
  Ztq = 'ztq',
  Zts = 'zts',
  Ztt = 'ztt',
  Ztu = 'ztu',
  Ztx = 'ztx',
  Zty = 'zty',
  Zua = 'zua',
  Zuh = 'zuh',
  Zul = 'zul',
  Zum = 'zum',
  Zun = 'zun',
  Zuy = 'zuy',
  Zwa = 'zwa',
  Zxx = 'zxx',
  Zyb = 'zyb',
  Zyg = 'zyg',
  Zyj = 'zyj',
  Zyn = 'zyn',
  Zyp = 'zyp',
  Zza = 'zza',
  Zzj = 'zzj'
}

/** License code */
export enum LicenseCode {
  Afl_3_0 = 'AFL_3_0',
  Agpl_3_0 = 'AGPL_3_0',
  Apache_2_0 = 'APACHE_2_0',
  Artistic_2_0 = 'ARTISTIC_2_0',
  BigcodeOpenrailM = 'BIGCODE_OPENRAIL_M',
  BigscienceBloomRail_1_0 = 'BIGSCIENCE_BLOOM_RAIL_1_0',
  BigscienceOpenrailM = 'BIGSCIENCE_OPENRAIL_M',
  Bsd = 'BSD',
  Bsd_2Clause = 'BSD_2_CLAUSE',
  Bsd_3Clause = 'BSD_3_CLAUSE',
  Bsd_3ClauseClear = 'BSD_3_CLAUSE_CLEAR',
  Bsl_1_0 = 'BSL_1_0',
  Cc = 'CC',
  Cc0_1_0 = 'CC0_1_0',
  CcBy_2_0 = 'CC_BY_2_0',
  CcBy_2_5 = 'CC_BY_2_5',
  CcBy_3_0 = 'CC_BY_3_0',
  CcBy_4_0 = 'CC_BY_4_0',
  CcByNc_2_0 = 'CC_BY_NC_2_0',
  CcByNc_3_0 = 'CC_BY_NC_3_0',
  CcByNc_4_0 = 'CC_BY_NC_4_0',
  CcByNcNd_3_0 = 'CC_BY_NC_ND_3_0',
  CcByNcNd_4_0 = 'CC_BY_NC_ND_4_0',
  CcByNcSa_2_0 = 'CC_BY_NC_SA_2_0',
  CcByNcSa_3_0 = 'CC_BY_NC_SA_3_0',
  CcByNcSa_4_0 = 'CC_BY_NC_SA_4_0',
  CcByNd_4_0 = 'CC_BY_ND_4_0',
  CcBySa_3_0 = 'CC_BY_SA_3_0',
  CcBySa_4_0 = 'CC_BY_SA_4_0',
  CdlaPermissive_1_0 = 'CDLA_PERMISSIVE_1_0',
  CdlaPermissive_2_0 = 'CDLA_PERMISSIVE_2_0',
  CdlaSharing_1_0 = 'CDLA_SHARING_1_0',
  Cuda = 'CUDA',
  DeepfloydIfLicense = 'DEEPFLOYD_IF_LICENSE',
  Ecl_2_0 = 'ECL_2_0',
  Epl_1_0 = 'EPL_1_0',
  Epl_2_0 = 'EPL_2_0',
  Etalab_2_0 = 'ETALAB_2_0',
  Eupl_1_1 = 'EUPL_1_1',
  Gemma = 'GEMMA',
  Gfdl = 'GFDL',
  Gpl = 'GPL',
  Gpl_2_0 = 'GPL_2_0',
  Gpl_3_0 = 'GPL_3_0',
  Isc = 'ISC',
  Lgpl = 'LGPL',
  Lgpl_2_1 = 'LGPL_2_1',
  Lgpl_3_0 = 'LGPL_3_0',
  Llama2 = 'LLAMA2',
  Llama3 = 'LLAMA3',
  Llama3_1 = 'LLAMA3_1',
  Llama3_2 = 'LLAMA3_2',
  Lppl_1_3C = 'LPPL_1_3C',
  Mit = 'MIT',
  Mpl_2_0 = 'MPL_2_0',
  MsPl = 'MS_PL',
  Ncsa = 'NCSA',
  Odbl = 'ODBL',
  OdcBy = 'ODC_BY',
  Ofl_1_1 = 'OFL_1_1',
  Openrail = 'OPENRAIL',
  OpenrailPlusplus = 'OPENRAIL_PLUSPLUS',
  Osl_3_0 = 'OSL_3_0',
  Other = 'OTHER',
  Pddl = 'PDDL',
  Postgresql = 'POSTGRESQL',
  Unknown = 'UNKNOWN',
  Unlicense = 'UNLICENSE',
  Wtfpl = 'WTFPL',
  Zlib = 'ZLIB'
}

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

export type ModelsFilter = {
  /** Filter by language codes */
  languages?: InputMaybe<Array<LanguageCodeEnum>>;
  /** filter by models -> libraries */
  libraries?: InputMaybe<SupportedLibrary>;
  /** filter by models -> libraries */
  license?: InputMaybe<LicenseCode>;
  /** filter by models -> task */
  task?: InputMaybe<TaskFilter>;
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
  configuration?: Maybe<Scalars['JSON']>;
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
  /** filter by configuration */
  configuration?: InputMaybe<ConfigurationFilter>;
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
  /** filter by offerInfo -> subType */
  subType?: InputMaybe<ValueOfferSubtype>;
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
  signatureKey: Scalars['String'];
  subType: Scalars['String'];
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
  signatureKey: Scalars['String'];
  subType: Scalars['String'];
};

export type OfferInputType = {
  configuration?: InputMaybe<Scalars['JSON']>;
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
  inputOffersIds: Array<Scalars['String']>;
  inputOffersVersions: Array<Scalars['Float']>;
  outputOfferId: Scalars['String'];
  outputOfferVersion: Scalars['Float'];
};

export type OrderArgsInput = {
  inputOffersIds: Array<Scalars['String']>;
  inputOffersVersions: Array<Scalars['Float']>;
  outputOfferId: Scalars['String'];
  outputOfferVersion: Scalars['Float'];
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
  offerVersion: Scalars['Float'];
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
  offerVersion: Scalars['Float'];
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

/** Pipeline type */
export enum PipelineType {
  AnyToAny = 'ANY_TO_ANY',
  AudioClassification = 'AUDIO_CLASSIFICATION',
  AudioToAudio = 'AUDIO_TO_AUDIO',
  AutomaticSpeechRecognition = 'AUTOMATIC_SPEECH_RECOGNITION',
  DepthEstimation = 'DEPTH_ESTIMATION',
  DocumentQuestionAnswering = 'DOCUMENT_QUESTION_ANSWERING',
  FeatureExtraction = 'FEATURE_EXTRACTION',
  FillMask = 'FILL_MASK',
  GraphMl = 'GRAPH_ML',
  ImageClassification = 'IMAGE_CLASSIFICATION',
  ImageFeatureExtraction = 'IMAGE_FEATURE_EXTRACTION',
  ImageSegmentation = 'IMAGE_SEGMENTATION',
  ImageTextToText = 'IMAGE_TEXT_TO_TEXT',
  ImageTo_3D = 'IMAGE_TO_3D',
  ImageToImage = 'IMAGE_TO_IMAGE',
  ImageToText = 'IMAGE_TO_TEXT',
  ImageToVideo = 'IMAGE_TO_VIDEO',
  KeypointDetection = 'KEYPOINT_DETECTION',
  MaskGeneration = 'MASK_GENERATION',
  MultipleChoice = 'MULTIPLE_CHOICE',
  ObjectDetection = 'OBJECT_DETECTION',
  Other = 'OTHER',
  QuestionAnswering = 'QUESTION_ANSWERING',
  ReinforcementLearning = 'REINFORCEMENT_LEARNING',
  Robotics = 'ROBOTICS',
  SentenceSimilarity = 'SENTENCE_SIMILARITY',
  Summarization = 'SUMMARIZATION',
  TableQuestionAnswering = 'TABLE_QUESTION_ANSWERING',
  TableToText = 'TABLE_TO_TEXT',
  TabularClassification = 'TABULAR_CLASSIFICATION',
  TabularRegression = 'TABULAR_REGRESSION',
  TabularToText = 'TABULAR_TO_TEXT',
  Text2TextGeneration = 'TEXT2TEXT_GENERATION',
  TextClassification = 'TEXT_CLASSIFICATION',
  TextGeneration = 'TEXT_GENERATION',
  TextRetrieval = 'TEXT_RETRIEVAL',
  TextTo_3D = 'TEXT_TO_3D',
  TextToAudio = 'TEXT_TO_AUDIO',
  TextToImage = 'TEXT_TO_IMAGE',
  TextToSpeech = 'TEXT_TO_SPEECH',
  TextToVideo = 'TEXT_TO_VIDEO',
  TimeSeriesForecasting = 'TIME_SERIES_FORECASTING',
  TokenClassification = 'TOKEN_CLASSIFICATION',
  Translation = 'TRANSLATION',
  UnconditionalImageGeneration = 'UNCONDITIONAL_IMAGE_GENERATION',
  VideoClassification = 'VIDEO_CLASSIFICATION',
  VideoTextToText = 'VIDEO_TEXT_TO_TEXT',
  VisualQuestionAnswering = 'VISUAL_QUESTION_ANSWERING',
  VoiceActivityDetection = 'VOICE_ACTIVITY_DETECTION',
  ZeroShotClassification = 'ZERO_SHOT_CLASSIFICATION',
  ZeroShotImageClassification = 'ZERO_SHOT_IMAGE_CLASSIFICATION',
  ZeroShotObjectDetection = 'ZERO_SHOT_OBJECT_DETECTION'
}

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

/** Supported libraries */
export enum SupportedLibrary {
  Adapters = 'ADAPTERS',
  AllenNlp = 'ALLEN_NLP',
  Asteroid = 'ASTEROID',
  BerTopic = 'BER_TOPIC',
  CoreMl = 'CORE_ML',
  Diffusers = 'DIFFUSERS',
  Espnet = 'ESPNET',
  Fairseq = 'FAIRSEQ',
  Fastai = 'FASTAI',
  FastText = 'FAST_TEXT',
  Flair = 'FLAIR',
  Gguf = 'GGUF',
  Graphcore = 'GRAPHCORE',
  Habana = 'HABANA',
  Jax = 'JAX',
  Joblib = 'JOBLIB',
  Keras = 'KERAS',
  Llamafile = 'LLAMAFILE',
  Mlx = 'MLX',
  MlAgents = 'ML_AGENTS',
  Nemo = 'NEMO',
  Onnx = 'ONNX',
  Openvino = 'OPENVINO',
  OpenClip = 'OPEN_CLIP',
  PaddleNlp = 'PADDLE_NLP',
  PaddlePaddle = 'PADDLE_PADDLE',
  Peft = 'PEFT',
  PyannoteAudio = 'PYANNOTE_AUDIO',
  PyTorch = 'PY_TORCH',
  Rust = 'RUST',
  SafeTensors = 'SAFE_TENSORS',
  SampleFactory = 'SAMPLE_FACTORY',
  ScikitLearn = 'SCIKIT_LEARN',
  SentenceTransformers = 'SENTENCE_TRANSFORMERS',
  Setfit = 'SETFIT',
  Spacy = 'SPACY',
  SpanMarker = 'SPAN_MARKER',
  Speechbrain = 'SPEECHBRAIN',
  StableBaselines3 = 'STABLE_BASELINES3',
  Stanza = 'STANZA',
  TensorBoard = 'TENSOR_BOARD',
  TensorFlow = 'TENSOR_FLOW',
  TfKeras = 'TF_KERAS',
  TfLite = 'TF_LITE',
  Timm = 'TIMM',
  Transformers = 'TRANSFORMERS',
  TransformersJs = 'TRANSFORMERS_JS',
  UnitySentis = 'UNITY_SENTIS',
  Unknown = 'UNKNOWN'
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

export type TaskFilter = {
  /** filter by task -> pipelineType */
  pipelineType?: InputMaybe<PipelineType>;
};

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
  /** filter by teeOfferInfo -> subType */
  subType?: InputMaybe<TeeOfferSubtype>;
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
  subType: Scalars['String'];
  teeType: Scalars['String'];
};

export type TeeOfferInfoInput = {
  argsPublicKey: Scalars['String'];
  description: Scalars['String'];
  hardwareInfo: HardwareInfoInput;
  name: Scalars['String'];
  properties: Scalars['String'];
  subType: Scalars['String'];
  teeType: Scalars['String'];
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

/** The supported TEE offers subType. */
export enum TeeOfferSubtype {
  Default = 'Default',
  TeeSubtypeArm = 'TeeSubtypeARM',
  TeeSubtypeSev = 'TeeSubtypeSEV',
  TeeSubtypeSgx = 'TeeSubtypeSGX',
  TeeSubtypeTdx = 'TeeSubtypeTDX'
}

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

/** The supported value offers subType. */
export enum ValueOfferSubtype {
  Default = 'Default',
  ValueSubtypeDataset = 'ValueSubtypeDataset',
  ValueSubtypeEngine = 'ValueSubtypeEngine',
  ValueSubtypeModel = 'ValueSubtypeModel'
}

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


export type OffersQuery = { __typename?: 'Query', result: { __typename?: 'ListOffersResponse', pageData?: { __typename?: 'PageDataDto', count: number, limit: number, offset: number } | null, page: { __typename?: 'OfferConnection', pageInfo?: { __typename?: 'OfferPageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } | null, edges?: Array<{ __typename?: 'OfferEdge', cursor?: string | null, node?: { __typename?: 'Offer', _id: string, id: string, authority?: string | null, enabled: boolean, offerInfo: { __typename?: 'OfferInfo', name: string, group: string, offerType: string, cancelable: boolean, description: string, metadata: string, input: string, output: string, allowedArgs?: string | null, allowedAccounts: Array<string>, argsPublicKey: string, resultResource: string, linkage: string, hash: string, signatureKey: string, subType: string, restrictions?: { __typename?: 'OfferRestrictions', offers?: Array<string> | null, types?: Array<string> | null } | null }, slots: Array<{ __typename?: 'OfferSlot', id: string, info: { __typename?: 'SlotInfo', cpuCores: number, gpuCores: number, diskUsage: number, ram: number, vram: number }, usage: { __typename?: 'SlotUsage', maxTimeMinutes: number, minTimeMinutes: number, price: string, priceType: PriceType }, option: { __typename?: 'OptionInfo', bandwidth: number, externalPort: number, traffic: number } }>, origins?: { __typename?: 'Origins', createdBy: string, createdDate: number, modifiedBy: string, modifiedDate: number } | null, providerInfo: { __typename?: 'ProviderInformation', actionAccount: string, description: string, metadata: string, name: string, tokenReceiver: string } } | null }> | null } } };

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


export type MinimalConfigurationQuery = { __typename?: 'Query', result: { __typename?: 'OfferConfiguration', cpuCores: number, gpuCores: number, ram: number, vram: number, diskUsage: number, bandwidth: number, traffic: number, externalPort: number } };

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


export type OrderQuery = { __typename?: 'Query', order: { __typename?: 'Order', id: string, consumer: string, offerType: TOfferType, origins?: { __typename?: 'Origins', createdBy: string, createdDate: number, modifiedBy: string, modifiedDate: number } | null, orderInfo: { __typename?: 'OrderInfo', status: string, offerId: string, args: { __typename?: 'OrderArgs', inputOffersIds: Array<string>, outputOfferId: string, inputOffersVersions: Array<number>, outputOfferVersion: number }, resultInfo: { __typename?: 'OrderResultInfo', encryptedInfo: string, publicKey: string } }, teeOfferInfo?: { __typename?: 'TeeOfferInfo', name: string, description: string } | null, orderResult: { __typename?: 'OrderResult', encryptedResult?: string | null }, parentOrder?: { __typename?: 'ParentOrder', id: string, offerType: TOfferType } | null } };

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


export type TeeOffersQuery = { __typename?: 'Query', result: { __typename?: 'ListTeeOffersResponse', pageData?: { __typename?: 'PageDataDto', count: number, limit: number, offset: number } | null, page: { __typename?: 'TeeOfferConnection', edges?: Array<{ __typename?: 'TeeOfferEdge', cursor?: string | null, node?: { __typename?: 'TeeOffer', _id: string, id: string, authority: string, disabledAfter: number, enabled: boolean, origins?: { __typename?: 'Origins', createdBy: string, createdDate: number, modifiedBy: string, modifiedDate: number } | null, providerInfo: { __typename?: 'ProviderInformation', actionAccount: string, description: string, metadata: string, name: string, tokenReceiver: string }, teeOfferInfo: { __typename?: 'TeeOfferInfo', name: string, description: string, teeType: string, subType: string, properties: string, argsPublicKey: string, hardwareInfo: { __typename?: 'HardwareInfo', slotInfo: { __typename?: 'SlotInfo', cpuCores: number, gpuCores: number, ram: number, vram: number, diskUsage: number }, optionInfo: { __typename?: 'OptionInfo', bandwidth: number, traffic: number, externalPort: number } } }, slots: Array<{ __typename?: 'TeeOfferSlot', id: string, info: { __typename?: 'SlotInfo', cpuCores: number, gpuCores: number, diskUsage: number, ram: number, vram: number }, usage: { __typename?: 'SlotUsage', maxTimeMinutes: number, minTimeMinutes: number, price: string, priceType: PriceType } }>, options: Array<{ __typename?: 'TeeOfferOption', id: string, info: { __typename?: 'OptionInfo', bandwidth: number, externalPort: number, traffic: number }, usage: { __typename?: 'SlotUsage', maxTimeMinutes: number, minTimeMinutes: number, price: string, priceType: PriceType } }>, stats?: { __typename?: 'Stats', freeCores?: number | null, ordersInQueue?: number | null, new?: number | null, processing?: number | null } | null } | null }> | null, pageInfo?: { __typename?: 'TeeOfferPageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } | null } } };

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
            signatureKey
            subType
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
    gpuCores
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
        inputOffersIds
        outputOfferId
        inputOffersVersions
        outputOfferVersion
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
            subType
            properties
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
                gpuCores
                vram
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
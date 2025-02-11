import { Encryption, StorageProviderResource, TeeOrderEncryptedArgs } from '@super-protocol/dto-js';
import {
  BlockchainConnector,
  BlockchainId,
  OrderInfo,
  Orders,
  OrderSlots,
  OrderStatus,
  TeeOffer,
  helpers,
  RIGenerator,
} from '@super-protocol/sdk-js';
import { Config } from '../config';
import Printer from '../printer';
import {
  convertReadWriteStorageAccess,
  generateExternalId,
  isStorageConfigValid,
  Token,
} from '../utils';
import doWithRetries from './doWithRetries';
import { createOrder, CreateOrderParams, getCredentials } from '../commands/filesUpload.addon';

export type TeeOfferParams = {
  id: string;
  slotId: string;
  slotCount: number;
  optionsIds: string[];
  optionsCount: number[];
};

export type ValueOfferParams = {
  id: string;
  slotId: string;
};

export type CreateWorkflowParams = Omit<CreateOrderParams, 'storage'> & {
  teeOffer: TeeOfferParams;
  storageOffer: ValueOfferParams;
  inputOffers: ValueOfferParams[];
  resultPublicKey: string;
  encryptedInfo: string;
  argsToEncrypt: TeeOrderEncryptedArgs;
  holdDeposit: string;
  consumerAddress: string;
  storageAccess: Config['storage'];
  token: Pick<Token, 'address'>;
};

const createStorageOrderByOfferId = async (
  params: CreateWorkflowParams,
): Promise<helpers.ReadWriteStorageAccess> => {
  const storageOrderId = await createOrder({
    ...params,
    storage: [params.storageOffer.id],
  });
  Printer.print(`The storage order has been created successfully (id=${storageOrderId})`);

  const credentials = await getCredentials({
    ...params,
    key: params.resultEncryption.key,
    orderId: storageOrderId,
  });

  return {
    read: {
      storageType: params.storageAccess.type,
      credentials: credentials.read,
    },
    write: {
      storageType: params.storageAccess.type,
      credentials: credentials.write,
    },
  };
};

const processUploadToStorage = async (
  params: CreateWorkflowParams & {
    teeOrderArgsToEncrypt: TeeOrderEncryptedArgs;
    key: string;
    encryption: Encryption;
  },
): Promise<StorageProviderResource> => {
  Printer.print('TEE order arguments will be stored in distributed storage');
  const storageAccess: helpers.ReadWriteStorageAccess = isStorageConfigValid(params.storageAccess)
    ? convertReadWriteStorageAccess(params.storageAccess)
    : await createStorageOrderByOfferId(params);

  const resource = await helpers.OrderArgsHelper.uploadToStorage({
    args: params.teeOrderArgsToEncrypt,
    key: params.key,
    access: storageAccess,
    encryption: params.encryption,
  });
  Printer.print('Order arguments have been successfully uploaded to distributed storage.');

  return resource;
};

export default async (params: CreateWorkflowParams): Promise<BlockchainId> => {
  Printer.print('Fetching TEE offer');
  const teeOffer = new TeeOffer(params.teeOffer.id);
  const offerInfo = await teeOffer.getInfo();
  const externalId = generateExternalId();
  const teeOrderArgsToEncrypt: TeeOrderEncryptedArgs = params.argsToEncrypt;
  let storageProviderResource: StorageProviderResource | null = null;

  if (teeOrderArgsToEncrypt.configuration) {
    const encryptedConfiguration = await RIGenerator.encryptByTeeBlock(
      params.teeOffer.id,
      teeOrderArgsToEncrypt.configuration,
      params.pccsServiceApiUrl,
    );
    teeOrderArgsToEncrypt.configuration = JSON.stringify(encryptedConfiguration);
  }

  if (helpers.OrderArgsHelper.isMoreThanGivenSize(teeOrderArgsToEncrypt, Math.floor(2.5 * 1024))) {
    storageProviderResource = await processUploadToStorage({
      ...params,
      key: `orders-data/${externalId}`,
      teeOrderArgsToEncrypt,
      encryption: JSON.parse(offerInfo.argsPublicKey),
    });
  }

  Printer.print('Encrypting arguments');
  const encryptedArgs = await helpers.OrderArgsHelper.encryptOrderArgs(
    storageProviderResource ? { resource: storageProviderResource } : teeOrderArgsToEncrypt,
    JSON.parse(offerInfo.argsPublicKey),
  );

  const parentOrderInfo: OrderInfo = {
    offerId: params.teeOffer.id,
    offerVersion: 0,
    externalId: externalId,
    status: OrderStatus.New,
    args: {
      inputOffersIds: params.inputOffers.map((offer) => offer.id),
      outputOfferId: params.storageOffer.id,
      outputOfferVersion: 0,
      inputOffersVersions: params.inputOffers.map(() => 0),
    },
    encryptedArgs,
    resultInfo: {
      publicKey: params.resultPublicKey,
      encryptedInfo: params.encryptedInfo,
    },
    tokenAddress: params.token.address,
  };
  const parentOrderSlot: OrderSlots = {
    slotId: params.teeOffer.slotId,
    slotCount: params.teeOffer.slotCount,
    optionsIds: params.teeOffer.optionsIds,
    optionsCount: params.teeOffer.optionsCount,
  };

  const subOrdersInfo: OrderInfo[] = params.inputOffers.map((subOrderParams) => ({
    offerId: subOrderParams.id,
    offerVersion: 0,
    externalId: generateExternalId(),
    status: OrderStatus.New,
    args: {
      inputOffersIds: [],
      outputOfferId: params.storageOffer.id,
      inputOffersVersions: [],
      outputOfferVersion: 0,
    },
    encryptedArgs: '',
    resultInfo: {
      publicKey: '',
      encryptedInfo: '',
    },
    tokenAddress: params.token.address,
  }));
  const subOrdersSlots: OrderSlots[] = params.inputOffers.map((subOrderParams) => ({
    slotId: subOrderParams.slotId,
    slotCount: 0,
    optionsIds: [],
    optionsCount: [],
  }));

  const workflowCreationBLock = await BlockchainConnector.getInstance().getLastBlockInfo();

  await Orders.createWorkflow(
    parentOrderInfo,
    parentOrderSlot,
    subOrdersInfo,
    subOrdersSlots,
    params.holdDeposit,
    {
      gas: BigInt(10_000_000),
      from: params.consumerAddress,
    },
  );

  const orderLoaderFn = (): Promise<string> =>
    Orders.getByExternalId(
      { externalId, consumer: params.consumerAddress },
      workflowCreationBLock.index,
    ).then((event) => {
      if (event && event?.orderId !== '-1') {
        return event.orderId;
      }
      throw new Error("TEE order wasn't created. Try increasing the gas price.");
    });

  return doWithRetries(orderLoaderFn);
};

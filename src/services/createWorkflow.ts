import {
  Encryption,
  StorageProviderResource,
  StorjCredentials,
  TeeOrderEncryptedArgs,
} from '@super-protocol/dto-js';
import {
  BlockchainConnector,
  BlockchainId,
  OrderInfo,
  Orders,
  OrderSlots,
  OrderStatus,
  TeeOffer,
  helpers,
} from '@super-protocol/sdk-js';
import { Config } from '../config';
import Printer from '../printer';
import { generateExternalId } from '../utils';
import doWithRetries from './doWithRetries';
import { createOrder, CreateOrderParams, getCredentials } from '../commands/filesUpload';

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
  argsToEncrypt: string;
  holdDeposit: string;
  consumerAddress: string;
  storageAccess: Config['storage'];
};

const isStorageConfigValid = (access: CreateWorkflowParams['storageAccess']): boolean =>
  Boolean(access.bucket && access.readAccessToken && access.writeAccessToken);

const createStorageOrderByOfferId = async (
  params: CreateWorkflowParams,
): Promise<ReturnType<typeof getCredentials>> => {
  const storageOrderId = await createOrder({
    ...params,
    storage: [params.storageOffer.id],
  });
  Printer.print(`The storage order has been created successfully (id=${storageOrderId})`);

  return getCredentials({
    ...params,
    key: params.resultEncryption.key,
    orderId: storageOrderId,
  });
};

const processUploadToStorage = async (
  params: CreateWorkflowParams & {
    teeOrderArgsToEncrypt: TeeOrderEncryptedArgs;
    key: string;
    encryption: Encryption;
  },
): Promise<StorageProviderResource> => {
  Printer.print('TEE order arguments will be stored in distributed storage');
  const storageCredentials: { read: StorjCredentials; write: StorjCredentials } =
    isStorageConfigValid(params.storageAccess)
      ? {
          read: {
            bucket: params.storageAccess.bucket,
            prefix: params.storageAccess.prefix,
            token: params.storageAccess.readAccessToken,
          },
          write: {
            bucket: params.storageAccess.bucket,
            prefix: params.storageAccess.prefix,
            token: params.storageAccess.writeAccessToken,
          },
        }
      : await createStorageOrderByOfferId(params);

  const resource = await helpers.OrderArgsHelper.uploadToStorage({
    args: params.teeOrderArgsToEncrypt,
    key: params.key,
    access: {
      read: {
        storageType: params.storageAccess.type,
        credentials: storageCredentials.read,
      },
      write: {
        storageType: params.storageAccess.type,
        credentials: storageCredentials.write,
      },
    },
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
  let teeOrderArgsToEncrypt: TeeOrderEncryptedArgs | null = null;
  let storageProviderResource: StorageProviderResource | null = null;
  try {
    teeOrderArgsToEncrypt = JSON.parse(params.argsToEncrypt);
  } catch (err) {
    throw new Error(`Invalid args to encrypt: ${(err as Error).message}`);
  }

  if (
    teeOrderArgsToEncrypt &&
    helpers.OrderArgsHelper.hasMoreThanGivenElements(teeOrderArgsToEncrypt, 2)
  ) {
    storageProviderResource = await processUploadToStorage({
      ...params,
      key: `orders-data/${externalId}`,
      teeOrderArgsToEncrypt,
      encryption: JSON.parse(offerInfo.argsPublicKey),
    });
  }

  Printer.print('Encrypting arguments');
  const encryptedArgs = await helpers.OrderArgsHelper.encryptOrderArgs(
    { resource: storageProviderResource } || teeOrderArgsToEncrypt,
    JSON.parse(offerInfo.argsPublicKey),
  );

  const parentOrderInfo: OrderInfo = {
    offerId: params.teeOffer.id,
    externalId: externalId,
    status: OrderStatus.New,
    args: {
      inputOffers: params.inputOffers.map((offer) => offer.id),
      outputOffer: params.storageOffer.id,
    },
    encryptedArgs,
    resultInfo: {
      publicKey: params.resultPublicKey,
      encryptedInfo: params.encryptedInfo,
    },
  };
  const parentOrderSlot: OrderSlots = {
    slotId: params.teeOffer.slotId,
    slotCount: params.teeOffer.slotCount,
    optionsIds: params.teeOffer.optionsIds,
    optionsCount: params.teeOffer.optionsCount,
  };

  const subOrdersInfo: OrderInfo[] = params.inputOffers.map((subOrderParams) => ({
    offerId: subOrderParams.id,
    externalId: generateExternalId(),
    status: OrderStatus.New,
    args: {
      inputOffers: [],
      outputOffer: params.storageOffer.id,
    },
    encryptedArgs: '',
    resultInfo: {
      publicKey: '',
      encryptedInfo: '',
    },
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

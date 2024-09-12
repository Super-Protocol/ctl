import { Encryption, ResourceType } from '@super-protocol/dto-js';
import { Readable } from 'stream';
import {
  BlockchainConnector,
  BlockchainId,
  Crypto,
  OrderInfo,
  Orders,
  OrderSlots,
  OrderStatus,
  StorageAccess,
  TeeOffer,
} from '@super-protocol/sdk-js';
import { Config } from '../config';
import Printer from '../printer';
import { generateExternalId } from '../utils';
import doWithRetries from './doWithRetries';
import uploadService from './uploadFile';
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

type TiiBlock = { data: string[]; solution: string[]; image: string[] };
const useStorage = (args: string): boolean => {
  try {
    const deserializeArgs: TiiBlock = {
      data: [],
      solution: [],
      image: [],
      ...JSON.parse(args),
    };

    const count =
      deserializeArgs.data.length + deserializeArgs.solution.length + deserializeArgs.image.length;

    return count > 2;
  } catch (err) {
    throw new Error(`Invalid args to encrypt: ${(err as Error).message}`);
  }
};

const isStorageConfigValid = (access: CreateWorkflowParams['storageAccess']): boolean =>
  Boolean(access.bucket && access.readAccessToken && access.writeAccessToken);

type UploadCredentials = {
  read: StorageAccess;
  write: StorageAccess;
};

const uploadToStorage = async (params: {
  args: string;
  externalId: string;
  access: UploadCredentials;
  encryption: Encryption;
}): Promise<string> => {
  const { args, externalId, encryption } = params;

  const remotePath = `orders-data/${externalId}`;
  const encryptedData = JSON.stringify(await Crypto.encrypt(args, encryption));
  const buffer = Buffer.from(encryptedData);
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  await uploadService(stream, remotePath, params.access.write, buffer.length);

  const result = {
    resource: {
      type: ResourceType.StorageProvider,
      filepath: remotePath,
      ...params.access.read,
    },
  };

  return JSON.stringify(result);
};

export default async (params: CreateWorkflowParams): Promise<BlockchainId> => {
  Printer.print('Fetching TEE offer');
  const teeOffer = new TeeOffer(params.teeOffer.id);
  const offerInfo = await teeOffer.getInfo();

  const externalId = generateExternalId();
  let argsToEncrypt = params.argsToEncrypt;
  if (useStorage(argsToEncrypt)) {
    const access: UploadCredentials = {
      read: {
        storageType: params.storageAccess.type,
        credentials: {
          bucket: params.storageAccess.bucket,
          prefix: params.storageAccess.prefix,
          token: params.storageAccess.readAccessToken,
        },
      },
      write: {
        storageType: params.storageAccess.type,
        credentials: {
          bucket: params.storageAccess.bucket,
          prefix: params.storageAccess.prefix,
          token: params.storageAccess.writeAccessToken,
        },
      },
    };

    Printer.print('Order args will be stored into distributed storage');
    if (!isStorageConfigValid(params.storageAccess)) {
      const storageOrderId = await createOrder({
        ...params,
        storage: [params.storageOffer.id],
      });
      Printer.print(`Storage order has been created successfully (id=${storageOrderId})`);

      const credentials = await getCredentials({
        ...params,
        key: params.resultEncryption.key,
        orderId: storageOrderId,
      });

      access.read.credentials = credentials.read;
      access.write.credentials = credentials.write;
    }
    argsToEncrypt = await uploadToStorage({
      args: params.argsToEncrypt,
      externalId,
      access,
      encryption: JSON.parse(offerInfo.argsPublicKey),
    });
    Printer.print("Order's args has been uploaded into distributed storage successfully");
  }

  Printer.print('Encrypting arguments');
  const encryptedArgs = await Crypto.encrypt(argsToEncrypt, JSON.parse(offerInfo.argsPublicKey));

  const parentOrderInfo: OrderInfo = {
    offerId: params.teeOffer.id,
    externalId: externalId,
    status: OrderStatus.New,
    args: {
      inputOffers: params.inputOffers.map((offer) => offer.id),
      outputOffer: params.storageOffer.id,
    },
    encryptedArgs: JSON.stringify(encryptedArgs),
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

import { ResourceType } from '@super-protocol/dto-js';
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
import Printer from '../printer';
import { generateExternalId } from '../utils';
import doWithRetries from './doWithRetries';
import uploadService from './uploadFile';

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

export type CreateWorkflowParams = {
  teeOffer: TeeOfferParams;
  storageOffer: ValueOfferParams;
  inputOffers: ValueOfferParams[];
  resultPublicKey: string;
  encryptedInfo: string;
  argsToEncrypt: string;
  holdDeposit: string;
  consumerAddress: string;
  storageAccess?: StorageAccess;
};

const prepareArgsToEncrypt = async (
  args: string,
  externalId: string,
  access: StorageAccess,
): Promise<string> => {
  let deserializeArgs: { data: string[]; solution: string[]; image: string[] };
  try {
    deserializeArgs = {
      data: [],
      solution: [],
      image: [],
      ...JSON.parse(args),
    };
  } catch (err) {
    throw new Error(`Invalid args to encrypt: ${(err as Error).message}`);
  }

  const count =
    deserializeArgs.data.length + deserializeArgs.solution.length + deserializeArgs.image.length;
  if (count <= 2) {
    return args;
  }

  const remotePath = `orders-data/${externalId}`;
  const buffer = Buffer.from(args);
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  await uploadService(stream, remotePath, access, buffer.length);

  const result = {
    resource: {
      type: ResourceType.StorageProvider,
      storageType: access.storageType,
      filepath: remotePath,
      credentials: access.credentials,
    },
  };

  return JSON.stringify(result);
};

export default async (params: CreateWorkflowParams): Promise<BlockchainId> => {
  Printer.print('Fetching TEE offer');
  const teeOffer = new TeeOffer(params.teeOffer.id);
  const offerInfo = await teeOffer.getInfo();

  const externalId = generateExternalId();
  const argsToEncrypt = params.storageAccess
    ? await prepareArgsToEncrypt(params.argsToEncrypt, externalId, params.storageAccess)
    : params.argsToEncrypt;

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

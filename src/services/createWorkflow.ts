import { Encryption, StorageProviderResource, TeeOrderEncryptedArgs } from '@super-protocol/dto-js';
import {
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
import { convertReadWriteStorageAccess, generateExternalId, Token } from '../utils';
import { CreateOrderParams } from '../commands/filesUpload.addon';

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
  inputOffers: ValueOfferParams[];
  resultPublicKey: string;
  encryptedInfo: string;
  argsToEncrypt: TeeOrderEncryptedArgs;
  holdDeposit: string;
  consumerAddress: string;
  storageConfig: Config['storage'];
  token: Pick<Token, 'address'>;
};

const processUploadToStorage = async (
  params: CreateWorkflowParams & {
    teeOrderArgsToEncrypt: TeeOrderEncryptedArgs;
    key: string;
    encryption: Encryption;
  },
): Promise<StorageProviderResource> => {
  Printer.print('TEE order arguments will be stored in distributed storage');
  const resource = await helpers.OrderArgsHelper.uploadToStorage({
    args: params.teeOrderArgsToEncrypt,
    key: params.key,
    access: convertReadWriteStorageAccess(params.storageConfig),
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

  if (helpers.OrderArgsHelper.isMoreThanGivenSize(teeOrderArgsToEncrypt, Math.floor(2.5 * 1024))) {
    storageProviderResource = await processUploadToStorage({
      ...params,
      key: `orders-data/${externalId}`,
      teeOrderArgsToEncrypt,
      encryption: JSON.parse(offerInfo.argsPublicKey),
    });
  }

  Printer.print('Encrypting arguments');
  const encryptedArgs = helpers.OrderArgsHelper.encryptOrderArgs(
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

  const subOrdersInfo: OrderInfo[] = params.inputOffers.map(
    (subOrderParams) =>
      ({
        offerId: subOrderParams.id,
        offerVersion: 0,
        externalId: generateExternalId(),
        status: OrderStatus.New,
        args: {
          inputOffersIds: [],
          inputOffersVersions: [],
        },
        encryptedArgs: '',
        resultInfo: {
          publicKey: '',
          encryptedInfo: '',
        },
        tokenAddress: params.token.address,
      }) satisfies OrderInfo,
  );
  const subOrdersSlots: OrderSlots[] = params.inputOffers.map((subOrderParams) => ({
    slotId: subOrderParams.slotId,
    slotCount: 0,
    optionsIds: [],
    optionsCount: [],
  }));

  const parentOrderId = await Orders.createWorkflow(
    parentOrderInfo,
    parentOrderSlot,
    subOrdersInfo,
    subOrdersSlots,
    params.holdDeposit,
    {
      from: params.consumerAddress,
    },
  );
  return parentOrderId;
};

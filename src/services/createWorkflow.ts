import BlockchainConnector, {
  BlockchainId,
  Crypto,
  OrderInfo,
  Orders,
  OrderSlots,
  OrderStatus,
  TeeOffer,
} from '@super-protocol/sdk-js';
import Printer from '../printer';
import { generateExternalId } from '../utils';
import doWithRetries from './doWithRetries';

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
};

export default async (params: CreateWorkflowParams): Promise<BlockchainId> => {
  Printer.print('Fetching TEE offer');
  const teeOffer = new TeeOffer(params.teeOffer.id);
  const offerInfo = await teeOffer.getInfo();

  Printer.print('Encrypting arguments');
  const encryptedArgs = await Crypto.encrypt(
    params.argsToEncrypt,
    JSON.parse(offerInfo.argsPublicKey),
  );

  const externalId = generateExternalId();

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
      from: params.consumerAddress,
    },
  );

  const orderLoaderFn = () =>
    Orders.getByExternalId(
      { externalId, consumer: params.consumerAddress },
      workflowCreationBLock.index,
    ).then((event) => {
      if (event && event?.orderId !== '-1') {
        return event.orderId;
      }
      throw new Error("TEE order wasn't created. Try increasing the gas price.");
    });

  const orderId = await doWithRetries(orderLoaderFn);

  return orderId;
};

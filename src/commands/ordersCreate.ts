import {
  BlockchainId,
  Config as BlockchainConfig,
  Crypto,
  OfferType,
  OrderArgs,
  OrderInfo,
  Orders,
  OrderSlots,
  OrderStatus,
  ParamName,
  Superpro,
  ValueOfferSlot,
} from '@super-protocol/sdk-js';
import initBlockchainConnectorService from '../services/initBlockchainConnector';
import createOrderService from '../services/createOrder';
import { Encryption } from '@super-protocol/dto-js';
import Printer from '../printer';
import util from 'util';
import {
  checkFetchedOffers,
  FethchedOffer,
  getFetchedOffers,
  getHoldDeposit,
  getResultEncryption,
} from '../services/workflowHelpers';
import { PriceType, SlotUsage } from '../gql';
import { BigNumber } from 'ethers';
import { MINUTES_IN_HOUR } from '../constants';
import { generateExternalId, getObjectKey } from '../utils';
import approveTeeTokens from '../services/approveTeeTokens';

interface IOrderCreateCommandOptions {
  onlyOfferType: OfferType.Storage | OfferType.Data | OfferType.Solution;
}

export type OrderCreateParams = {
  accessToken: string;
  actionAccountKey: string;
  args: OrderArgs;
  backendUrl: string;
  blockchainConfig: BlockchainConfig;
  offerId: BlockchainId;
  resultEncryption: Encryption;
  slotId: BlockchainId;
  userDepositAmount?: string;
  minRentMinutes?: number;
  options?: Partial<IOrderCreateCommandOptions>;
};

const ONE_MB = 1 << 20;

const getCheckedOfferById = async (params: {
  accessToken: OrderCreateParams['accessToken'];
  backendUrl: OrderCreateParams['backendUrl'];
  offerId: OrderCreateParams['offerId'];
  slotId: OrderCreateParams['slotId'];
  options?: Partial<IOrderCreateCommandOptions>;
}): Promise<FethchedOffer> => {
  const offers: FethchedOffer[] = await getFetchedOffers({
    backendUrl: params.backendUrl,
    accessToken: params.accessToken,
    limit: 1,
    ids: [params.offerId],
  });

  if (offers.length !== 1) {
    throw Error(`Offer ${params.offerId} does not exist`);
  }

  const offer: FethchedOffer = offers[0];
  if (offer.offerInfo.offerType === OfferType.TeeOffer) {
    throw Error(`Unsupported offer type: ${getObjectKey(offer.offerInfo.offerType, OfferType)}`);
  }
  if (params.options?.onlyOfferType && params.options.onlyOfferType !== offer.offerInfo.offerType) {
    throw Error(
      `Only ${getObjectKey(params.options.onlyOfferType, OfferType)} offer type is supported`,
    );
  }

  if (offer.offerInfo.restrictions?.offers?.length || offer.offerInfo.restrictions?.types?.length) {
    throw Error(
      'Current command can only create simple single order without any restrictions to other offers',
    );
  }

  checkFetchedOffers(
    [{ id: params.offerId, slotId: params.slotId }],
    new Map<string, FethchedOffer>(offers.map((o) => [o.id, o])),
    offer.offerInfo.offerType as OfferType,
  );

  return offer;
};

const buildOrderInfo = async (params: {
  args: OrderCreateParams['args'];
  offerId: OrderCreateParams['offerId'];
  resultEncryption: OrderCreateParams['resultEncryption'];
  minRentMinutes: OrderCreateParams['minRentMinutes'];
  offerType: OfferType;
  slot: ValueOfferSlot;
  offerArgsPublicKey: string;
}): Promise<OrderInfo> => {
  const resultEncryption = getResultEncryption(params.resultEncryption);
  const getEncryptedArgs = async (
    key: string,
    minRentMinutes?: number,
    size?: number,
  ): Promise<string> => {
    const orderArgs = {
      hours: Math.max(1, Math.ceil((minRentMinutes || MINUTES_IN_HOUR) / 60)),
      sizeMb: Math.ceil((size || 0) / ONE_MB),
    };
    const encryptedArgs = await Crypto.encrypt(
      JSON.stringify(orderArgs),
      JSON.parse(key) as Encryption,
    );

    return JSON.stringify(encryptedArgs);
  };

  const encryptedArgs =
    params.offerType === OfferType.Storage
      ? await getEncryptedArgs(
          params.offerArgsPublicKey,
          params.minRentMinutes,
          params.slot?.info.diskUsage,
        )
      : '';

  return {
    args: params.args,
    encryptedArgs,
    encryptedRequirements: '',
    externalId: generateExternalId(),
    offerId: params.offerId,
    resultPublicKey: JSON.stringify(resultEncryption),
    status: OrderStatus.New,
  };
};

const buildOrderSlots = (params: { slotId: OrderCreateParams['slotId'] }): OrderSlots => ({
  slotId: params.slotId,
  slotCount: 0,
  optionsIds: [],
  optionsCount: [],
});

const initBlockchain = async (params: {
  blockchainConfig: OrderCreateParams['blockchainConfig'];
  actionAccountKey: OrderCreateParams['actionAccountKey'];
}): Promise<string> => {
  Printer.print('Connecting to the blockchain');
  const consumerAddress = await initBlockchainConnectorService({
    blockchainConfig: params.blockchainConfig,
    actionAccountKey: params.actionAccountKey,
  });

  if (!consumerAddress) {
    throw Error("Account can't be defined by key");
  }

  return consumerAddress;
};

const calcDepositBySlot = async (
  slot: ValueOfferSlot,
  minRentMinutes = MINUTES_IN_HOUR,
): Promise<BigNumber> => {
  const deposit = {
    fixed: BigNumber.from(0),
    perHour: BigNumber.from(0),
  };
  const addDeposit = (usage: SlotUsage, count = 1): void => {
    if (usage.priceType === PriceType.PerHour) {
      deposit.perHour = deposit.perHour.add(
        BigNumber.from(usage.price)
          .mul(count)
          .mul(Math.max(minRentMinutes, usage.minTimeMinutes))
          .div(MINUTES_IN_HOUR),
      );
    } else if (usage.priceType === PriceType.Fixed) {
      deposit.fixed = deposit.fixed.add(BigNumber.from(usage.price).mul(count));
    }
  };

  addDeposit(slot.usage);
  const orderMinDeposit = await Superpro.getParam(ParamName.OrderMinimumDeposit);
  const depositSum = deposit.fixed.add(deposit.perHour);

  return depositSum.gte(orderMinDeposit) ? depositSum : BigNumber.from(orderMinDeposit);
};

export default async (params: OrderCreateParams): Promise<string | undefined> => {
  try {
    const offer: FethchedOffer = await getCheckedOfferById(params);
    const slot = offer.slots.find((slot) => slot.id === params.slotId) as ValueOfferSlot;
    const orderInfo = await buildOrderInfo({
      args: params.args,
      offerId: params.offerId,
      resultEncryption: params.resultEncryption,
      minRentMinutes: params.minRentMinutes,
      slot,
      offerType: offer.offerInfo.offerType as OfferType,
      offerArgsPublicKey: offer.offerInfo.argsPublicKey,
    });
    const slots = buildOrderSlots(params);
    const consumerAddress = await initBlockchain(params);
    let holdDeposit = await calcDepositBySlot(slot, params.minRentMinutes);

    holdDeposit = await getHoldDeposit({
      consumerAddress,
      userDepositAmount: params.userDepositAmount,
      holdDeposit,
      minRentMinutes: params.minRentMinutes,
    });

    await approveTeeTokens({
      amount: holdDeposit,
      from: consumerAddress,
      to: Orders.address,
    });

    const orderId = await createOrderService({
      orderInfo,
      slots,
      consumerAddress,
      deposit: holdDeposit.toString(),
    });
    Printer.print(`Order (id=${orderId}) has been created successfully`);

    return orderId;
  } catch (err: unknown) {
    if (err instanceof Error) {
      Printer.error(`Order was not created: ${err.message}`);
    } else {
      Printer.error(`Order was not created by unknown reason: ${util.inspect(err)}`);
    }
  }
};

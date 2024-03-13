import {
  Analytics,
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
  helpers,
} from '@super-protocol/sdk-js';
import initBlockchainConnectorService from '../services/initBlockchainConnector';
import { Encryption } from '@super-protocol/dto-js';
import Printer from '../printer';
import {
  checkFetchedOffers,
  FethchedOffer,
  getFetchedOffers,
  getHoldDeposit,
} from '../services/workflowHelpers';
import { PriceType, SlotUsage, TOfferType } from '../gql';
import { BigNumber } from 'ethers';
import { MINUTES_IN_HOUR } from '../constants';
import { generateExternalId, getObjectKey } from '../utils';
import approveTeeTokens from '../services/approveTeeTokens';
import fetchMatchingValueSlots from '../services/fetchMatchingValueSlots';
import createOrderService from '../services/createOrder';
import { AnalyticsEvent } from '@super-protocol/sdk-js';
import { AnalyticEvent, IOrderEventProperties } from '../services/analytics';
import { EncryptionKey } from '../../../sp-dto-js/build';

interface IOrderCreateCommandOptions {
  onlyOfferType: OfferType.Storage | OfferType.Data | OfferType.Solution;
}

export type OrderCreateParams = {
  accessToken: string;
  actionAccountKey: string;
  analytics?: Analytics<AnalyticsEvent> | null;
  args: OrderArgs;
  backendUrl: string;
  blockchainConfig: BlockchainConfig;
  offerId: BlockchainId;
  pccsServiceApiUrl: string;
  resultEncryption: EncryptionKey;
  slotId?: BlockchainId;
  userDepositAmount?: string;
  minRentMinutes?: number;
  options?: Partial<IOrderCreateCommandOptions>;
};

const ONE_MB = 1 << 20;

const getCheckedOfferById = async (params: {
  accessToken: OrderCreateParams['accessToken'];
  backendUrl: OrderCreateParams['backendUrl'];
  offerId: OrderCreateParams['offerId'];
  slotId: string;
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
  pccsServiceApiUrl: string;
}): Promise<OrderInfo> => {
  const orderResultKeys = await helpers.getEncryptionKeysForOrder({
    offerId: params.offerId,
    encryptionPrivateKey: params.resultEncryption,
    pccsServiceApiUrl: params.pccsServiceApiUrl,
  });

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
          getMinRentMinutes({
            custom: params.minRentMinutes,
            slot: params.slot?.usage.minTimeMinutes,
          }),
          params.slot?.info.diskUsage,
        )
      : '';

  return {
    args: params.args,
    encryptedArgs,
    externalId: generateExternalId(),
    offerId: params.offerId,
    resultInfo: {
      publicKey: orderResultKeys.publicKey,
      encryptedInfo: orderResultKeys.encryptedInfo,
    },
    status: OrderStatus.New,
  };
};

const getMinRentMinutes = (minRentMinutes: { custom?: number; slot?: number }): number =>
  Math.max(minRentMinutes.custom ?? 0, minRentMinutes.slot ?? 0) || MINUTES_IN_HOUR;

const buildOrderSlots = (params: { slotId: string }): OrderSlots => ({
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

const calcDepositBySlot = async (slot: ValueOfferSlot, minRentMinutes = 0): Promise<BigNumber> => {
  const deposit = {
    fixed: BigNumber.from(0),
    perHour: BigNumber.from(0),
  };
  const addDeposit = (usage: SlotUsage, count = 1): void => {
    if (usage.priceType === PriceType.PerHour) {
      deposit.perHour = deposit.perHour.add(
        BigNumber.from(usage.price)
          .mul(count)
          .mul(
            getMinRentMinutes({
              custom: minRentMinutes,
              slot: usage.minTimeMinutes,
            }),
          )
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
    let slotId = params.slotId;
    if (!slotId) {
      const result = await fetchMatchingValueSlots({
        backendUrl: params.backendUrl,
        accessToken: params.accessToken,
        offerIds: [params.offerId.toString()],
        minRentMinutes: params.minRentMinutes,
      });

      slotId = result[0].slotId;
    }
    const offer: FethchedOffer = await getCheckedOfferById({
      ...params,
      slotId,
    });
    const slot = offer.slots.find((slot) => slot.id === slotId) as ValueOfferSlot;

    const orderInfo = await buildOrderInfo({
      args: params.args,
      offerId: params.offerId,
      resultEncryption: params.resultEncryption,
      minRentMinutes: params.minRentMinutes ?? 0,
      slot,
      offerType: offer.offerInfo.offerType as OfferType,
      offerArgsPublicKey: offer.offerInfo.argsPublicKey,
      pccsServiceApiUrl: params.pccsServiceApiUrl,
    });
    const slots = buildOrderSlots({
      ...params,
      slotId,
    });
    const consumerAddress = await initBlockchain(params);
    const holdDeposit = await getHoldDeposit({
      consumerAddress,
      userDepositAmount: params.userDepositAmount,
      holdDeposit: await calcDepositBySlot(slot, params.minRentMinutes),
      minRentMinutes: getMinRentMinutes({
        custom: params.minRentMinutes,
        slot: slot.usage.minTimeMinutes,
      }),
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

    const eventProperties: IOrderEventProperties = {
      orderId,
      offers: [
        {
          offer: params.offerId,
          offerType: getObjectKey(offer.offerInfo.offerType, OfferType) as TOfferType,
          slot: {
            id: slot.id,
            count: 1,
          },
        },
      ],
    };
    await params.analytics?.trackEventCatched({
      eventName: AnalyticEvent.ORDER_CREATED,
      eventProperties,
    });

    return orderId;
  } catch (err: unknown) {
    const errorMessage = (err as Error).message;
    Printer.error(`Order was not completed: ${errorMessage}`);
    await params.analytics?.trackEventCatched({
      eventName: AnalyticEvent.ORDER_CREATED,
      eventProperties: {
        result: 'error',
        error: errorMessage,
      },
    });
  }
};

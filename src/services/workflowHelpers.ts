import { ValueOfferParams } from './createWorkflow';
import { OfferType } from '@super-protocol/sdk-js';
import { etherToWei, getObjectKey, weiToEther } from '../utils';
import fetchOffers, { OfferItem } from './fetchOffers';
import { BigNumber } from 'ethers';
import Printer from '../printer';
import { MINUTES_IN_HOUR } from '../constants';
import getTeeBalance from './getTeeBalance';

export type FethchedOffer = {
  id: NonNullable<OfferItem>['id'];
  offerInfo: NonNullable<OfferItem>['offerInfo'];
  slots: NonNullable<OfferItem>['slots'];
};
export function calculateValueOffersMinTimeMinutes(
  offersWithSlot: ValueOfferParams[],
  allOffers: Map<string, FethchedOffer>,
): number {
  return offersWithSlot.reduce((greatestMinTimeMinutes: number, valueOffer: ValueOfferParams) => {
    const valueOfferSlot = allOffers
      .get(valueOffer.id)
      ?.slots.find((slot) => slot.id === valueOffer.slotId);
    if (valueOfferSlot) {
      return Math.max(valueOfferSlot?.usage.minTimeMinutes, greatestMinTimeMinutes);
    }
    return greatestMinTimeMinutes;
  }, 0);
}

export const checkSlot = (
  availableSlots: (string | undefined)[],
  offer: string,
  targetSlotId: string,
  offerType: OfferType,
): void => {
  if (!targetSlotId) {
    throw new Error(
      `${getObjectKey(
        offerType,
        OfferType,
      )} ${offer} slot is not specified, please use slot from this list: ${availableSlots}. For example: 8,${
        availableSlots?.[0]
      }`,
    );
  }
  if (!availableSlots?.includes(targetSlotId)) {
    throw new Error(
      `${getObjectKey(
        offerType,
        OfferType,
      )} ${offer} doesn't have slot ${targetSlotId}, please use slot from this list: ${availableSlots}`,
    );
  }
};

export const checkFetchedOffers = (
  ids: Array<{ id: string; slotId: string }>,
  offers: Map<string, FethchedOffer>,
  type: OfferType,
): void => {
  ids.forEach(({ id, slotId }) => {
    const fetchedOffer = offers.get(id);

    if (!fetchedOffer) {
      throw new Error(`Offer ${id} does not exist`);
      // TODO: move prettifying of offers from fetching to separate service and remove getObjectKey here
    } else if (fetchedOffer.offerInfo.offerType !== type) {
      throw new Error(
        `Offer ${id} has wrong type ${getObjectKey(
          fetchedOffer.offerInfo.offerType,
          OfferType,
        )} instead of ${getObjectKey(type, OfferType)}`,
      );
    } else
      checkSlot(
        fetchedOffer.slots?.map((slot) => slot.id),
        id,
        slotId,
        fetchedOffer.offerInfo.offerType,
      );
  });
};

export const getFetchedOffers = async (params: {
  backendUrl: string;
  accessToken: string;
  limit: number;
  ids: string[];
}): Promise<FethchedOffer[]> => {
  const result = await fetchOffers(params);

  return <FethchedOffer[]>result.list
    .filter((item) => Boolean(item))
    .map((item) => ({
      offerInfo: item?.offerInfo || {},
      slots: item?.slots || [],
      id: item?.id,
    }));
};

export const getHoldDeposit = async (params: {
  holdDeposit: BigNumber;
  userDepositAmount?: string;
  consumerAddress: string;
  minRentMinutes?: number;
}): Promise<BigNumber> => {
  const { userDepositAmount, minRentMinutes = MINUTES_IN_HOUR, consumerAddress } = params;
  let holdDeposit = params.holdDeposit;

  if (userDepositAmount) {
    const userDeposit = etherToWei(userDepositAmount);
    if (userDeposit.lt(holdDeposit)) {
      throw Error(
        `Provided deposit is less than the minimum required deposit of (${weiToEther(
          holdDeposit,
        )} TEE)`,
      );
    }
    holdDeposit = userDeposit;

    const balance = await getTeeBalance({ address: consumerAddress });
    if (balance.lt(holdDeposit)) {
      throw Error(
        `Balance of your account (${weiToEther(
          balance,
        )} TEE) is less than hold deposit (${weiToEther(holdDeposit)} TEE)`,
      );
    }
  }

  Printer.print(
    `Total deposit is ${weiToEther(holdDeposit)} TEE tokens for ${minRentMinutes} minutes`,
  );

  return holdDeposit;
};

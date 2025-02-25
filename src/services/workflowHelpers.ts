import { ValueOfferParams } from './createWorkflow';
import { OfferType, OfferVersion } from '@super-protocol/sdk-js';
import {
  ErrorWithCustomMessage,
  Token,
  createZodErrorMessage,
  etherToWei,
  getObjectKey,
  weiToEther,
} from '../utils';
import fetchOffers, { OfferItem } from './fetchOffers';
import { BigNumber } from 'ethers';
import Printer from '../printer';
import { MINUTES_IN_HOUR } from '../constants';
import getTeeBalance from './getTeeBalance';
import { selectLastValueOfferVersion } from './offerValueVersionHelper';
import { ParsedInputResource } from './parseInputResources';
import { SolutionResourceFileValidator } from './readResourceFile';
import { ZodError } from 'zod';

export type FetchedOffer = {
  id: NonNullable<OfferItem>['id'];
  offerInfo: NonNullable<OfferItem>['offerInfo'];
  version?: OfferVersion;
  slots: NonNullable<OfferItem>['slots'];
};
export function calculateValueOffersMinTimeMinutes(
  offersWithSlot: ValueOfferParams[],
  allOffers: Map<string, FetchedOffer>,
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
  offers: Map<string, FetchedOffer>,
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
}): Promise<FetchedOffer[]> => {
  const result = await fetchOffers(params);

  return <FetchedOffer[]>result.list
    .filter((item) => Boolean(item))
    .map((item) => ({
      offerInfo: item?.offerInfo || {},
      slots: item?.slots || [],
      id: item?.id,
      version: selectLastValueOfferVersion(item?.versions as OfferVersion[]),
    }));
};

export const getHoldDeposit = async (params: {
  holdDeposit: BigNumber;
  token: Pick<Token, 'address' | 'symbol'>;
  userDepositAmount?: string;
  consumerAddress: string;
  minRentMinutes?: number;
}): Promise<BigNumber> => {
  const { userDepositAmount, minRentMinutes = MINUTES_IN_HOUR, consumerAddress, token } = params;
  let holdDeposit = params.holdDeposit;

  if (userDepositAmount) {
    const userDeposit = etherToWei(userDepositAmount);
    if (userDeposit.lt(holdDeposit)) {
      throw Error(
        `Provided deposit is less than the minimum required deposit of (${weiToEther(
          holdDeposit,
        )} ${token.symbol})`,
      );
    }
    holdDeposit = userDeposit;

    const balance = await getTeeBalance({ address: consumerAddress, token });
    if (balance.lt(holdDeposit)) {
      throw Error(
        `Balance of your account (${weiToEther(
          balance,
        )} ${token.symbol}) is less than hold deposit (${weiToEther(holdDeposit)} ${token.symbol})`,
      );
    }
  }

  Printer.print(
    `Total deposit is ${weiToEther(holdDeposit)} ${token.symbol} tokens for ${minRentMinutes} minutes`,
  );

  return holdDeposit;
};

export const divideImagesAndSolutions = async (
  solutionParsedResource: ParsedInputResource,
): Promise<{ solutions: ParsedInputResource; images: ParsedInputResource }> => {
  const { offers, resourceFiles, tiis } = solutionParsedResource;

  const result: { solutions: ParsedInputResource; images: ParsedInputResource } = {
    solutions: {
      offers: solutionParsedResource.offers,
      resourceFiles: [],
      tiis: [],
    },
    images: {
      offers: [],
      resourceFiles: [],
      tiis: [],
    },
  };

  if (resourceFiles.length + tiis.length > 1) {
    throw new Error(
      `Only one resource can be run by resource file (or tii). Use base image from offer.`,
    );
  }

  if (offers.length && resourceFiles.length) {
    const resourceFile = resourceFiles[0];
    await SolutionResourceFileValidator.parseAsync(resourceFile).catch((error) => {
      const errorMessage = createZodErrorMessage((error as ZodError).issues);
      throw ErrorWithCustomMessage(
        `Schema validation failed for solution resource file :\n${errorMessage}`,
        error as Error,
      );
    });

    result.solutions.resourceFiles.push(...resourceFiles);
  }

  if (offers.length && tiis.length) {
    result.solutions.tiis.push(...tiis);
  }

  if (offers.length === 0 && resourceFiles.length) {
    result.images.resourceFiles.push(...resourceFiles);
  }

  if (offers.length === 0 && tiis.length) {
    result.images.tiis.push(...tiis);
  }

  return result;
};

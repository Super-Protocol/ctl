import {
  ParamName,
  Superpro,
  TeeOfferOption,
  TeeOfferSlot,
  ValueOfferSlot,
} from '@super-protocol/sdk-js';
import { BigNumber } from 'ethers';
import { TeeOfferParams, ValueOfferParams } from './createWorkflow';
import { FethchedOffer } from '../commands/workflowsCreate';
import { TeeOfferItem } from './fetchTeeOffers';
import { PriceType, SlotUsage } from '../gql';
import { MINUTES_IN_HOUR } from '../constants';

export class DepositCalculationError extends Error {}

export type CalcWorkflowDepositParams = {
  tee: TeeOfferParams;
  storage: ValueOfferParams;
  solutions: ValueOfferParams[];
  data: ValueOfferParams[];
  teeOffer: TeeOfferItem;
  valueOffers: Map<string, FethchedOffer>;
  minRentMinutes: number;
};

const calcWorkflowDeposit = async (params: CalcWorkflowDepositParams): Promise<BigNumber> => {
  const valueOffers = [...params.solutions, ...params.data, params.storage];
  const deposit = {
    fixed: BigNumber.from(0),
    perHour: BigNumber.from(0),
  };

  const { slotId, slotCount, optionsIds, optionsCount } = params.tee;

  const fetchedTeeSlot = params.teeOffer?.slots.find((slot) => slot.id === slotId) as TeeOfferSlot;

  const optionsMap: { [key: string]: TeeOfferOption } = {};
  params.teeOffer?.options.forEach((option) => {
    if (optionsIds.includes(option.id)) {
      optionsMap[option.id] = option;
    }
  });

  const addDeposit = (usage: SlotUsage, count = 1): void => {
    if (usage.priceType === PriceType.PerHour) {
      const minTimeMinutes = Math.max(params.minRentMinutes, usage.minTimeMinutes);

      deposit.perHour = deposit.perHour.add(
        BigNumber.from(usage.price).mul(count).mul(minTimeMinutes).div(MINUTES_IN_HOUR),
      );
    } else if (usage.priceType === PriceType.Fixed) {
      deposit.fixed = deposit.fixed.add(BigNumber.from(usage.price).mul(count));
    }
  };

  addDeposit(fetchedTeeSlot.usage, slotCount);

  optionsIds.forEach((optionId, index) =>
    addDeposit(optionsMap[optionId].usage, optionsCount[index]),
  );

  valueOffers.forEach((offer) => {
    const fetchedOffer = params.valueOffers.get(offer.id);
    const fetchedSlot = fetchedOffer?.slots.find(
      (slot) => slot.id === offer.slotId,
    ) as ValueOfferSlot;

    addDeposit(fetchedSlot.usage);
  });

  const orderMinDeposit = await Superpro.getParam(ParamName.OrderMinimumDeposit);
  const depositSum = deposit.fixed.add(deposit.perHour);

  return depositSum.gte(orderMinDeposit) ? depositSum : BigNumber.from(orderMinDeposit);
};

export default calcWorkflowDeposit;

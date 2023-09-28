import z from 'zod';
import { SlotInfo, SlotUsage } from '@super-protocol/sdk-js';
import readJsonFile from './readJsonFile';
import { SlotInfoValidator, SlotUsageValidator } from './baseValidators';
import { ReadFileParams } from './readValueOfferSlot';

export type TeeOfferSlot = {
  slotInfo: SlotInfo;
  slotUsage: SlotUsage;
};

const TeeOfferSlotFileValidator = z.object({
  slotInfo: SlotInfoValidator,
  slotUsage: SlotUsageValidator,
});

export default async (params: ReadFileParams): Promise<TeeOfferSlot> => {
  const teeOfferSlot = await readJsonFile({
    path: params.path,
    validator: TeeOfferSlotFileValidator,
  });

  return teeOfferSlot;
};

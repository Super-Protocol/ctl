import z from 'zod';
import { TeeOfferSlot } from '@super-protocol/sdk-js';
import readJsonFile from './readJsonFile';
import { SlotInfoValidator, SlotUsageValidator } from './baseValidators';
import { ReadFileParams } from './readValueOfferSlot';

const TeeOfferSlotFileValidator = z.object({
  id: z.string().optional(),
  info: SlotInfoValidator,
  usage: SlotUsageValidator,
});

export default async (params: ReadFileParams): Promise<TeeOfferSlot> => {
  const teeOfferSlot = await readJsonFile({
    path: params.path,
    validator: TeeOfferSlotFileValidator,
  });

  return teeOfferSlot;
};

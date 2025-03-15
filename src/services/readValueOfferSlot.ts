import z from 'zod';
import { ValueOfferSlot } from '@super-protocol/sdk-js';
import readJsonFile from './readJsonFile';
import { SlotInfoValidator, SlotUsageValidator, OptionInfoValidator } from './baseValidators';

export type ReadFileParams = {
  path: string;
};

const ValueOfferSlotFileValidator = z.object({
  id: z.string().optional(),
  info: SlotInfoValidator,
  usage: SlotUsageValidator,
  option: OptionInfoValidator,
  metadata: z.string().default(''),
});

export default async (params: ReadFileParams): Promise<ValueOfferSlot> => {
  const valueOfferSlot = await readJsonFile({
    path: params.path,
    validator: ValueOfferSlotFileValidator,
  });

  return valueOfferSlot;
};

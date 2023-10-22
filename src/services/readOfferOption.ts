import { TeeOfferOption } from '@super-protocol/sdk-js';
import readJsonFile from './readJsonFile';
import { OptionInfoValidator, SlotUsageValidator } from './baseValidators';
import { z } from 'zod';

export type ReadFileParams = {
  path: string;
};

const TeeOptionValidator = z.object({
  id: z.string().optional(),
  info: OptionInfoValidator,
  usage: SlotUsageValidator,
});

export default async (params: ReadFileParams): Promise<TeeOfferOption> => {
  const offerOption = await readJsonFile({
    path: params.path,
    validator: TeeOptionValidator,
  });

  return offerOption;
};

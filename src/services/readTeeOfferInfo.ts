import { TeeOfferInfo } from '@super-protocol/sdk-js';
import z from 'zod';
import readJsonFile from './readJsonFile';
import { EncryptionValidator } from './readResourceFile';
import { OptionInfoValidator, SlotInfoValidator } from './baseValidators';
import { ErrorWithCustomMessage, createZodErrorMessage } from '../utils';

export type ReadTeeOfferInfoFileParams = {
  path: string;
};

const HardwareInfoValidator = z.object({
  slotInfo: SlotInfoValidator,
  optionInfo: OptionInfoValidator,
});

const TeeOfferInfoFileValidator = z.object({
  name: z.string(),
  description: z.string(),
  teeType: z.string(),
  properties: z.string(),
  tlb: z.string(),
  argsPublicKey: z.string(),
  hardwareInfo: HardwareInfoValidator,
});

export default async (params: ReadTeeOfferInfoFileParams): Promise<TeeOfferInfo> => {
  const teeOfferInfo = await readJsonFile({
    path: params.path,
    validator: TeeOfferInfoFileValidator,
  });

  const argsPublicKeyValidation = EncryptionValidator.safeParse(
    JSON.parse(teeOfferInfo.argsPublicKey),
  );

  if (!argsPublicKeyValidation.success) {
    const errorMessage = createZodErrorMessage(argsPublicKeyValidation.error.issues);
    throw ErrorWithCustomMessage(
      `Schema validation failed for file ${params.path}:\n${errorMessage}`,
      argsPublicKeyValidation.error as Error,
    );
  }

  return teeOfferInfo;
};

import { TeeOfferInfo } from '@super-protocol/sdk-js';
import z from 'zod';
import readJsonFile from './readJsonFile';
import { EncryptionValidator } from './readResourceFile';
import { OptionInfoValidator, SlotInfoValidator } from './baseValidators';
import { ErrorWithCustomMessage, createZodErrorMessage } from '../utils';

export type ReadTeeOfferInfoFileParams = {
  path: string;
  isPartialContent: boolean;
};

const HardwareInfoValidator = z.object({
  slotInfo: SlotInfoValidator,
  optionInfo: OptionInfoValidator,
});

const OptionalHardwareInfoValidator = HardwareInfoValidator.extend({
  slotInfo: SlotInfoValidator.partial(),
  optionInfo: OptionInfoValidator.partial(),
}).partial();

const TeeOfferInfoFileValidator = z.object({
  name: z.string(),
  description: z.string(),
  teeType: z.string(),
  properties: z.string(),
  tlb: z.string(),
  argsPublicKey: z.string(),
  hardwareInfo: HardwareInfoValidator,
});

const OptionalTeeOfferInfoFileValidator = TeeOfferInfoFileValidator.extend({
  hardwareInfo: OptionalHardwareInfoValidator,
}).partial();

export async function readTeeOfferInfo(
  params: ReadTeeOfferInfoFileParams & { isPartialContent: false },
): Promise<TeeOfferInfo>;
export async function readTeeOfferInfo(
  params: ReadTeeOfferInfoFileParams & { isPartialContent: true },
): Promise<Partial<TeeOfferInfo>>;
export async function readTeeOfferInfo(
  params: ReadTeeOfferInfoFileParams,
): Promise<TeeOfferInfo | Partial<TeeOfferInfo>> {
  const teeOfferInfo = await readJsonFile({
    path: params.path,
    validator: params.isPartialContent
      ? OptionalTeeOfferInfoFileValidator
      : TeeOfferInfoFileValidator,
  });

  if (teeOfferInfo.argsPublicKey) {
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
  }

  return teeOfferInfo;
}

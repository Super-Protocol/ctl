/* eslint-disable prettier/prettier */
import { OfferGroup, OfferInfo, OfferType } from '@super-protocol/sdk-js';
import z, { ZodError } from 'zod';
import readJsonFile from './readJsonFile';
import { EncryptionValidator, ResourceValidator } from './readResourceFile';
import { ErrorWithCustomMessage, createZodErrorMessage } from '../utils';

export type ReadValueOfferInfoFileParams = {
  path: string;
  isPartialContent?: boolean;
};

const OfferInfoRestrictionsValidator = z.object({
  offers: z.array(z.string()),
  types: z.array(z.nativeEnum(OfferType)),
});

const OfferInfoFileValidator = z.object({
  name: z.string(),
  group: z.nativeEnum(OfferGroup),
  offerType: z.nativeEnum(OfferType),
  cancelable: z.boolean(),
  description: z.string(),
  restrictions: OfferInfoRestrictionsValidator,
  metadata: z.string(),
  input: z.string(),
  output: z.string(),
  allowedArgs: z.string(),
  allowedAccounts: z.array(z.string()),
  argsPublicKey: z.string(),
  resultResource: z.string(),
  linkage: z.string(),
  hash: z.string(),
});

const OptionalOfferInfoFileValidator = OfferInfoFileValidator.extend({
  restrictions: OfferInfoRestrictionsValidator.partial(),
}).partial();

export async function readValueOfferInfo(
  params: ReadValueOfferInfoFileParams & { isPartialContent: false },
): Promise<OfferInfo>;
export async function readValueOfferInfo(
  params: ReadValueOfferInfoFileParams & { isPartialContent: true },
): Promise<Partial<OfferInfo>>;
export async function readValueOfferInfo({
                    path,
                    isPartialContent = false,
                  }: ReadValueOfferInfoFileParams): Promise<OfferInfo | Partial<OfferInfo>> {
  const offerInfo = await readJsonFile({
    path,
    validator: isPartialContent ? OptionalOfferInfoFileValidator : OfferInfoFileValidator,
  });

  if (offerInfo.argsPublicKey) {
    const argsPublicKeyValidation = EncryptionValidator.safeParse(
      JSON.parse(offerInfo.argsPublicKey),
    );

    let validationError: ZodError | undefined;
    if (!argsPublicKeyValidation.success) {
      validationError = argsPublicKeyValidation.error;
    }

    const resultResourceValidation = ResourceValidator.nullable().safeParse(JSON.parse(offerInfo.resultResource || null));
    if (!resultResourceValidation.success) {
      validationError = resultResourceValidation.error;
    }

    if (validationError) {
      const errorMessage = createZodErrorMessage(validationError.issues);
      throw ErrorWithCustomMessage(
        `Schema validation failed for file ${path}:\n${errorMessage}`,
        validationError as Error,
      );
    }
  }

  return offerInfo;
}

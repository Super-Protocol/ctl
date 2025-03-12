/* eslint-disable prettier/prettier */
import {
  OfferGroup,
  OfferInfo,
  OfferType, OfferVersion,
  ValueOfferSubtype
} from '@super-protocol/sdk-js';
import z, { ZodError } from 'zod';
import readJsonFile from './readJsonFile';
import {EncryptionValidator, HashValidator, ResourceValidator} from './readResourceFile';
import { ErrorWithCustomMessage, createZodErrorMessage } from '../utils';

export type ReadValueOfferInfoFileParams = {
  path: string;
  isPartialContent?: boolean;
};

const OfferInfoRestrictionsSchema = z.object({
  offers: z.array(z.string()),
  versions: z.array(z.number()),
  types: z.array(z.nativeEnum(OfferType)),
});

const OfferVersionInfoSchema = z.object({
  metadata: z.object({}).catchall(z.unknown()).optional(),
  signatureKeyHash: HashValidator.optional(),
  hash: HashValidator.optional(),
});
const OfferVersionSchema = z.object({
  version: z.number(),
  info: OfferVersionInfoSchema,
});
const OfferInfoSchema = z.object({
  name: z.string(),
  group: z.nativeEnum(OfferGroup),
  offerType: z.nativeEnum(OfferType),
  cancelable: z.boolean(),
  description: z.string(),
  restrictions: OfferInfoRestrictionsSchema,
  input: z.string(),
  output: z.string(),
  allowedArgs: z.string(),
  allowedAccounts: z.array(z.string()),
  argsPublicKey: z.string(),
  resultResource: z.string(),
  subType: z.nativeEnum(ValueOfferSubtype),
  version: OfferVersionSchema.partial({ version: true }),
});

const OfferInfoFileSchema = OfferInfoSchema;

const OptionalOfferInfoFileValidator = OfferInfoSchema
  .omit({ version: true })
  .extend({ restrictions: OfferInfoRestrictionsSchema.partial()})
  .partial();

type OfferInfoFileType = OfferInfo & { version: OfferVersion };
type OptionalOfferInfoFileType = Partial<OfferInfo>;

export async function readValueOfferInfo(
  params: ReadValueOfferInfoFileParams & { isPartialContent: false },
): Promise<OfferInfoFileType>;
export async function readValueOfferInfo(
  params: ReadValueOfferInfoFileParams & { isPartialContent: true },
): Promise<OptionalOfferInfoFileType>;
export async function readValueOfferInfo({
                    path,
                    isPartialContent = false,
                  }: ReadValueOfferInfoFileParams): Promise<OfferInfoFileType | OptionalOfferInfoFileType> {
  const offerInfo = await readJsonFile({
    path,
    validator: isPartialContent ? OptionalOfferInfoFileValidator : OfferInfoFileSchema,
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

/* eslint-disable prettier/prettier */
import { OfferGroup, OfferInfo, OfferType } from '@super-protocol/sdk-js';
import z, { ZodError } from 'zod';
import readJsonFile from './readJsonFile';
import { EncryptionValidator, ResourceValidator } from './readResourceFile';
import { ErrorWithCustomMessage, createZodErrorMessage } from '../utils';

export type ReadValueOfferInfoFileParams = {
  path: string;
};

const OfferInfoFileValidator = z.object({
  name: z.string(),
  group: z.nativeEnum(OfferGroup),
  offerType: z.nativeEnum(OfferType),
  cancelable: z.boolean(),
  description: z.string(),
  restrictions: z.object({
    offers: z.array(z.string()),
    types: z.array(z.nativeEnum(OfferType)),
  }),
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

export default async (params: ReadValueOfferInfoFileParams): Promise<OfferInfo> => {
  const resourceFile = await readJsonFile({ path: params.path, validator: OfferInfoFileValidator });

  let validationError: ZodError| undefined;

  const argsPublicKeyValidation = EncryptionValidator.safeParse(
    JSON.parse(resourceFile.argsPublicKey),
  );
  if (!argsPublicKeyValidation.success) {
    validationError = argsPublicKeyValidation.error;
  }

  const resultResourceValidation = ResourceValidator.nullable().safeParse(JSON.parse(resourceFile.resultResource || null));
  if (!resultResourceValidation.success) {
    validationError = resultResourceValidation.error;
  }

  if (validationError) {
    const errorMessage = createZodErrorMessage(validationError.issues);
    throw ErrorWithCustomMessage(
      `Schema validation failed for file ${params.path}:\n${errorMessage}`,
      validationError as Error,
    );
  }

  const offerInfo: OfferInfo = {
    ...resourceFile,
  };

  return offerInfo;
};

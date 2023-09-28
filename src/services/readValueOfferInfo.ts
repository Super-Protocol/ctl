import { OfferGroup, OfferInfo, OfferType } from '@super-protocol/sdk-js';
import z from 'zod';
import readJsonFile from './readJsonFile';
import { EncryptionValidator, ResourceValidator } from './readResourceFile';

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
  argsPublicKey: EncryptionValidator,
  resultResource: ResourceValidator.nullable(),
  linkage: z.string(),
  hash: z.string(),
});

export default async (params: ReadValueOfferInfoFileParams) => {
  const resourceFile = await readJsonFile({ path: params.path, validator: OfferInfoFileValidator });
  const resultResource = resourceFile.resultResource
    ? JSON.stringify(resourceFile.resultResource)
    : '';

  const offerInfo: OfferInfo = {
    ...resourceFile,
    argsPublicKey: JSON.stringify(resourceFile.argsPublicKey),
    resultResource,
  };

  return offerInfo;
};

import { OfferVersionInfo } from '@super-protocol/sdk-js';
import readJsonFile from './readJsonFile';
import { HashValidator } from '../services/readResourceFile';
import { z } from 'zod';

export type ReadFileParams = {
  path: string;
};

const OfferVersionInfoSchema = z.object({
  metadata: z.object({}).catchall(z.unknown()).optional(),
  signatureKeyHash: HashValidator.optional(),
  hash: HashValidator.optional(),
});

export default async (params: ReadFileParams): Promise<OfferVersionInfo> => {
  const offerOption = await readJsonFile({
    path: params.path,
    validator: OfferVersionInfoSchema,
  });

  return offerOption;
};

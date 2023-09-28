import z from 'zod';
import {
  CryptoAlgorithm,
  Encoding,
  Encryption,
  Hash,
  HashAlgorithm,
  Linkage,
  Resource,
  ResourceType,
  StorageType,
} from '@super-protocol/dto-js';
import readJsonFile from './readJsonFile';

export type ReadResourceFileParams = {
  path: string;
};

export type ResourceFile = {
  resource: Resource;
  encryption?: Encryption;
  linkage?: Linkage;
  hash?: Hash;
  args?: any;
};
export const ResourceValidator = z
  .object({
    type: z.enum([ResourceType.Url]),
    url: z.string().min(1),
  })
  .or(
    z.object({
      type: z.enum([ResourceType.StorageProvider]),
      storageType: z.nativeEnum(StorageType),
      filepath: z.string(),
      credentials: z.any(),
    }),
  );

export const EncryptionValidator = z.object({
  algo: z.nativeEnum(CryptoAlgorithm),
  encoding: z.nativeEnum(Encoding),
  key: z.string(),
});

const ResourceFileValidator = z.object({
  resource: ResourceValidator,
  encryption: EncryptionValidator.optional(),
  linkage: z
    .object({
      encoding: z.nativeEnum(Encoding),
      mrenclave: z.string(),
    })
    .optional(),
  hash: z
    .object({
      algo: z.nativeEnum(HashAlgorithm),
      hash: z.string(),
      encoding: z.nativeEnum(Encoding),
    })
    .optional(),
  args: z.any().optional(),
});

const readResourceFile = async (params: ReadResourceFileParams): Promise<ResourceFile> => {
  const resourceFile = await readJsonFile({ path: params.path, validator: ResourceFileValidator });

  return resourceFile;
};

export default readResourceFile;

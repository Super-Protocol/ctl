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
  validator?:
    | typeof SolutionResourceFileValidator
    | typeof ResourceFileValidator
    | typeof EncryptedResourceFileValidator;
};

export type ResourceFile = {
  resource: Resource;
  encryption?: Encryption;
  linkage?: Linkage;
  hash?: Hash;
  args?: any;
};

export const UrlResourceValidator = z.object({
  type: z.enum([ResourceType.Url]),
  url: z.string().min(1),
});
export const StorageProviderResourceValidator = z.object({
  type: z.enum([ResourceType.StorageProvider]),
  storageType: z.nativeEnum(StorageType),
  filepath: z.string(),
  credentials: z.any(),
});

export const ResourceValidator = UrlResourceValidator.or(StorageProviderResourceValidator);

export const EncryptionValidator = z.object(
  {
    algo: z.nativeEnum(CryptoAlgorithm),
    encoding: z.nativeEnum(Encoding),
    key: z.string(),
  },
  { required_error: 'required. Resource must be encrypted' },
);

export const ResourceFileValidator = z.object({
  resource: ResourceValidator,
  encryption: EncryptionValidator.optional(),
  hash: z
    .object({
      algo: z.nativeEnum(HashAlgorithm),
      hash: z.string(),
      encoding: z.nativeEnum(Encoding),
    })
    .optional(),
  args: z.any().optional(),
});

export const EncryptedResourceFileValidator = ResourceFileValidator.extend({
  encryption: EncryptionValidator,
});

export const SolutionResourceFileValidator = ResourceFileValidator.extend({
  linkage: z.object({
    encoding: z.nativeEnum(Encoding),
    mrenclave: z.string(),
    mrsigner: z.string(),
  }),
});

const readResourceFile = async (params: ReadResourceFileParams): Promise<ResourceFile> => {
  const resourceFile = await readJsonFile({
    path: params.path,
    validator: params.validator ?? ResourceFileValidator,
  });

  return resourceFile;
};

export default readResourceFile;

import z from 'zod';
import {
  CryptoAlgorithm,
  Encoding,
  EncryptionWithIV,
  HashAlgorithm,
  Resource,
  ResourceType,
  RuntimeInputInfo,
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

export type ResourceFile = Partial<
  Pick<RuntimeInputInfo, 'args' | 'hash' | 'hardwareContext' | 'signatureKeyHash'>
> & {
  resource: Resource;
  encryption?: EncryptionWithIV;
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

export const HashValidator = z.object({
  algo: z.nativeEnum(HashAlgorithm),
  hash: z.string(),
  encoding: z.nativeEnum(Encoding),
});

export const ResourceFileValidator = z.object({
  resource: ResourceValidator,
  encryption: EncryptionValidator.optional(),
  hash: HashValidator.optional(),
  args: z.unknown().optional(),
});

export const EncryptedResourceFileValidator = ResourceFileValidator.extend({
  encryption: EncryptionValidator,
});

export const SolutionResourceFileValidator = ResourceFileValidator.extend({
  signatureKeyHash: HashValidator.nullable().optional(),
  hardwareContext: z
    .object({
      mrEnclave: HashValidator.optional(),
    })
    .catchall(z.unknown())
    .nullable()
    .optional(),
});

const readResourceFile = async (params: ReadResourceFileParams): Promise<ResourceFile> => {
  const resourceFile = await readJsonFile({
    path: params.path,
    validator: params.validator ?? ResourceFileValidator,
  });

  return resourceFile;
};

export default readResourceFile;

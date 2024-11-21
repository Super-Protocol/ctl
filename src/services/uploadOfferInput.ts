import _ from 'lodash';
import { StorageAccess, getStorageProvider, helpers } from '@super-protocol/sdk-js';
import { StorageProviderResource } from '@super-protocol/dto-js';
import { Config } from '../config';
import { convertReadWriteStorageAccess, isStorageConfigValid } from '../utils';

export type UploadOfferInputObjParams = {
  data: Record<string, unknown>;
  storageConfig: Config['storage'];
  offerName: string;
};

const fileFolder = 'offer-inputs/';
const defaultName = 'nameless-offer';

export const uploadOfferInput = async (
  params: UploadOfferInputObjParams,
): Promise<StorageProviderResource> => {
  const { storageConfig, offerName, data } = params;

  if (!isStorageConfigValid(storageConfig)) {
    throw new Error(
      `Storage block in your config lacks some mandatory data! Check: bucket, readAccessToken, writeAccessToken`,
    );
  }

  const storageAccess: StorageAccess = {
    storageType: storageConfig.type,
    credentials: {
      bucket: storageConfig.bucket,
      prefix: storageConfig.prefix,
      token: storageConfig.writeAccessToken,
    },
  };
  const nextInputIndex = await getNextInputIndex(offerName, storageAccess);
  const readWriteAccess = convertReadWriteStorageAccess(storageConfig);
  return helpers.uploadObjectToStorage({
    access: readWriteAccess,
    data,
    filepath: `${getOfferInputFilePrefix(offerName)}-${nextInputIndex}`,
  });
};

const getNextInputIndex = async (
  offerName: string,
  storageAccess: StorageAccess,
): Promise<number> => {
  const offerInputFilePrefix = getOfferInputFilePrefix(offerName);
  const storageProvider = getStorageProvider(storageAccess);
  const allObjects = await storageProvider.listObjects(fileFolder);

  const indexes = allObjects
    .filter((object) => object.name.startsWith(offerInputFilePrefix))
    .map((object) => {
      const index = Number(object.name.split('-').at(-1));

      return isNaN(index) ? 0 : index;
    });

  return Math.max(0, ...indexes) + 1;
};

const getOfferInputFilePrefix = (offerName: string): string =>
  `${fileFolder}${_.kebabCase(offerName) || defaultName}`;

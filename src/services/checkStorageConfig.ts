import { Config } from '../config';
import { isStorageConfigValid } from '../utils';

export const checkStorageConfig = (storageConfig?: Config['storage']): Config['storage'] => {
  if (isStorageConfigValid(storageConfig)) {
    return storageConfig!;
  }

  throw new Error(
    [
      'Storage credentials are missing or invalid. Please set valid credentials in config.json under the "storage" section (type, bucket, prefix, readAccessToken, writeAccessToken).',
      'You can obtain credentials by creating a storage order and then downloading its result using the following commands:',
      '',
      './spctl orders create --offer <offerId>',
      './spctl orders download-result <orderId>',
    ].join('\n'),
  );
};

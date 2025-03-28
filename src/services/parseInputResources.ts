import readResourceFile, { ReadResourceFileParams, ResourceFile } from './readResourceFile';
import { AESEncryption, Cipher, CryptoAlgorithm, Encoding } from '@super-protocol/dto-js';
import { preparePath } from '../utils';
import readJsonFile from './readJsonFile';
import { ValueOfferParams } from './createWorkflow';
import fetchMatchingValueSlots from './fetchMatchingValueSlots';

export type ParseInputResourcesParams = {
  options: string[];
  backendUrl: string;
  accessToken: string;
  isTee?: boolean;
  minRentMinutes?: number;
  resourceValidator?: ReadResourceFileParams['validator'];
};

export type ParsedInputResource = {
  resourceFiles: ResourceFile[];
  offers: ValueOfferParams[];
  tiis: string[];
};

const idRegexp = /^(?:\d+,)?\d+$/;

export default async (params: ParseInputResourcesParams): Promise<ParsedInputResource> => {
  const resourceFiles: ResourceFile[] = [],
    offers: ValueOfferParams[] = [],
    tiis: string[] = [];
  await Promise.all(
    params.options.map(async (param) => {
      if (idRegexp.test(param)) {
        // eslint-disable-next-line prefer-const
        let [offerId, slotId] = param.split(',');
        if (!slotId && !params.isTee) {
          const result = await fetchMatchingValueSlots({
            backendUrl: params.backendUrl,
            accessToken: params.accessToken,
            offerIds: [param],
            minRentMinutes: params.minRentMinutes,
          });

          slotId = result[0].slotId;
        }
        offers.push({ id: offerId, slotId });
        return;
      }

      // TODO: optimize double file reading
      const file = await readJsonFile({ path: preparePath(param) });
      if (file.encryptedTRI) {
        tiis.push(JSON.stringify(file));
        return;
      }

      const resourceFile = await readResourceFile({
        path: preparePath(param),
        validator: params.resourceValidator,
      });

      // TODO: remove this code, after TII with no encryption will be allowed
      if (!resourceFile.encryption) {
        resourceFile.encryption = {
          algo: CryptoAlgorithm.AES,
          encoding: Encoding.base64,
          cipher: Cipher.AES_256_GCM,
          iv: '',
          mac: '',
          key: '',
        } as AESEncryption;
      }

      resourceFiles.push(resourceFile);
    }),
  );

  return {
    resourceFiles,
    offers,
    tiis,
  };
};

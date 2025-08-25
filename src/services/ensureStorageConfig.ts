import { StorageType } from '@super-protocol/dto-js';
import ConfigLoader, { Config } from '../config';
import { isStorageConfigValid, getConfigPath } from '../utils';
import { getSdk, TOfferType } from '../gql';
import { GraphQLClient } from 'graphql-request';
import getGqlHeaders from './gqlHeaders';
import fetchMatchingValueSlots from './fetchMatchingValueSlots';
import { createOrder as createStorageOrder, getCredentials } from '../commands/filesUpload.addon';
import Printer from '../printer';
import { MINUTES_IN_YEAR } from '../constants';

const findStorageOffer = async (
  backend: Config['backend'],
): Promise<{ offerId: string; slotId: string }> => {
  const sdk = getSdk(new GraphQLClient(backend.url));
  const headers = getGqlHeaders(backend.accessToken);

  const { result } = await sdk.Offers(
    {
      pagination: {
        first: 50,
        sortDir: 'DESC',
        sortBy: 'origins.createdDate',
      },
      filter: { offerType: TOfferType.Storage, enabled: true },
    },
    headers,
  );

  const offers = result.page.edges?.map((e) => e.node).filter(Boolean) || [];
  const offerIds = offers.map((o) => o!.id!).filter(Boolean);
  if (!offerIds.length) {
    throw new Error('No available storage offers found');
  }

  const pairs = await fetchMatchingValueSlots({
    backendUrl: backend.url,
    accessToken: backend.accessToken,
    offerIds,
    minRentMinutes: MINUTES_IN_YEAR,
  });

  if (!pairs.length) {
    throw new Error('No matching storage slots found');
  }

  const { offerId, slotId } = pairs[0];

  return { offerId, slotId };
};

export const ensureStorageConfig = async (
  storageConfig?: Config['storage'],
): Promise<Config['storage']> => {
  if (isStorageConfigValid(storageConfig)) {
    return storageConfig!;
  }

  try {
    const configLoader = new ConfigLoader(getConfigPath());
    const backend = configLoader.loadSection('backend');
    const blockchain = configLoader.loadSection('blockchain');
    const workflow = configLoader.loadSection('workflow');
    const { pccsServiceApiUrl } = configLoader.loadSection('tii');

    Printer.print('Storage credentials are missing. Auto-provisioning storage...');

    const { offerId, slotId } = await findStorageOffer(backend);
    Printer.print(`Found storage offer: ${offerId} with slot: ${slotId}`);

    const orderId = await createStorageOrder({
      analytics: null,
      storage: [offerId, slotId],
      minRentMinutes: MINUTES_IN_YEAR,
      backendUrl: backend.url,
      accessToken: backend.accessToken,
      actionAccountKey: blockchain.accountPrivateKey,
      blockchainConfig: {
        contractAddress: blockchain.smartContractAddress,
        blockchainUrl: blockchain.rpcUrl,
      },
      resultEncryption: workflow.resultEncryption,
      pccsServiceApiUrl,
    });

    const creds = await getCredentials({
      analytics: null,
      accessToken: backend.accessToken,
      backendUrl: backend.url,
      key: workflow.resultEncryption.key,
      orderId,
    });

    const newStorage: Config['storage'] = {
      type: StorageType.StorJ,
      bucket: creds.read.bucket,
      prefix: creds.read.prefix,
      writeAccessToken: creds.write.token,
      readAccessToken: creds.read.token,
    };

    configLoader.updateSection('storage', newStorage);
    Printer.print('Storage credentials have been saved to config.json');

    return newStorage;
  } catch (err: unknown) {
    throw new Error(
      [
        'Storage credentials are missing or invalid. Please set valid credentials in config.json under the "storage" section (type, bucket, prefix, readAccessToken, writeAccessToken).',
        'You can obtain credentials by creating a storage order and then downloading its result using the following commands:',
        '',
        './spctl orders create --offer <offerId>',
        './spctl orders download-result <orderId>',
        '',
        `Auto-provisioning failed: ${(err as Error).message}`,
      ].join('\n'),
    );
  }
};

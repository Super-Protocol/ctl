import { promises as fs } from 'fs';
import downloadService from '../services/downloadFile';
import Printer from '../printer';
import { isCommandSupported } from '../services/uplinkSetupHelper';
import { ResourceType, StorageProviderResource, UrlResource } from '@super-protocol/dto-js';
import downloadFileByUrl from '../services/downloadFileByUrl';
import initBlockchainConnector from '../services/initBlockchainConnector';
import { Config as BlockchainConfig } from '@super-protocol/sdk-js';
import { preparePath } from '../utils';
import getOfferContent from '../services/getOfferContent';

export type OfferDownloadParamsParams = {
  blockchainConfig: BlockchainConfig;
  offerId: string;
  localDir: string;
};

export default async (params: OfferDownloadParamsParams): Promise<void> => {
  Printer.print('Connecting to the blockchain');
  await initBlockchainConnector({
    blockchainConfig: params.blockchainConfig,
  });

  Printer.print('Fetching offer content');
  const resource = await getOfferContent({ offerId: params.offerId });
  if (!resource) {
    Printer.print(`Offer ${params.offerId} does not allow to download its content`);
    return;
  }

  Printer.print('Offer content is available for download');
  const localDir = preparePath(params.localDir).replace(/\/$/, '');
  const info = await fs.stat(localDir);
  if (!info.isDirectory()) {
    throw new Error('Save path must be the path to a folder');
  }
  const defaultFilename = '/offer.tar.gz';
  let localPath: string;

  switch (resource.type) {
    case ResourceType.Url:
      localPath = localDir + defaultFilename;
      await downloadFileByUrl({
        url: (resource as UrlResource).url,
        savePath: localDir + defaultFilename,
        progressListener: (total, current) => {
          Printer.progress('Downloading file', total, current);
        },
      });
      break;

    case ResourceType.StorageProvider: {
      if (!isCommandSupported()) return;

      const storageProviderResource = resource as StorageProviderResource;
      localPath = `${localDir}/${storageProviderResource.filepath}`;
      await downloadService(
        storageProviderResource.filepath,
        localPath,
        storageProviderResource,
        (total: number, current: number) => {
          Printer.progress('Downloading file', total, current);
        },
      );
      break;
    }
    default:
      throw Error(`Resource type ${resource.type} is not supported`);
  }

  Printer.stopProgress();
  Printer.print(`Offer content was saved to ${localPath}`);
};

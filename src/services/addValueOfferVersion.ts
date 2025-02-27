import {
  BlockchainConnector,
  BlockchainId,
  NotFoundError,
  Offer,
  OfferVersion,
  OfferVersionInfo,
} from '@super-protocol/sdk-js';
import Printer from '../printer';

export type AddOfferVersionParams = {
  action: string;
  offerId: BlockchainId;
  version?: number;
  versionInfo: OfferVersionInfo;
};

export default async (params: AddOfferVersionParams): Promise<number> => {
  const actionAddress = await BlockchainConnector.getInstance().initializeActionAccount(
    params.action,
  );
  if (params.version !== undefined && params.version < 0) {
    throw new Error('Offer version number must be greater than or equal to 0');
  }

  Printer.print('Adding new value offer version');
  const offer = new Offer(params.offerId);
  const versionCount = await offer.getVersionCount();
  if (versionCount) {
    if (params.version !== undefined) {
      let version: OfferVersion | null = null;
      try {
        version = await offer.getVersion(params.version);
      } catch (err) {
        if (!(err instanceof NotFoundError)) {
          throw err;
        }
      }
      if (version) {
        throw new Error(`Version number ${params.version} is already exists`);
      }
    }
  }
  const newVersionNumber = params.version ?? versionCount + 1;

  await offer.setNewVersion(newVersionNumber, params.versionInfo, {
    from: actionAddress,
  });
  Printer.print(`Value offer version has been created (version=${newVersionNumber})`);

  return newVersionNumber;
};

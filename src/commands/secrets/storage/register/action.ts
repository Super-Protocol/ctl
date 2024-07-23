import { Offer, OfferType } from '@super-protocol/sdk-js';
import Printer from '../../../../printer';
import { REGISTER_COMMAND, SECRET_COMMAND, STATUS_COMMAND, STORAGE_COMMAND } from '../../constants';
import { findStorageOrderId, registerStorage, RegisterStorageParams } from './service';
import initBlockchainConnector from '../../../../services/initBlockchainConnector';
import ConfigLoader from '../../../../config';

export type RegisterActionOptions = {
  version?: number;
  storageOffer: string;
  storageSlot: string;
  minRent: number;
  replicationFactor: number;
  retryCount: number;
  retryInterval: number;
  config: string;
  force: boolean;
};

const checkParams = async (params: {
  offerId: string;
  storageOfferId: string;
  storageSlotId: string;
}): Promise<void> => {
  const type = await new Offer(params.offerId).getOfferType();
  if (type !== OfferType.Solution) {
    throw Error(`Invalid solution offer id ${params.offerId}`);
  }

  const offerStorage = new Offer(params.storageOfferId);
  const offerStorageType = await offerStorage.getOfferType();
  if (offerStorageType !== OfferType.Storage) {
    throw Error(`Invalid storage offer id ${params.storageOfferId}`);
  }

  try {
    await offerStorage.getSlotById(params.storageSlotId);
  } catch {
    throw Error(`Invalid storage slot id ${params.storageSlotId}`);
  }
};

export const registerAction = async (
  offerId: string,
  options: RegisterActionOptions,
): Promise<void> => {
  try {
    const configLoader = new ConfigLoader(options.config);
    const blockchain = configLoader.loadSection('blockchain');
    const blockchainConfig = {
      contractAddress: blockchain.smartContractAddress,
      blockchainUrl: blockchain.rpcUrl,
    };
    const { pccsServiceApiUrl } = configLoader.loadSection('tii');

    await initBlockchainConnector({
      blockchainConfig,
      actionAccountKey: blockchain.accountPrivateKey,
    });

    await checkParams({
      offerId,
      storageOfferId: options.storageOffer,
      storageSlotId: options.storageSlot,
    });

    const params: RegisterStorageParams = {
      offerId,
      offerVersion: options.version,
      replicationFactor: options.replicationFactor,
      storageOfferId: options.storageOffer,
      storageSlotId: options.storageSlot,
      storageOrderDepositDurationInHours: options.minRent,
      retryCount: options.retryCount,
      retryInterval: options.retryInterval,
      pccsServiceApiUrl,
    };

    if (!options.force) {
      const storageOrderId = await findStorageOrderId(params);
      if (storageOrderId) {
        const commandWithForce = [
          SECRET_COMMAND,
          STORAGE_COMMAND,
          REGISTER_COMMAND,
          offerId,
          options.version ? `--version ${options.version}` : '',
          `--storage-offer ${options.storageOffer}`,
          `--storage-slot ${options.storageSlot}`,
          `--min-rent ${options.minRent}`,
          `--replication-factor ${options.replicationFactor}`,
          options.config ? `--config ${options.config}` : '',
          '--force',
        ]
          .filter(Boolean)
          .join(' ');

        Printer.print(
          `Storage already exists (id=${storageOrderId}). If you want to register a new storage, please run the following command:\n\n  ./spctl ${commandWithForce}`,
        );
        return;
      }
    }

    const id = await registerStorage(params);

    if (id) {
      Printer.print(`Storage was registered (orderId=${id})`);
    } else {
      const statusCommand = [
        SECRET_COMMAND,
        STORAGE_COMMAND,
        STATUS_COMMAND,
        offerId,
        options.version ? `--version ${options.version}` : '',
        options.config ? `--config ${options.config}` : '',
      ]
        .filter(Boolean)
        .join(' ');

      Printer.print(
        `The resource has not yet met the replication target. Please check back later using the command:\n\n ./spctl ${statusCommand}`,
      );
    }
  } catch (err) {
    Printer.error(`Failed to register storage. Error: ${(err as Error).message}`);
  }
};

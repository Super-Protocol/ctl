import { OfferStorageRequest } from '@super-protocol/sdk-js';
import ConfigLoader from '../../../../config';
import Printer from '../../../../printer';
import initBlockchainConnector from '../../../../services/initBlockchainConnector';
import { buildStatusCommand, buildUpdateStorageCommand } from '../command-builders';
import { checkParamsToRegisterStorage, registerStorage, RegisterStorageParams } from '../service';
import { findAllocatedOrderId, findRequestOrderId } from '../../utils';

export type RegisterActionOptions = {
  version?: number;
  storageOffer: string;
  storageSlot: string;
  minRent: number;
  replicationFactor: number;
  retryCount: number;
  retryInterval: number;
  config: string;
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

    await checkParamsToRegisterStorage({
      offerId,
      storageOfferId: options.storageOffer,
      storageSlotId: options.storageSlot,
    });

    const params: RegisterStorageParams = {
      offerId,
      offerVersion: options.version,
      copyPreviousData: false, // (!)
      replicationFactor: options.replicationFactor,
      storageOfferId: options.storageOffer,
      storageSlotId: options.storageSlot,
      storageOrderDepositDurationInHours: options.minRent,
      retryCount: options.retryCount,
      retryInterval: options.retryInterval,
      pccsServiceApiUrl,
    };

    const storageOrderId = await findStorageOrderId(params);
    if (storageOrderId) {
      const updateStorageCommand = buildUpdateStorageCommand(offerId, options);
      const msg = [
        `Storage already exists (id=${storageOrderId}).`,
        `If you want to update the storage, please run the following command:\n\n ${updateStorageCommand}`,
      ].join('\n');

      Printer.print(msg);
      return;
    }

    const id = await registerStorage(params);

    if (id) {
      Printer.print(`Storage is registered (orderId=${id})`);
    } else {
      const statusCommand = buildStatusCommand(offerId, options);
      const msg = [
        `The resource has not yet met the replication target.`,
        `Please check back later using the command:\n\n ${statusCommand}`,
      ].join('\n');

      Printer.print(msg);
    }
  } catch (err) {
    Printer.error(`Failed to register storage. Error: ${(err as Error).message}`);
  }
};

export const findStorageOrderId = async (
  params: Pick<OfferStorageRequest, 'offerId' | 'offerVersion'>,
): Promise<string | undefined> => {
  const allocatedOrderId = await findAllocatedOrderId(params);
  if (allocatedOrderId) {
    return allocatedOrderId;
  }

  return findRequestOrderId(params);
};

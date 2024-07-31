import Printer from '../../../../printer';
import { checkParamsToRegisterStorage, registerStorage, RegisterStorageParams } from '../service';
import initBlockchainConnector from '../../../../services/initBlockchainConnector';
import ConfigLoader from '../../../../config';
import { RegisterActionOptions } from '../register/action';
import { buildRegisterStorageCommand, buildStatusCommand } from '../command-builders';
import { findAllocatedOrderId } from '../../utils';

export type UpdateActionOptions = RegisterActionOptions;

export const updateAction = async (
  offerId: string,
  options: UpdateActionOptions,
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
      copyPreviousData: true, // (!)
      replicationFactor: options.replicationFactor,
      storageOfferId: options.storageOffer,
      storageSlotId: options.storageSlot,
      storageOrderDepositDurationInHours: options.minRent,
      retryCount: options.retryCount,
      retryInterval: options.retryInterval,
      pccsServiceApiUrl,
    };

    const allocatedOrderId = await findAllocatedOrderId(params);
    if (!allocatedOrderId) {
      const registerStorageCommand = buildRegisterStorageCommand(offerId, options);
      const msg = [
        `The old storage is not found.`,
        `If you want to register a storage, please run the following command:\n\n  ./spctl ${registerStorageCommand}`,
      ].join('\n');

      Printer.print(msg);
      return;
    }

    const id = await registerStorage(params);

    if (id) {
      Printer.print(`Storage is updated (orderId=${id})`);
    } else {
      const statusCommand = buildStatusCommand(offerId, options);
      const msg = [
        `The resource has not yet met the replication target.`,
        ` Please check back later using the command:\n\n ./spctl ${statusCommand}`,
      ].join('\n');

      Printer.print(msg);
    }
  } catch (err) {
    Printer.error(`Failed to register storage. Error: ${(err as Error).message}`);
  }
};

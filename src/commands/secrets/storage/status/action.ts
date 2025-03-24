import Printer from '../../../../printer';
import { getStorageRegistrationStatus, StorageRegistrationStatus } from './service';
import initBlockchainConnector from '../../../../services/initBlockchainConnector';
import ConfigLoader from '../../../../config';
import { findLastOfferVersion } from '../../utils';

export type StatusActionOptions = {
  offerVersion?: number;
  config: string;
};

export const statusAction = async (
  offerId: string,
  options: StatusActionOptions,
): Promise<void> => {
  try {
    const configLoader = new ConfigLoader(options.config);
    const blockchain = configLoader.loadSection('blockchain');
    const blockchainConfig = {
      contractAddress: blockchain.smartContractAddress,
      blockchainUrl: blockchain.rpcUrl,
    };

    await initBlockchainConnector({ blockchainConfig });

    const registrationStatus = await getStorageRegistrationStatus({
      offerId,
      offerVersion: options.offerVersion
        ? options.offerVersion
        : await findLastOfferVersion({ offerId }),
    });

    displayStatus(registrationStatus);
  } catch (err) {
    Printer.error(`Failed to get storage registration status. Error: ${(err as Error).message}`);
  }
};

const getCheckbox = (condition: boolean): string => {
  return condition ? '[x]' : '[ ]';
};

const displayStatus = (status: StorageRegistrationStatus): void => {
  const { isOfferStorageRequestCreated, orderId, orderStatus, replicasCreated, replicationFactor } =
    status;

  const requestStatus =
    getCheckbox(isOfferStorageRequestCreated) + ' Offer storage request is created';
  const orderStatusFormatted =
    getCheckbox(Boolean(orderStatus)) +
    ` Storage order is "${orderStatus ?? '-'}"${orderId ? ` (orderId=${orderId})` : ''}`;
  const replicasStatus =
    getCheckbox(Boolean(replicasCreated && replicasCreated >= replicationFactor)) +
    ` Replicas are created (${replicasCreated ?? 0}/${replicationFactor})`;

  Printer.print(`
  =====================================================
                  Storage Process Status
  =====================================================
  ${requestStatus}
  ${orderStatusFormatted}
  ${replicasStatus}
  =====================================================
  `);
};

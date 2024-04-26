import { Wallet } from 'ethers';
import getMaticBalanceService from '../services/getMaticBalance';
import getTeeBalanceService from '../services/getTeeBalance';
import Printer from '../printer';
import { Config as BlockchainConfig } from '@super-protocol/sdk-js';
import initBlockchainConnectorService from '../services/initBlockchainConnector';
import { weiToEther } from '../utils';

export type TokensBalanceParams = {
  blockchainConfig: BlockchainConfig;
  actionAccountPrivateKey: string;
  customAccountPrivateKey?: string;
};

export default async (params: TokensBalanceParams): Promise<void> => {
  const address = new Wallet(params.customAccountPrivateKey ?? params.actionAccountPrivateKey)
    .address;

  Printer.print('Connecting to the blockchain');
  await initBlockchainConnectorService({ blockchainConfig: params.blockchainConfig });

  Printer.print('Fetching Super Protocol TEE tokens balance');
  const balanceTee = await getTeeBalanceService({ address });
  Printer.print(`Balance of ${address}: ${weiToEther(balanceTee)} TEE`);

  Printer.print('Fetching Polygon MATIC tokens balance');
  const balanceMatic = await getMaticBalanceService({ address });
  Printer.print(`Balance of ${address}: ${weiToEther(balanceMatic)} MATIC`);
};

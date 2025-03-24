import { Wallet } from 'ethers';
import getBnbBalanceService from '../services/getBnbBalance';
import getTeeBalanceService from '../services/getTeeBalance';
import Printer from '../printer';
import { Config as BlockchainConfig, getTokensInfo } from '@super-protocol/sdk-js';
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

  Printer.print('\nFetching Super Protocol tokens balance');
  const tokens = await getTokensInfo();
  for (const token of tokens) {
    const balance = await getTeeBalanceService({ address, token });
    Printer.print(`Balance of ${address}: ${weiToEther(balance)} ${token.symbol}`);
  }

  Printer.print('\nFetching BNB tokens balance');
  const balanceBnb = await getBnbBalanceService({ address });
  Printer.print(`Balance of ${address}: ${weiToEther(balanceBnb)} BNB`);
};

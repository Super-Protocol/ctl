import {
  BlockchainConnector,
  Config as BlockchainConfig,
  Provider,
  ProviderInfo,
  ProviderRegistry,
} from '@super-protocol/sdk-js';
import initBlockchainConnector from '../services/initBlockchainConnector';
import readJsonFile from '../services/readJsonFile';
import { ProviderInfoValidator } from '../validators';

interface ProvidersUpdateParams {
  blockchainConfig: BlockchainConfig;
  providerInfoFilePath: string;
  authorityAccountKey: string;
  actionAccountKey: string;
}

export default async function providersUpdate(params: ProvidersUpdateParams): Promise<void> {
  await initBlockchainConnector({
    blockchainConfig: params.blockchainConfig,
    actionAccountKey: params.actionAccountKey,
  });
  const authorityAddress = await BlockchainConnector.getInstance().initializeActionAccount(
    params.authorityAccountKey,
  );

  if (!(await ProviderRegistry.isProviderRegistered(authorityAddress))) {
    throw new Error(`Provider with wallet address ${authorityAddress} is not registered`);
  }

  const providerInfo: ProviderInfo = await readJsonFile({
    path: params.providerInfoFilePath,
    validator: ProviderInfoValidator,
  });

  const provider = new Provider(authorityAddress);

  await provider.modify(providerInfo, { from: authorityAddress });
}

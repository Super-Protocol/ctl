import { BlockchainConnector } from '@super-protocol/sdk-js';
import { BigNumber } from 'ethers';

export type GetMumbaiBalanceParams = {
  address: string;
};

const getBnbBalance = async (params: GetMumbaiBalanceParams) => {
  const weiString = await BlockchainConnector.getInstance().getBalance(params.address);
  return BigNumber.from(weiString);
};

export default getBnbBalance;

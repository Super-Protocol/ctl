import { SuperproToken } from '@super-protocol/sdk-js';
import { BigNumber } from 'ethers';
import { Token } from '../utils';

export type GetTeeBalanceParams = {
  address: string;
  token: Pick<Token, 'address'>;
};

const getTeeBalance = async (params: GetTeeBalanceParams): Promise<BigNumber> => {
  const contract = SuperproToken.createContract(params.token.address);
  const balance = await SuperproToken.balanceOf(params.address, contract);

  return BigNumber.from(balance);
};

export default getTeeBalance;

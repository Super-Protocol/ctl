import { BigNumber } from 'ethers';
import { SuperproToken, Web3TransactionRevertedByEvmError } from '@super-protocol/sdk-js';
import Printer from '../printer';
import { ErrorTxRevertedByEvm, etherToWei } from '../utils';
import { DEFAULT_TEE_AMOUNT_FOR_APPROVE } from '../constants';

const approveTeeTokens = async (params: {
  from: string;
  amount: BigNumber;
  to: string;
}): Promise<void> => {
  const { from, amount, to } = params;
  const allowance = await SuperproToken.allowance(from, to);
  if (amount.gt(allowance)) {
    Printer.print('Approving TEE tokens');
    try {
      await SuperproToken.approve(
        to,
        etherToWei(String(DEFAULT_TEE_AMOUNT_FOR_APPROVE)).toString(),
        { from },
      );
    } catch (error: unknown) {
      if (error instanceof Web3TransactionRevertedByEvmError)
        throw ErrorTxRevertedByEvm(error.originalError);
      else throw error;
    }
  }
};

export default approveTeeTokens;

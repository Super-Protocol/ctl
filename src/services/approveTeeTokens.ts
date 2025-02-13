import { BigNumber } from 'ethers';
import { SuperproToken, Web3TransactionRevertedByEvmError } from '@super-protocol/sdk-js';
import Printer from '../printer';
import { ErrorTxRevertedByEvm, etherToWei, Token } from '../utils';
import { DEFAULT_TEE_AMOUNT_FOR_APPROVE } from '../constants';

const approveTeeTokens = async (params: {
  from: string;
  amount: BigNumber;
  to: string;
  token: Pick<Token, 'address' | 'symbol'>;
}): Promise<void> => {
  const { from, amount, to, token } = params;
  const contract = SuperproToken.createContract(token.address);
  const allowance = await SuperproToken.allowance(from, to, contract);

  if (amount.gt(allowance)) {
    Printer.print(`Approving ${token.symbol} tokens`);
    try {
      const checkTxBeforeSend = false;
      await SuperproToken.approve(
        to,
        etherToWei(String(DEFAULT_TEE_AMOUNT_FOR_APPROVE)).toString(),
        { from },
        checkTxBeforeSend,
        contract,
      );
    } catch (error: unknown) {
      Printer.error(`Failed to approve ${token.symbol} tokens: ${(error as Error).message}`);

      if (error instanceof Web3TransactionRevertedByEvmError)
        throw ErrorTxRevertedByEvm(error.originalError);
      else throw error;
    }
  }
};

export default approveTeeTokens;

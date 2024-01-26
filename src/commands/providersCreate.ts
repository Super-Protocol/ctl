import BlockchainConnector, {
  Config as BlockchainConfig,
  Deposits,
  ParamName,
  ProviderInfo,
  ProviderRegistry,
  Superpro,
} from '@super-protocol/sdk-js';
import { BigNumber } from 'ethers';
import inquirer, { QuestionCollection } from 'inquirer';
import z from 'zod';
import Printer from '../printer';
import approveTeeTokens from '../services/approveTeeTokens';
import doWithRetries from '../services/doWithRetries';
import getTeeBalance from '../services/getTeeBalance';
import initBlockchainConnector from '../services/initBlockchainConnector';
import readJsonFile from '../services/readJsonFile';
import { toTEE } from '../utils';

interface ProvidersCreateParams {
  blockchainConfig: BlockchainConfig;
  providerInfoFilePath: string;
  authorityAccountKey: string;
  actionAccountKey: string;
}

const ProviderInfoFileValidator = z.object({
  name: z.string(),
  description: z.string(),
  tokenReceiver: z.string(),
  actionAccount: z.string(),
  metadata: z.string(),
});

async function waitProviderRegistrationFinish(authorityAddress: string): Promise<void> {
  return await doWithRetries(async () => {
    const isRegistered = await ProviderRegistry.isProviderRegistered(authorityAddress);

    if (!isRegistered) {
      throw new Error(`Provider with wallet address ${authorityAddress} is not registered`);
    }
  });
}

interface CheckBalanceToCreateProviderParams {
  authorityAddress: string;
}

async function checkBalanceToCreateProvider(
  params: CheckBalanceToCreateProviderParams,
): Promise<void> {
  const { authorityAddress } = params;
  const minSecurityDeposit = await Superpro.getParam(ParamName.MinSecDeposit);
  const depositInfo = await Deposits.getDepositInfo(authorityAddress);
  const availableDeposit = BigInt(depositInfo.amount) - BigInt(depositInfo.totalLocked);
  const requiredDeposit = BigInt(minSecurityDeposit) - availableDeposit;

  if (requiredDeposit <= 0n) {
    return;
  }

  const isDepositConfirmed = async (): Promise<boolean> => {
    const message = [
      `Your available deposit (${toTEE(availableDeposit)}) is too small to create this provider.`,
      `Required to deposit additional ${toTEE(requiredDeposit)}.`,
      `Proceed?`,
    ].join('\n');

    const questions: QuestionCollection = [
      {
        type: 'confirm',
        name: 'confirmation',
        message,
        default: true,
      },
    ];
    const answers = await inquirer.prompt(questions);

    return answers.confirmation;
  };

  if (await isDepositConfirmed()) {
    const teeBalance = await getTeeBalance({ address: authorityAddress });

    if (teeBalance.toBigInt() < BigInt(requiredDeposit)) {
      throw new Error(
        `Your wallet balance (${toTEE(
          teeBalance,
        )}) does not have enough TEE tokens to make the deposit.`,
      );
    }

    await approveTeeTokens({
      from: authorityAddress,
      to: Deposits.address,
      amount: BigNumber.from(requiredDeposit),
    });
    await Deposits.replenish(requiredDeposit.toString(), { from: authorityAddress });

    return Printer.print(`Reffiled security deposit on ${toTEE(requiredDeposit)}`);
  }

  throw new Error('Denied to make the deposit, exiting...');
}

export default async function providersCreate(params: ProvidersCreateParams): Promise<void> {
  const providerInfo: ProviderInfo = await readJsonFile({
    path: params.providerInfoFilePath,
    validator: ProviderInfoFileValidator,
  });

  await initBlockchainConnector({
    blockchainConfig: params.blockchainConfig,
    actionAccountKey: params.actionAccountKey,
  });
  const authorityAddress = await BlockchainConnector.getInstance().initializeActionAccount(
    params.authorityAccountKey,
  );

  if (await ProviderRegistry.isProviderRegistered(authorityAddress)) {
    return Printer.error(`Provider with wallet address ${authorityAddress} is already registered`);
  }
  await checkBalanceToCreateProvider({ authorityAddress });

  await ProviderRegistry.registerProvider(providerInfo, { from: authorityAddress });
  await waitProviderRegistrationFinish(authorityAddress);

  Printer.print(`Provider with wallet address ${authorityAddress} is registered`);
}

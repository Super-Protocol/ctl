import {
  BlockchainConnector,
  Config as BlockchainConfig,
  Deposits,
  ParamName,
  ProviderInfo,
  ProviderRegistry,
  Superpro,
  SuperproToken,
} from '@super-protocol/sdk-js';
import inquirer, { QuestionCollection } from 'inquirer';
import Printer from '../printer';
import doWithRetries from '../services/doWithRetries';
import getTeeBalance from '../services/getTeeBalance';
import initBlockchainConnector from '../services/initBlockchainConnector';
import readJsonFile from '../services/readJsonFile';
import { etherToWei, toTEE } from '../utils';
import { ProviderInfoValidator } from '../validators';
import { DEFAULT_TEE_AMOUNT_FOR_APPROVE } from '../constants';

interface ProvidersCreateParams {
  blockchainConfig: BlockchainConfig;
  providerInfoFilePath: string;
  authorityAccountKey: string;
  actionAccountKey: string;
  silent: boolean;
}

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
  silent: boolean;
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

  if (params.silent || (await isDepositConfirmed())) {
    const teeBalance = await getTeeBalance({ address: authorityAddress });

    if (teeBalance.toBigInt() < BigInt(requiredDeposit)) {
      throw new Error(
        `Your wallet balance (${toTEE(
          teeBalance,
        )}) does not have enough TEE tokens to make the deposit.`,
      );
    }

    await SuperproToken.approve(
      Superpro.address,
      etherToWei(String(DEFAULT_TEE_AMOUNT_FOR_APPROVE)).toString(),
      { from: authorityAddress },
    );

    await Deposits.replenish(requiredDeposit.toString(), undefined, { from: authorityAddress });

    return Printer.print(`Refilled security deposit on ${toTEE(requiredDeposit)}`);
  }

  throw new Error('Denied to make the deposit, exiting...');
}

export default async function providersCreate(params: ProvidersCreateParams): Promise<void> {
  const providerInfo: ProviderInfo = await readJsonFile({
    path: params.providerInfoFilePath,
    validator: ProviderInfoValidator,
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
  await checkBalanceToCreateProvider({ authorityAddress, silent: params.silent });

  await ProviderRegistry.registerProvider(providerInfo, undefined, { from: authorityAddress });
  await waitProviderRegistrationFinish(authorityAddress);

  const actionAddress = await BlockchainConnector.getInstance().initializeActionAccount(
    params.actionAccountKey,
  );

  await SuperproToken.approve(
    Superpro.address,
    etherToWei(String(DEFAULT_TEE_AMOUNT_FOR_APPROVE)).toString(),
    { from: actionAddress },
  );

  Printer.print(`Provider with wallet address ${authorityAddress} is registered`);
}

import { Config as BlockchainConfig, Orders, OrderStatus } from '@super-protocol/sdk-js';
import inquirer, { QuestionCollection } from 'inquirer';
import Printer from '../printer';
import initBlockchainConnectorService from '../services/initBlockchainConnector';
import checkOrderService from '../services/checkOrder';
import { etherToWei, weiToEther } from '../utils';

export type WorkflowReplenishDepositParams = {
  blockchainConfig: BlockchainConfig;
  actionAccountKey: string;
  minutes: number;
  sppi: string;
  orderId: string;
  yes: boolean;
};

const isActionConfirmed = async (question: string): Promise<boolean> => {
  Printer.print(question);

  const questions: QuestionCollection = [
    {
      type: 'confirm',
      name: 'confirmation',
      message: `Confirm?`,
      default: true,
    },
  ];
  const answers = await inquirer.prompt(questions);

  return answers.confirmation;
};

export default async (params: WorkflowReplenishDepositParams): Promise<void> => {
  Printer.print('Connecting to the blockchain');
  await initBlockchainConnectorService({
    blockchainConfig: params.blockchainConfig,
    actionAccountKey: params.actionAccountKey,
  });

  try {
    Printer.print(`Checking order ${params.orderId}`);
    await checkOrderService({
      id: params.orderId,
      statuses: [OrderStatus.Blocked, OrderStatus.Processing, OrderStatus.New],
    });
    const amountPerHour = await Orders.calculateWorkflowPerHourPrice(params.orderId);
    let tokenAmount: bigint;
    let minutes: number;

    if (params.minutes) {
      tokenAmount = (BigInt(amountPerHour) * BigInt(params.minutes)) / 60n;
      minutes = params.minutes;
    } else if (params.sppi) {
      tokenAmount = etherToWei(params.sppi).toBigInt();
      minutes = Number((tokenAmount * 60n) / BigInt(amountPerHour));
    } else {
      throw new Error('To complete command please define one of arguments --sppi or --minutes');
    }

    const confirmed =
      params.yes ||
      (await isActionConfirmed(
        `Deposit will be replenished by ${weiToEther(tokenAmount)} SPPI. Order time is extended by ${minutes} minutes.`,
      ));
    if (confirmed) {
      await Orders.replenishWorkflowDeposit(params.orderId, tokenAmount.toString());

      Printer.print('Deposit replenished successfully');
    }
  } catch (error: any) {
    Printer.print(`Order ${params.orderId} was not replenished: ${error?.message}`);
  }
};

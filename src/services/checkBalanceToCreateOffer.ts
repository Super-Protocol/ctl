import inquirer, { QuestionCollection } from 'inquirer';
import {
  Provider,
  ProviderRegistry,
  ParamName,
  Superpro,
  SuperproToken,
} from '@super-protocol/sdk-js';
import { BigNumber } from 'ethers';
import Printer from '../printer';
import { weiToEther } from '../utils';

type OfferType = 'tee' | 'value';

interface GetSecDepositToCreateOfferParams {
  authorityAddress: string;
  offerType: OfferType;
}

async function getSecDepositToCreateOffer(
  params: GetSecDepositToCreateOfferParams,
): Promise<BigNumber> {
  const { authorityAddress, offerType } = params;
  const paramName = offerType === 'tee' ? ParamName.TeeOfferSecDeposit : ParamName.OfferSecDeposit;
  const offerSecurityDeposit = await Superpro.getParam(paramName);

  const provider = new Provider(authorityAddress);
  const actualSecurityDeposit = await provider.getSecurityDeposit();
  const requiredSecurityDeposit = await provider.getRequiredSecurityDeposit(offerSecurityDeposit);

  const securityDepositToRefill = BigNumber.from(actualSecurityDeposit).sub(
    BigNumber.from(requiredSecurityDeposit),
  );

  if (securityDepositToRefill.isNegative()) {
    return securityDepositToRefill.abs();
  }

  return BigNumber.from('0');
}

interface CheckBalanceToCreateOfferParams extends GetSecDepositToCreateOfferParams {
  contractAddress: string;
  enableAutoDeposit: boolean;
}

export default async function checkBalanceToCreateOffer(
  params: CheckBalanceToCreateOfferParams,
): Promise<void> {
  const { contractAddress, authorityAddress, offerType } = params;
  const secDepositToCreateOffer = await getSecDepositToCreateOffer({ authorityAddress, offerType });

  if (secDepositToCreateOffer.isZero()) {
    return;
  }

  const isDepositConfirmed = async (): Promise<boolean> => {
    if (params.enableAutoDeposit) {
      return params.enableAutoDeposit;
    }

    const questions: QuestionCollection = [
      {
        type: 'confirm',
        name: 'confirmation',
        message: `A security deposit of ${weiToEther(
          secDepositToCreateOffer,
        )} TEE is required to create this offer. Proceed?`,
        default: true,
      },
    ];
    const answers = await inquirer.prompt(questions);

    return answers.confirmation;
  };

  if (await isDepositConfirmed()) {
    const amount = secDepositToCreateOffer.toString();
    await SuperproToken.approve(contractAddress, amount, { from: authorityAddress });
    await ProviderRegistry.refillSecurityDepositFor(amount, authorityAddress);
    return Printer.print(`Reffiled security deposit on ${weiToEther(secDepositToCreateOffer)} TEE`);
  }

  throw new Error('Denied to make the deposit, exiting...');
}

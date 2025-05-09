import inquirer, { QuestionCollection } from 'inquirer';
import { Provider, ProviderRegistry, ParamName, Superpro } from '@super-protocol/sdk-js';
import { BigNumber } from 'ethers';
import Printer from '../printer';
import { findFirstPrimaryToken, weiToEther } from '../utils';
import approveTeeTokens from './approveTeeTokens';

type OfferType = 'tee' | 'value';

interface CalculateOfferSecDepositShortfallParams {
  authorityAddress: string;
  offerType: OfferType;
}

async function calculateOfferSecDepositShortfall(
  params: CalculateOfferSecDepositShortfallParams,
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

interface EnsureSufficientOfferSecDepositParams extends CalculateOfferSecDepositShortfallParams {
  actionAddress: string;
  contractAddress: string;
  enableAutoDeposit: boolean;
  target: 'createOffer' | 'enableOffer';
}

export default async function ensureSufficientOfferSecDeposit(
  params: EnsureSufficientOfferSecDepositParams,
): Promise<void> {
  const { contractAddress, actionAddress, authorityAddress, offerType, target } = params;
  const secDepositToCreateOffer = await calculateOfferSecDepositShortfall({
    authorityAddress,
    offerType,
  });

  if (secDepositToCreateOffer.isZero()) {
    return;
  }

  const isDepositConfirmed = async (): Promise<boolean> => {
    if (params.enableAutoDeposit) {
      return params.enableAutoDeposit;
    }

    const teeValue = weiToEther(secDepositToCreateOffer);
    const actionMessage = target === 'createOffer' ? 'create' : 'enable';
    const questions: QuestionCollection = [
      {
        type: 'confirm',
        name: 'confirmation',
        message: `A security deposit of ${teeValue} TEE is required to ${actionMessage} this offer. Proceed?`,
        default: true,
      },
    ];
    const answers = await inquirer.prompt(questions);

    return answers.confirmation;
  };

  if (await isDepositConfirmed()) {
    const token = await findFirstPrimaryToken();

    await approveTeeTokens({
      amount: secDepositToCreateOffer,
      from: actionAddress,
      to: contractAddress,
      token,
    });
    await ProviderRegistry.refillSecurityDepositFor(
      secDepositToCreateOffer.toString(),
      authorityAddress,
      undefined,
      {
        from: actionAddress,
      },
    );
    return Printer.print(`Reffiled security deposit on ${weiToEther(secDepositToCreateOffer)} TEE`);
  }

  throw new Error('Denied to make the deposit, exiting...');
}

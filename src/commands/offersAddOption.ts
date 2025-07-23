import { Config as BlockchainConfig, TeeOffer } from '@super-protocol/sdk-js';
import Printer from '../printer';
import initBlockchainConnector from '../services/initBlockchainConnector';
import readOfferOption from '../services/readOfferOption';
import { generateExternalId } from '../utils';

export type OffersAddOptionParams = {
  offerId: string;
  optionPath: string;
  blockchainConfig: BlockchainConfig;
  actionAccountKey: string;
};

export default async (params: OffersAddOptionParams): Promise<void> => {
  await initBlockchainConnector({
    blockchainConfig: params.blockchainConfig,
    actionAccountKey: params.actionAccountKey,
  });

  const option = await readOfferOption({
    path: params.optionPath,
  });
  const optionExternalId = generateExternalId();

  Printer.print(
    `Option info file was read successfully, cretaing with externalId ${optionExternalId}`,
  );

  const teeOffer = new TeeOffer(params.offerId);
  const newOptionId = await teeOffer.addOption(option.info, option.usage, optionExternalId);
  Printer.print(`Option ${newOptionId} was added to offer ${params.offerId}`);
};

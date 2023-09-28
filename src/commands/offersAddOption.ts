import { Config as BlockchainConfig, TeeOffer, TeeOffers } from '@super-protocol/sdk-js';
import Printer from '../printer';
import initBlockchainConnector from '../services/initBlockchainConnector';
import readOfferOption from '../services/readOfferOption';
import { generateExternalId } from '../utils';
import doWithRetries from '../services/doWithRetries';

export type OffersAddOptionParams = {
  offerId: string;
  optionPath: string;
  blockchainConfig: BlockchainConfig;
  actionAccountKey: string;
};

export default async (params: OffersAddOptionParams) => {
  const creator = (await initBlockchainConnector({
    blockchainConfig: params.blockchainConfig,
    actionAccountKey: params.actionAccountKey,
  })) as string;

  const option = await readOfferOption({
    path: params.optionPath,
  });
  const optionExternalId = generateExternalId();

  Printer.print(
    `Option info file was read successfully, cretaing with externalId ${optionExternalId}`,
  );

  const teeOffer = new TeeOffer(params.offerId);
  await teeOffer.addOption(option.optionInfo, option.optionUsage, optionExternalId);

  const optionLoaderFn = () =>
    TeeOffers.getOptionByExternalId({
      creator,
      teeOfferId: params.offerId,
      externalId: optionExternalId,
    }).then((value) => {
      if (value?.optionId) {
        return value.optionId;
      }
      throw new Error("Option wasn't created. Try increasing the gas price.");
    });

  const newOption = await doWithRetries(optionLoaderFn);

  Printer.print(`Option ${newOption} was added to offer ${params.offerId}`);
};

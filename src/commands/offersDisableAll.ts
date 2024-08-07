import {
  BlockchainConnector,
  Config as BlockchainConfig,
  Offer,
  Provider,
  TeeOffer,
  Web3TransactionRevertedByEvmError,
} from '@super-protocol/sdk-js';
import Printer from '../printer';
import initBlockchainConnectorService from '../services/initBlockchainConnector';
import readJsonFile from '../services/readJsonFile';
import { ErrorTxRevertedByEvm, preparePath } from '../utils';

export type OffersDisableAllParams = {
  blockchainConfig: BlockchainConfig;
  providersPath: string;
};

export default async (params: OffersDisableAllParams) => {
  Printer.print('Connecting to the blockchain');

  await initBlockchainConnectorService({
    blockchainConfig: params.blockchainConfig,
  });

  try {
    const providers: { actionKey: string; authorityAccount: string }[] = await readJsonFile({
      path: preparePath(params.providersPath),
    });

    for (const { actionKey, authorityAccount } of providers) {
      Printer.print(`Disabling offers of authority account: ${authorityAccount}`);

      const actionAccount =
        await BlockchainConnector.getInstance().initializeActionAccount(actionKey);

      const provider = new Provider(authorityAccount);
      const valueOffers = await provider.getValueOffers();
      const teeOffers = await provider.getTeeOffers();

      if (valueOffers.length) {
        const results = await Promise.allSettled(
          valueOffers.map((offer) => new Offer(offer).disable({ from: actionAccount })),
        );
        results.forEach((res, index) =>
          Printer.print(
            `Value offer ${valueOffers[index]} was ${
              res.status === 'fulfilled' ? '' : 'not '
            }disabled`,
          ),
        );
      }
      if (teeOffers.length) {
        const results = await Promise.allSettled(
          teeOffers.map((offer) => new TeeOffer(offer).disable({ from: actionAccount })),
        );
        results.forEach((res, index) =>
          Printer.print(
            `Tee offer ${teeOffers[index]} was ${res.status === 'fulfilled' ? '' : 'not '}disabled`,
          ),
        );
      }
    }
  } catch (error: any) {
    if (error instanceof Web3TransactionRevertedByEvmError)
      throw ErrorTxRevertedByEvm(error.originalError);
    else throw error;
  }
};

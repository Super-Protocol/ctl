import { Offer, Config as BlockchainConfig } from '@super-protocol/sdk-js';
import Printer from '../printer';
import initBlockchainConnector from '../services/initBlockchainConnector';

export type OffersDisableVersionParams = {
  blockchainConfig: BlockchainConfig;
  actionAccountKey: string;
  id: string;
  ver: number;
};

export default async (params: OffersDisableVersionParams): Promise<void> => {
  try {
    Printer.print('Connecting to the blockchain');
    const actionAddress = await initBlockchainConnector({
      blockchainConfig: params.blockchainConfig,
      actionAccountKey: params.actionAccountKey,
    });
    const offer = new Offer(params.id);
    await offer.deleteVersion(params.ver, { from: actionAddress });
    Printer.print(`Version ${params.ver} for offer ${params.id} successfully removed`);
  } catch (error: any) {
    Printer.print('Remove offer version failed with error: ' + error?.message);
  }
};

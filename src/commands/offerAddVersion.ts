import { Config as BlockchainConfig } from '@super-protocol/sdk-js';
import addValueOfferVersion from '../services/addValueOfferVersion';
import Printer from '../printer';
import readOfferVersionInfo from '../services/readOfferVersionInfo';
import initBlockchainConnector from '../services/initBlockchainConnector';

export type OfferAddVersionParams = {
  actionAccountKey: string;
  blockchainConfig: BlockchainConfig;
  id: string;
  ver: number;
  path: string;
};

export default async (params: OfferAddVersionParams): Promise<void> => {
  try {
    Printer.print('Connecting to the blockchain');
    await initBlockchainConnector({
      blockchainConfig: params.blockchainConfig,
      actionAccountKey: params.actionAccountKey,
    });
    const versionInfo = await readOfferVersionInfo({ path: params.path });
    const newVersion = await addValueOfferVersion({
      action: params.actionAccountKey,
      version: params.ver,
      versionInfo,
      offerId: params.id,
    });
    Printer.print(`Version ${newVersion} added successfully`);
  } catch (error: any) {
    Printer.print('Version add failed with error: ' + error?.message);
  }
};

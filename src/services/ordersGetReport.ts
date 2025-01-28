import path from 'path';
import { promises as fs } from 'fs';
import { Config as BlockchainConfig, Order } from '@super-protocol/sdk-js';
import Printer from '../printer';
import initBlockchainConnector from './initBlockchainConnector';
import { constants } from '@super-protocol/sdk-js';

export type OrderGetReportParams = {
  blockchainConfig: BlockchainConfig;
  orderId: string;
  saveTo?: string;
  _validate?: boolean;
};

export const ordersGetReport = async (params: OrderGetReportParams): Promise<void> => {
  Printer.print('Connecting to the blockchain');
  await initBlockchainConnector({
    blockchainConfig: params.blockchainConfig,
  });

  Printer.print('Fetching order report');
  const orderReport = await new Order(params.orderId).getOrderReport();
  if (!orderReport) {
    Printer.error(`There is no report for order ${params.orderId}`);
    return;
  }

  //add root cert at the end of certificate chain to have full chain
  orderReport.certificate += `\n${constants.SUPERPROTOCOL_CA}`;

  Printer.print(JSON.stringify(orderReport, null, 2));

  if (params.saveTo) {
    const pathToSaveResult = path.join(process.cwd(), params.saveTo);
    await fs.writeFile(pathToSaveResult, JSON.stringify(orderReport));
    Printer.print(`Saved order report to ${pathToSaveResult}`);
  }
};

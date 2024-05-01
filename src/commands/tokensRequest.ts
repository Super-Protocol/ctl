import { Wallet } from 'ethers';
import requestTeeService from '../services/requestTee';
import requestCustomMaticService from '../services/requestCustomMatic';
import requestCustomTeeService from '../services/requestCustomTee';
import requestMaticService from '../services/requestMatic';
import Printer from '../printer';
import { program } from 'commander';

export type TokensRequestParams = {
  actionAccountPrivateKey: string;
  backendUrl: string;
  accessToken: string;
  requestMatic?: boolean;
  requestTee?: boolean;
  customAccountPrivateKey?: string;
};

export default async (params: TokensRequestParams): Promise<void> => {
  if (!params.requestTee && !params.requestMatic) {
    Printer.print(
      'No token type was specified, please add --tee or --matic flag to request specific tokens',
    );
    program.help();
  }

  const address = new Wallet(params.customAccountPrivateKey ?? params.actionAccountPrivateKey)
    .address;
  const requestParams = {
    backendUrl: params.backendUrl,
    accessToken: params.accessToken,
    ...(params.customAccountPrivateKey && { destinationAddress: address }),
  };

  if (params.requestTee) {
    Printer.print(`Requesting Super Protocol TEE tokens for ${address}`);
    if (params.customAccountPrivateKey) {
      await requestCustomTeeService(requestParams);
    } else {
      await requestTeeService(requestParams);
    }
    Printer.print(`TEE tokens will be transferred to ${address} shortly`);
  }

  if (params.requestMatic) {
    Printer.print(`Requesting Polygon MATIC tokens for ${address}`);
    if (params.customAccountPrivateKey) {
      await requestCustomMaticService(requestParams);
    } else {
      await requestMaticService(requestParams);
    }
    Printer.print(`MATIC tokens will be transferred to ${address} shortly`);
  }
};

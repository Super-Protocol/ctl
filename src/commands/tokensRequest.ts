import { Wallet } from 'ethers';
import requestTeeService from '../services/requestTee';
import requestCustomBnbService from '../services/requestCustomBnb';
import requestCustomTeeService from '../services/requestCustomTee';
import requestBnbService from '../services/requestBnb';
import Printer from '../printer';
import { program } from 'commander';

export type TokensRequestParams = {
  actionAccountPrivateKey: string;
  backendUrl: string;
  accessToken: string;
  requestBnb?: boolean;
  requestTee?: boolean;
  customAccountPrivateKey?: string;
};

export default async (params: TokensRequestParams): Promise<void> => {
  if (!params.requestTee && !params.requestBnb) {
    Printer.print(
      'No token type was specified, please add --tee or --bnb flag to request specific tokens',
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

  if (params.requestBnb) {
    Printer.print(`Requesting opBNB tokens for ${address}`);
    if (params.customAccountPrivateKey) {
      await requestCustomBnbService(requestParams);
    } else {
      await requestBnbService(requestParams);
    }
    Printer.print(`BNB tokens will be transferred to ${address} shortly`);
  }
};

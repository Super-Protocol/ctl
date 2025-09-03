import { promisify } from 'util';
import { exec as execCallback } from 'child_process';
import { Command, InvalidArgumentError } from 'commander';
import { DateTime } from 'luxon';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { ErrorMessageOptions, generateErrorMessage } from 'zod-error';
import { ZodIssue } from 'zod';
import path from 'path';
import { CONFIG_DEFAULT_FILENAME, TX_REVERTED_BY_EVM_ERROR } from './constants';
import { Config } from './config';
import { getTokensInfo, helpers } from '@super-protocol/sdk-js';

export const exec = promisify(execCallback);

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const processSubCommands = (program: Command, process: (command: Command) => void) => {
  process(program);

  const processRecursive = (cmd: Command) => {
    cmd.commands.forEach((cmd) => {
      process(cmd);
      processRecursive(cmd);
    });
  };

  processRecursive(program);
};

export const commaSeparatedList = (value: string) => {
  return value.split(',').map((item) => item.trim());
};

export const collectOptions = (value: string, previous: string[]) => {
  return previous.concat([value]);
};

export const validateFields = (fields: string[], allowedFields: string[]) => {
  fields.forEach((field) => {
    if (!allowedFields.includes(field))
      throw Error(
        `Field "${field}" is not supported\nSupported fields: ${allowedFields.join(', ')}`,
      );
  });
};

export const generateExternalId = () =>
  [...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

export const snakeToCamel = (str: string) =>
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));

export const prepareObjectToPrint = (object: { [key: string]: any }, fields: string[]) => {
  const newObject: { [key: string]: any } = {};
  const formatValue = (val: unknown): unknown => {
    if (typeof val == 'undefined' || val === null) {
      return '<empty>';
    }

    if (Array.isArray(val)) {
      if (val.length === 0) {
        return '<empty>';
      }

      if (val.every((v) => typeof v === 'number' || typeof v === 'string')) {
        return val.join(', ');
      }
    }

    return val;
  };

  fields.forEach((key) => {
    newObject[key] = formatValue(object[snakeToCamel(key)]);
  });
  return newObject;
};

export const getObjectKey = (value: any, object: object) => {
  const result = Object.entries(object).find(([_k, v]) => v === value);
  return result && result[0];
};

export const formatDate = (date: string | number | Date | undefined) => {
  if (!date) return undefined;
  return DateTime.fromJSDate(new Date(date)).toFormat('ff');
};

export const SilentError = (error: Error) => ({
  error,
  isSilent: true,
});

export const ErrorWithCustomMessage = (message: string, error: any) => ({
  error,
  message,
  hasCustomMessage: true,
});

export const ErrorTxRevertedByEvm = (error: any) =>
  ErrorWithCustomMessage(
    `${TX_REVERTED_BY_EVM_ERROR}\nTransaction hash: ${error.receipt?.transactionHash}`,
    error,
  );

export const assertCommand = async (command: string, assertMessage: string) => {
  try {
    await exec(command);
  } catch (error: any) {
    if (error.code === 127 && error.stderr.indexOf(': not found')) {
      throw new Error(assertMessage);
    }
  }
};

export const assertNumber = (value: string | undefined, assertMessage: string) => {
  if (value && !value.match(/^[\d]+$/)) {
    throw new Error(assertMessage);
  }
};

export const assertSize = (value: string | undefined, assertMessage: string) => {
  if (value && !value.match(/^[\d]+[KMG]$/)) {
    throw new Error(assertMessage);
  }
};

export const weiToEther = (wei?: BigNumberish | null, precision = 4) => {
  if (!wei) return undefined;
  let ether = ethers.utils.formatEther(wei);
  const decimals = ether.substring(ether.indexOf('.') + 1);
  if (decimals.length < precision) {
    ether = ether.padEnd(ether.length + (precision - decimals.length), '0');
  }
  return ether;
};

export const etherToWei = (ether: string) => {
  return ethers.utils.parseEther(ether);
};

const options: ErrorMessageOptions = {
  delimiter: {
    component: ' ',
    error: '\n',
  },
  path: {
    enabled: true,
    type: 'objectNotation',
    transform: ({ value }) => `Field ${value}`,
  },
  code: {
    enabled: false,
  },
  message: {
    enabled: true,
    transform: ({ value }) => `is ${value.charAt(0).toLowerCase() + value.slice(1)}`,
  },
};

export const createZodErrorMessage = (error: ZodIssue[]) => {
  return generateErrorMessage(error, options);
};

export const preparePath = (rawPath: string) => {
  if (path.isAbsolute(rawPath)) return rawPath;
  return path.join(process.cwd(), rawPath);
};

export const formatTeeOptions = (
  options: { id: string; count: number }[],
): { ids: string[]; counts: number[] } => {
  return options.reduce(
    (acc: { ids: string[]; counts: number[] }, curr) => {
      acc.ids.push(curr.id);
      acc.counts.push(curr.count);
      return acc;
    },
    { ids: [], counts: [] },
  );
};

export const getConfigPath = (): string => {
  const configArgIndex = process.argv.indexOf(`--config`);

  return configArgIndex < 0 ? CONFIG_DEFAULT_FILENAME : process.argv[configArgIndex + 1];
};

export const toTEE = (num: bigint | BigNumber): string => {
  return `${weiToEther(String(num))} TEE`;
};

export const tryParse = (text: string) => {
  try {
    return JSON.parse(text);
  } catch {
    /* empty */
  }
};

export const parseNumber = (val: string): number => {
  const parsed = Number(val);
  if (Number.isNaN(parsed)) throw new InvalidArgumentError('Not a number.');
  return parsed;
};

export const isStorageConfigValid = (access?: Config['storage']): boolean => {
  return Boolean(access?.bucket && access?.readAccessToken && access?.writeAccessToken);
};

export const convertReadWriteStorageAccess = (
  storageConfig: Config['storage'],
): helpers.ReadWriteStorageAccess => {
  return {
    read: {
      storageType: storageConfig.type,
      credentials: {
        bucket: storageConfig.bucket,
        prefix: storageConfig.prefix,
        token: storageConfig.readAccessToken,
      },
    },
    write: {
      storageType: storageConfig.type,
      credentials: {
        bucket: storageConfig.bucket,
        prefix: storageConfig.prefix,
        token: storageConfig.writeAccessToken,
      },
    },
  };
};

export type Token = {
  index: number;
  symbol: string;
  address: string;
  isPrimary: boolean;
  protocolCommissionPercent: number;
};

export const findTokenBySymbol = async (tokenSymbol: string): Promise<Token> => {
  const tokens = await getTokensInfo();

  const token = tokens.find((token) => token.symbol === tokenSymbol);
  if (!token) {
    throw new Error(
      `Token ${tokenSymbol} not found. Available tokens: ${tokens.map((token) => token.symbol).join(', ')}`,
    );
  }

  return token;
};

export const findFirstPrimaryToken = async (): Promise<Token> => {
  const tokens = await getTokensInfo();

  const primaryToken = tokens.find((token) => token.isPrimary === true);
  if (!primaryToken) {
    throw new Error('Primary token not found');
  }

  return primaryToken;
};

import inquirer, { QuestionCollection } from 'inquirer';
import { Config } from '../config';
import {
  BACKEND_URL_DEFAULT,
  BASE64_CHECK_REGEX,
  BLOCKCHAIN_RPC_URL_DEFAULT,
  JWT_CHECK_REGEX,
  SMART_CONTRACT_ADDRESS_DEFAULT,
} from '../constants';
import { CryptoAlgorithm, Encoding, StorageType } from '@super-protocol/dto-js';
import { workflowGenerateKey } from './workflowsGenerateKey';

interface Answers {
  backend: {
    accessToken: string;
  };
  blockchain: {
    accountPrivateKey: string;
  };
  storjBucketExists: boolean;
  storage?: {
    bucket: string;
    readAccessToken: string;
    writeAccessToken: string;
  };
}

const getQuestionsObj = (config?: Config): QuestionCollection => {
  return [
    {
      type: 'input',
      name: 'backend.accessToken',
      message: 'Enter Access token: ',
      default: config?.backend?.accessToken,
      validate: (token: string): string | boolean => {
        if (JWT_CHECK_REGEX.test(token)) {
          return true;
        }

        return 'Please, enter valid Access token';
      },
    },
    {
      type: 'input',
      name: 'blockchain.accountPrivateKey',
      message: 'Enter account private key: ',
      default: config?.blockchain?.accountPrivateKey,
      validate: (key: string): string | boolean => {
        if (BASE64_CHECK_REGEX.test(key)) {
          return true;
        }

        return 'Please, enter account private key';
      },
    },
    {
      type: 'confirm',
      name: 'storjBucketExists',
      message: 'Do you have StorJ bucket with access tokens? ',
      default: false,
    },
    {
      type: 'input',
      name: 'storage.bucket',
      message: 'Enter StorJ bucket: ',
      default: config?.storage?.bucket,
      validate: (bucket: string): string | boolean => {
        if (Boolean(bucket)) {
          return true;
        }

        return 'Please, enter storage bucket';
      },
      when: (answers: Answers) => answers.storjBucketExists,
    },
    {
      type: 'input',
      name: 'storage.readAccessToken',
      message: 'Enter StorJ read access token: ',
      default: config?.storage?.readAccessToken,
      validate: (accessToken: string): string | boolean => {
        if (BASE64_CHECK_REGEX.test(accessToken)) {
          return true;
        }

        return 'Please, enter StorJ read access token';
      },
      when: (answers: Answers) => answers.storjBucketExists,
    },
    {
      type: 'input',
      name: 'storage.writeAccessToken',
      message: 'Enter StorJ write access token: ',
      default: config?.storage?.writeAccessToken || undefined,
      validate: (accessToken: string): string | boolean => {
        if (BASE64_CHECK_REGEX.test(accessToken)) {
          return true;
        }

        return 'Please, enter StorJ write access token';
      },
      when: (answers: Answers) => answers.storjBucketExists,
    },
  ];
};

export default async (config?: Config): Promise<Config> => {
  const questions = getQuestionsObj(config);
  const answers = (await inquirer.prompt(questions)) as Answers;

  const defaultConfig = {
    backend: {
      url: config?.backend?.url || BACKEND_URL_DEFAULT,
      accessToken: answers.backend.accessToken,
    },
    blockchain: {
      rpcUrl: config?.blockchain?.rpcUrl || BLOCKCHAIN_RPC_URL_DEFAULT,
      smartContractAddress:
        config?.blockchain?.smartContractAddress || SMART_CONTRACT_ADDRESS_DEFAULT,
      accountPrivateKey: answers.blockchain.accountPrivateKey,
      authorityAccountPrivateKey: config?.blockchain?.authorityAccountPrivateKey || '',
    },
    storage: {
      type: config?.storage?.type || StorageType.StorJ,
      bucket: answers.storage?.bucket || config?.storage?.bucket || '',
      prefix: config?.storage?.prefix || '',
      readAccessToken: answers.storage?.readAccessToken || config?.storage?.readAccessToken || '',
      writeAccessToken:
        answers.storage?.writeAccessToken || config?.storage?.writeAccessToken || '',
    },
    workflow: {},
  } as Config;

  if (!config?.workflow?.resultEncryption?.key) {
    defaultConfig.workflow.resultEncryption = {
      algo: CryptoAlgorithm.ECIES,
      key: workflowGenerateKey(),
      encoding: Encoding.base64,
    };
  } else {
    defaultConfig.workflow.resultEncryption = config.workflow.resultEncryption;
  }

  return defaultConfig;
};

import { CryptoAlgorithm, Encoding, Encryption, StorageType } from '@super-protocol/dto-js';
import fs from 'fs';
import path from 'path';
import { z, ZodError } from 'zod';
import Printer from './printer';
import { createZodErrorMessage, ErrorWithCustomMessage } from './utils';
import { DEFAULT_PCCS_SERVICE } from './constants';

const defaultSpaAuthKey = '322ed6bd9a802109e1e9692be0a825c6';

const clusterRegexp = new RegExp(/https:\/\/bff\.(\w+)\.superprotocol\.com\/graphql/);

const ConfigValidators = {
  backend: z.object({
    url: z.string(),
    accessToken: z.string(),
  }),
  blockchain: z.object({
    rpcUrl: z.string(),
    smartContractAddress: z.string(),
    accountPrivateKey: z.string(),
    authorityAccountPrivateKey: z.string().optional(),
  }),
  storage: z.object({
    type: z.nativeEnum(StorageType),
    bucket: z.string(),
    prefix: z.string().default(''),
    writeAccessToken: z.string(),
    readAccessToken: z.string(),
  }),
  workflow: z.object({
    resultEncryption: z.object({
      algo: z.nativeEnum(CryptoAlgorithm),
      key: z.string(),
      encoding: z.nativeEnum(Encoding),
    }),
  }),
  analytics: z
    .object({
      spaAuthKey: z.string().default(defaultSpaAuthKey),
      spaUrl: z.string().optional(),
    })
    .optional()
    .default({
      spaAuthKey: defaultSpaAuthKey,
    }),
  tii: z
    .object({
      pccsServiceApiUrl: z.string().default(DEFAULT_PCCS_SERVICE),
    })
    .optional()
    .default({ pccsServiceApiUrl: DEFAULT_PCCS_SERVICE }),
  metadata: z
    .object({
      lastCheckForUpdates: z.number().optional(),
    })
    .optional(),
};

export type Config = {
  backend: {
    url: string;
    accessToken: string;
  };
  blockchain: {
    rpcUrl: string;
    smartContractAddress: string;
    accountPrivateKey: string;
    authorityAccountPrivateKey: string;
  };
  storage: {
    type: StorageType;
    bucket: string;
    prefix: string;
    writeAccessToken: string;
    readAccessToken: string;
  };
  workflow: {
    resultEncryption: Encryption;
  };
  analytics: {
    spaUrl: string;
    spaAuthKey: string;
  };
  tii: {
    pccsServiceApiUrl: string;
  };
  metadata: { lastCheckForUpdates: number };
};

class ConfigLoader {
  private configPath: string;
  private rawConfig: Config;
  private validatedConfig: Partial<Config> = {};

  constructor(configPath: string) {
    this.configPath = configPath;
    const PROJECT_DIR = path.join(path.dirname(__dirname));
    const CONFIG_EXAMPLE_PATH = path.join(PROJECT_DIR, 'config.example.json');

    if (!fs.existsSync(configPath)) {
      Printer.error('Config file does not exist');
      fs.writeFileSync(configPath, fs.readFileSync(CONFIG_EXAMPLE_PATH));
      throw Error(`Default config file was created: ${configPath}\nPlease configure it`);
    }

    this.rawConfig = JSON.parse(fs.readFileSync(configPath).toString());
  }

  loadSection(sectionName: keyof Config): any {
    if (this.validatedConfig[sectionName]) return this.validatedConfig[sectionName];

    const validator = ConfigValidators[sectionName],
      rawSection = this.rawConfig[sectionName];

    try {
      // @ts-ignore validation result matches one of config keys
      this.validatedConfig[sectionName] = validator.parse(rawSection);

      this.setRuntimeDefaults(this.validatedConfig, sectionName);
    } catch (error) {
      const errorMessage = createZodErrorMessage((error as ZodError).issues);
      throw ErrorWithCustomMessage(
        `Invalid format of ${sectionName} config section:\n${errorMessage}`,
        error,
      );
    }
    return this.validatedConfig[sectionName];
  }

  updateSection<T extends keyof Config>(sectionName: T, newValues: Partial<Config[T]>): void {
    this.rawConfig[sectionName] = {
      ...this.rawConfig[sectionName],
      ...newValues,
    };

    fs.writeFileSync(this.configPath, JSON.stringify(this.rawConfig, null, 4));
  }

  private setRuntimeDefaults(target: Partial<Config>, sectionName: keyof Config): void {
    switch (sectionName) {
      case 'analytics':
        target[sectionName] = {
          ...(target[sectionName] as Config['analytics']),
          spaUrl: this.getSpaUrlByBackendUrl(this.rawConfig.backend.url),
        };
        break;

      default:
        break;
    }
  }

  private getSpaUrlByBackendUrl(backendUrl: string): string {
    const cluster = clusterRegexp.exec(backendUrl);

    switch (cluster?.at(1)) {
      case 'dev':
        return 'https://spa.dev.superprotocol.com';
      case 'stg':
        return 'https://spa.stg.superprotocol.com';
      case 'testnet':
        return 'https://spa.superprotocol.com';

      default:
        return '';
    }
  }
}

export default ConfigLoader;

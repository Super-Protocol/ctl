import { CryptoAlgorithm, Encoding, Encryption, StorageType } from '@super-protocol/dto-js';
import fs from 'fs';
import { z } from 'zod';
import Printer from './printer';
import { DEFAULT_PCCS_SERVICE } from './constants';
import setup from './commands/setup';

const defaultSpaAuthKey = '322ed6bd9a802109e1e9692be0a825c6';

const clusterRegexp = new RegExp(/https:\/\/bff\.(\w+)\.superprotocol\.com\/graphql/);

const configValidator = z.object({
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
});

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
  private validatedConfig: Config | undefined;

  static getConfig(configPath: string): Config | undefined {
    try {
      const rawConfig = JSON.parse(fs.readFileSync(configPath).toString());
      return configValidator.parse(rawConfig) as Config;
    } catch {
      return;
    }
  }

  static upsertConfig(configPath: string, config: Config): void {
    const configJson = JSON.stringify(config, null, 2);
    fs.writeFileSync(configPath, configJson);
  }

  constructor(configPath: string) {
    this.configPath = configPath;

    this.validatedConfig = ConfigLoader.getConfig(configPath);

    if (!this.validatedConfig) {
      Printer.error('Config file does not exist or corrupted');
    }
  }

  async loadSection<T extends keyof Config>(sectionName: T): Promise<Config[T]> {
    if (!this.validatedConfig) {
      return await this.setupConfig();
    }

    this.setRuntimeDefaults(this.validatedConfig, sectionName);
    return this.validatedConfig[sectionName];
  }

  updateSection<T extends keyof Config>(sectionName: T, newValues: Partial<Config[T]>): void {
    if (!this.validatedConfig) {
      throw new Error(`Config is missing! Please make 'spctl setup' command`);
    }
    this.validatedConfig[sectionName] = {
      ...this.validatedConfig[sectionName],
      ...newValues,
    };

    fs.writeFileSync(this.configPath, JSON.stringify(this.validatedConfig, null, 4));
  }

  private setRuntimeDefaults(target: Partial<Config>, sectionName: keyof Config): void {
    if (!this.validatedConfig) {
      throw new Error(`Config is missing! Please make 'spctl setup' command`);
    }

    switch (sectionName) {
      case 'analytics':
        target[sectionName] = {
          ...(target[sectionName] as Config['analytics']),
          spaUrl: this.getSpaUrlByBackendUrl(this.validatedConfig.backend.url),
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

  private async setupConfig(): Promise<never> {
    Printer.print('Config file will be generated interactively');
    const defaultConfig = await setup();
    ConfigLoader.upsertConfig(this.configPath, defaultConfig);
    Printer.print('Config file was generated. Please run your command again');
    process.exit(0);
  }
}

export default ConfigLoader;

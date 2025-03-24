import { CryptoAlgorithm, Encoding, EncryptionKey, StorageType } from '@super-protocol/dto-js';
import fs from 'fs';
import { z } from 'zod';
import Printer from './printer';
import { BACKEND_URL_DEFAULT, DEFAULT_PCCS_SERVICE } from './constants';
import setup from './commands/setup';
import { getConfigPath } from './utils';

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
      enabled: z.boolean().default(true),
      logEnabled: z.boolean().default(false),
      spaAuthKey: z.string().default(defaultSpaAuthKey),
      spaUrl: z.string().optional(),
    })
    .default({}),
  tii: z
    .object({
      pccsServiceApiUrl: z.string().default(DEFAULT_PCCS_SERVICE),
    })
    .default({
      pccsServiceApiUrl: DEFAULT_PCCS_SERVICE,
    }),
  metadata: z
    .object({
      lastCheckForUpdates: z.number().optional(),
    })
    .optional(),
});

export interface IAnalyticsConfig {
  enabled: boolean;
  logEnabled: boolean;
  spaAuthKey: string;
  spaUrl: string;
}

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
    resultEncryption: EncryptionKey;
  };
  analytics: IAnalyticsConfig;
  tii: {
    pccsServiceApiUrl: string;
  };
  metadata: { lastCheckForUpdates: number };
};

class ConfigLoader {
  private static validatedConfig?: Config;

  static async init(): Promise<void> {
    const configPath = getConfigPath();

    const { config, error } = ConfigLoader.getRawConfig(configPath);

    if (error) {
      Printer.error(error);
    } else {
      ConfigLoader.validatedConfig = ConfigLoader.validateConfig(config);
    }

    if (!ConfigLoader.validatedConfig) {
      Printer.print(`Config file ${configPath} will be generated interactively`);
      const defaultConfig = await setup(config);
      ConfigLoader.upsertConfig(configPath, defaultConfig);
      Printer.print(
        `Config file was generated and stores to ${configPath}. Please run your command again`,
      );
      process.exit(0);
    }
  }

  static getRawConfig(configPath: string): { config?: Config; error?: string } {
    if (!fs.existsSync(configPath)) {
      return { error: 'Config file was not found' };
    }

    try {
      const config = JSON.parse(fs.readFileSync(configPath).toString());

      return { config };
    } catch (err) {
      return { error: `Config is not valid JSON. Error: ${(err as Error).message}` };
    }
  }

  static upsertConfig(configPath: string, config: Config): void {
    const configJson = JSON.stringify(config, null, 2);
    fs.writeFileSync(configPath, configJson);
  }

  private static validateConfig(rawConfig?: Config): Config | undefined {
    if (!rawConfig) {
      return;
    }

    try {
      return configValidator.parse(rawConfig) as Config;
    } catch (err) {
      Printer.error(`Config does not have required or has deprecated fields`);
    }
  }

  constructor(private readonly configPath: string) {}

  loadSection<T extends keyof Config>(sectionName: T): Config[T] {
    if (!ConfigLoader.validatedConfig) {
      throw new Error(`Config is missing! Please run 'spctl setup' command`);
    }

    this.setRuntimeDefaults(ConfigLoader.validatedConfig, sectionName);
    return ConfigLoader.validatedConfig[sectionName];
  }

  updateSection<T extends keyof Config>(sectionName: T, newValues: Partial<Config[T]>): void {
    if (!ConfigLoader.validatedConfig) {
      throw new Error(`Config is missing! Please run 'spctl setup' command`);
    }

    ConfigLoader.validatedConfig[sectionName] = {
      ...ConfigLoader.validatedConfig[sectionName],
      ...newValues,
    };

    fs.writeFileSync(this.configPath, JSON.stringify(ConfigLoader.validatedConfig, null, 4));
  }

  private setRuntimeDefaults(target: Partial<Config>, sectionName: keyof Config): void {
    if (!ConfigLoader.validatedConfig) {
      throw new Error(`Config is missing! Please run 'spctl setup' command`);
    }

    switch (sectionName) {
      case 'analytics': {
        const sectionConfig = target[sectionName] as Config['analytics'];
        target[sectionName] = {
          ...sectionConfig,
          ...(!sectionConfig.spaUrl && {
            spaUrl: this.getSpaUrlByBackendUrl(ConfigLoader.validatedConfig.backend.url),
          }),
        };
        break;
      }
      default:
        break;
    }
  }

  private getSpaUrlByBackendUrl(backendUrl: string): string {
    const isMainnet = backendUrl === BACKEND_URL_DEFAULT;
    if (isMainnet) {
      return 'https://spa.superprotocol.com';
    }

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

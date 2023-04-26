import { CryptoAlgorithm, Encoding, Encryption, StorageType } from "@super-protocol/dto-js";
import { Config as BlockchainConfig } from "@super-protocol/sdk-js";
import fs from "fs";
import path from "path";
import process from "process";
import { z, ZodError } from "zod";
import Printer from "./printer";
import { createZodErrorMessage, ErrorWithCustomMessage } from "./utils";

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
        prefix: z.string().default(""),
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
    analytics: z.object({
        amplitudeApiKey: z.string(),
    }).optional(),
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
        amplitudeApiKey: string;
    }
};

class ConfigLoader {
    private configPath: string;
    private rawConfig: Config;
    private validatedConfig: Partial<Config> = {};

    constructor(configPath: string) {
        this.configPath = configPath;

        const PROJECT_DIR = path.join(path.dirname(__dirname));
        const CONFIG_EXAMPLE_PATH = path.join(PROJECT_DIR, "config.example.json");
        configPath = path.join(process.cwd(), configPath);

        if (!fs.existsSync(configPath)) {
            Printer.error("Config file does not exist");
            fs.writeFileSync(configPath, fs.readFileSync(CONFIG_EXAMPLE_PATH));
            throw Error(`Default config file was created: ${configPath}\nPlease configure it`);
        }

        this.rawConfig = JSON.parse(fs.readFileSync(configPath).toString());
    }

    loadSection(sectionName: keyof Config) {
        if (this.validatedConfig[sectionName]) return this.validatedConfig[sectionName];

        const validator = ConfigValidators[sectionName],
            rawSection = this.rawConfig[sectionName];

        try {
            // @ts-ignore validation result matches one of config keys
            this.validatedConfig[sectionName] = validator.parse(rawSection);
        } catch (error) {
            const errorMessage = createZodErrorMessage((error as ZodError).issues);
            throw ErrorWithCustomMessage(`Invalid format of ${sectionName} config section:\n${errorMessage}`, error);
        }
        return this.validatedConfig[sectionName];
    }
}

export default ConfigLoader;

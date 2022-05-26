import { CryptoAlgorithm, Encoding, Encryption, StorageType } from "@super-protocol/sp-dto-js";
import { StorageAccess, Config as BlockchainConfig } from "@super-protocol/sp-sdk-js";
import fs from "fs";
import path from "path";
import process from "process";
import { z } from "zod";
import Printer from "./printer";

const ConfigValidators = {
    backend: z.object({
        url: z.string(),
    }),
    blockchain: z.object({
        url: z.string(),
        contractAddress: z.string(),
    }),
    blockchainKeys: z.object({
        actionAccountKey: z.string(),
    }),
    tee: z.object({
        offerId: z.string(),
        solutionArgs: z.any(),
    }),
    storage: z.object({
        access: z.object({
            storageType: z.nativeEnum(StorageType),
            credentials: z.any(),
        }),
        encryption: z.object({
            algo: z.nativeEnum(CryptoAlgorithm),
            encoding: z.nativeEnum(Encoding),
            key: z.string(),
        }),
    }),
};

export type Config = {
    backend: {
        url: string;
    };
    blockchain: BlockchainConfig;
    blockchainKeys: {
        actionAccountKey: string;
    };
    tee: {
        offerId: string;
        solutionArgs: any;
    };
    storage: {
        access: StorageAccess;
        encryption: Encryption;
    };
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
            Printer.error("Config file doesn't exist.");
            fs.writeFileSync(configPath, fs.readFileSync(CONFIG_EXAMPLE_PATH));
            throw Error(`Blank config file was created: ${configPath}\nPlease configure it.`);
        }

        this.rawConfig = JSON.parse(fs.readFileSync(configPath).toString());
    }


    loadSection(sectionName: keyof Config) {
        if (this.validatedConfig[sectionName]) return this.validatedConfig[sectionName];

        const validator = ConfigValidators[sectionName],
            rawSection = this.rawConfig[sectionName];

        if (!rawSection)
            throw Error(`${sectionName} not specified\nPlease configure ${sectionName} section in ${this.configPath}`);

        // @ts-ignore validation result matches one of config keys
        this.validatedConfig[sectionName] = validator.parse(rawSection);
        return this.validatedConfig[sectionName];
    }
}

export default ConfigLoader;

import { CryptoAlgorithm, Encoding, Encryption, StorageType } from "@super-protocol/sp-dto-js";
import { StorageAccess, Config as BlockchainConfig } from "@super-protocol/sp-sdk-js";
import fs from "fs";
import path from "path";
import process from "process";
import { z } from "zod";
import Printer from "./printer";

const ConfigValidator = z.object({
    blockchain: z.object({
        url: z.string(),
        contractAddress: z.string(),
    }).optional(),
    tee: z.object({
        offerId: z.string(),
        solutionArgs: z.any(),
    }).optional(),
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
    }).optional(),
});

export type Config = {
    blockchain?: BlockchainConfig;
    tee?: {
        offerId: string;
        solutionArgs: any;
    };
    storage?: {
        access: StorageAccess;
        encryption: Encryption;
    };
};

let CONFIG: Config | undefined;

export default (configPath: string): Config => {
    if (CONFIG) return CONFIG;

    const PROJECT_DIR = path.join(path.dirname(__dirname));
    const CONFIG_EXAMPLE_PATH = path.join(PROJECT_DIR, "config.example.json");
    configPath = path.join(process.cwd(), configPath);

    if (!fs.existsSync(configPath)) {
        Printer.error("Config file doesn't exist.");
        fs.writeFileSync(configPath, fs.readFileSync(CONFIG_EXAMPLE_PATH));
        throw Error(`Blank config file was created: ${configPath}\nPlease configure it.`);
    }

    
    const parsedJson = JSON.parse(fs.readFileSync(configPath).toString());
    const validatedConfig = ConfigValidator.parse(parsedJson);

    CONFIG = {
        blockchain: validatedConfig.blockchain && {
            blockchainUrl: validatedConfig.blockchain.url,
            contractAddress: validatedConfig.blockchain.contractAddress,
        },
        tee: validatedConfig.tee && {
            offerId: validatedConfig.tee.offerId,
            solutionArgs: validatedConfig.tee.solutionArgs,
        },
        storage: validatedConfig.storage && {
            access: {
                storageType: validatedConfig.storage.access.storageType as StorageType,
                credentials: validatedConfig.storage.access.credentials,
            },
            encryption: validatedConfig.storage.encryption,
        },
    };

    return CONFIG;
}

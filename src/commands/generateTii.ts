import { promises as fs } from "fs";
import { Config as BlockchainConfig, TIIGenerator } from "@super-protocol/sdk-js"
import readResourceFile from "../services/readResourceFile";
import { preparePath } from "../utils";
import Printer from "../printer";
import initBlockchainConnector from "../services/initBlockchainConnector";

export type GenerateTiiParams = {
    blockchainConfig: BlockchainConfig
    teeOfferId: string;
    resoursePath: string;
    outputPath: string;
}

export default async (params: GenerateTiiParams) => {
    const resourceFile = await readResourceFile({
        path: preparePath(params.resoursePath),
    });

    const { resource, encryption, hash, linkage, args } = resourceFile;

    if (!encryption) {
        throw new Error("Resource encryption missing");
    }

    Printer.print("Connecting to the blockchain");
    await initBlockchainConnector({
        blockchainConfig: params.blockchainConfig,
    });

    const tii = await TIIGenerator.generateByOffer(
        params.teeOfferId,
        hash ? [hash] : [],
        JSON.stringify(linkage),
        resource,
        args,
        encryption,
    );

    await fs.writeFile(params.outputPath, tii);
}

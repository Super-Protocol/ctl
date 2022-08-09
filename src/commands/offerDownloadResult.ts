import downloadService from "../services/downloadFile";
import Printer from "../printer";
import { isCommandSupported } from "../services/uplinkSetupHelper";
import path from "path";
import { ResourceType, StorageProviderResource, UrlResource } from "@super-protocol/dto-js";
import downloadFileByUrl from "../services/downloadFileByUrl";
import initBlockchainConnector from "../services/initBlockchainConnector";
import { Config as BlockchainConfig } from "@super-protocol/sdk-js/build/BlockchainConnector";
import getOfferResult from "../services/getOfferResult";

export type OfferDownloadParamsParams = {
    blockchainConfig: BlockchainConfig;
    offerId: string;
    localPath: string;
};

export default async (params: OfferDownloadParamsParams): Promise<void> => {
    Printer.print("Connecting to blockchain...");
    await initBlockchainConnector({
        blockchainConfig: params.blockchainConfig,
    });

    Printer.print("Connected successfully, fetching offer result from blockchain...");
    const resource = await getOfferResult({ offerId: params.offerId });
    if (!resource) {
        Printer.print(`Offer ${params.offerId} requires to create order to get result`);
        return;
    }

    Printer.print("Offer result found, downloading file...");
    const localPath = path.join(process.cwd(), params.localPath.replace(/\/$/, ""));
    switch (resource.type) {
        case ResourceType.Url:
            await downloadFileByUrl({
                url: (resource as UrlResource).url,
                savePath: path.join(process.cwd(), params.localPath),
                progressListener: (total, current) => {
                    Printer.progress("Downloading", total, current);
                },
            });
            break;

        case ResourceType.StorageProvider:
            if (!isCommandSupported()) return;

            const storageProviderResource: StorageProviderResource = resource as StorageProviderResource;
            await downloadService(
                storageProviderResource.filepath,
                localPath,
                storageProviderResource,
                (total: number, current: number) => {
                    Printer.progress("Downloading", total, current);
                }
            );
            break;
        default:
            throw Error(`Resource type ${resource.type} not supported`);
    }

    Printer.stopProgress();
    Printer.print("Done");
};

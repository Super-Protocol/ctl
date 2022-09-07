import downloadService from "../services/downloadFile";
import Printer from "../printer";
import { isCommandSupported } from "../services/uplinkSetupHelper";
import path from "path";
import { ResourceType, StorageProviderResource, UrlResource } from "@super-protocol/dto-js";
import downloadFileByUrl from "../services/downloadFileByUrl";
import initBlockchainConnector from "../services/initBlockchainConnector";
import { Config as BlockchainConfig } from "@super-protocol/sdk-js/build/BlockchainConnector";
import { preparePath } from "../utils";
import getOfferContent from "../services/getOfferContent";

export type OfferDownloadParamsParams = {
    blockchainConfig: BlockchainConfig;
    offerId: string;
    localPath: string;
};

export default async (params: OfferDownloadParamsParams): Promise<void> => {
    Printer.print("Connecting to the blockchain");
    await initBlockchainConnector({
        blockchainConfig: params.blockchainConfig,
    });

    Printer.print("Fetching offer content");
    const resource = await getOfferContent({ offerId: params.offerId });
    if (!resource) {
        Printer.print(`Offer ${params.offerId} does not allow to download its content`);
        return;
    }

    Printer.print("Offer content is available for download");
    const localPath = preparePath(params.localPath).replace(/\/$/, "");
    switch (resource.type) {
        case ResourceType.Url:
            await downloadFileByUrl({
                url: (resource as UrlResource).url,
                savePath: path.join(process.cwd(), params.localPath),
                progressListener: (total, current) => {
                    Printer.progress("Downloading file", total, current);
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
                    Printer.progress("Downloading file", total, current);
                }
            );
            break;
        default:
            throw Error(`Resource type ${resource.type} is not supported`);
    }

    Printer.stopProgress();
    Printer.print(`Offer content was saved to ${params.localPath}`);
};

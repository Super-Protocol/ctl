import { TeeOfferInfo } from "@super-protocol/sdk-js";
import z from "zod";
import readJsonFile from "./readJsonFile";
import { EncryptionValidator } from "./readResourceFile";

export type ReadTeeOfferInfoFileParams = {
    path: string;
};

const TeeOfferInfoFileValidator = z.object({
    name: z.string(),
    description: z.string(),
    teeType: z.string(),
    slots: z.number(),
    minTimeMinutes: z.number(),
    properties: z.string(),
    tcb: z.string(),
    tlb: z.string(),
    argsPublicKey: EncryptionValidator,
    maxDurationTimeMinutes: z.number(),
});

export default async (params: ReadTeeOfferInfoFileParams) => {
    let resourceFile = await readJsonFile({ path: params.path, validator: TeeOfferInfoFileValidator });

    const offerInfo: TeeOfferInfo = {
        ...resourceFile,
        argsPublicKey: JSON.stringify(resourceFile.argsPublicKey),
    };

    return offerInfo;
}

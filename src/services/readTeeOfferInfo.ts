import { TeeOfferInfo } from "@super-protocol/sdk-js";
import z from "zod";
import readJsonFile from "./readJsonFile";
import { EncryptionValidator } from "./readResourceFile";
import { OptionInfoValidator, SlotInfoValidator } from "./baseValidators";

export type ReadTeeOfferInfoFileParams = {
    path: string;
};

const HardwareInfoValidator = z.object({
    slotInfo: SlotInfoValidator,
    optionInfo: OptionInfoValidator,
});

const TeeOfferInfoFileValidator = z.object({
    name: z.string(),
    description: z.string(),
    teeType: z.string(),
    properties: z.string(),
    tlb: z.string(),
    argsPublicKey: EncryptionValidator,
    hardwareInfo: HardwareInfoValidator,
});

export default async (params: ReadTeeOfferInfoFileParams) => {
    let resourceFile = await readJsonFile({ path: params.path, validator: TeeOfferInfoFileValidator });

    const offerInfo: TeeOfferInfo = {
        ...resourceFile,
        argsPublicKey: JSON.stringify(resourceFile.argsPublicKey),
    };

    return offerInfo;
}

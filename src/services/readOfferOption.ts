import { OptionInfo, SlotUsage } from "@super-protocol/sdk-js";
import readJsonFile from "./readJsonFile";
import { OptionInfoValidator, SlotUsageValidator } from "./baseValidators";
import { z } from "zod";

export type ReadFileParams = {
    path: string;
};

export type TeeOfferOption = {
    optionInfo: OptionInfo;
    optionUsage: SlotUsage;
};

const TeeOptionValidator = z.object({
    optionInfo: OptionInfoValidator,
    optionUsage: SlotUsageValidator,
});

export default async (params: ReadFileParams): Promise<TeeOfferOption> => {
    const offerOption = await readJsonFile({
        path: params.path,
        validator: TeeOptionValidator,
    });

    return offerOption;
};

import z from "zod";
import {
    OptionInfo,
    SlotInfo,
    SlotUsage,
} from "@super-protocol/sdk-js";
import readJsonFile from "./readJsonFile";
import {
    SlotInfoValidator,
    SlotUsageValidator,
    OptionInfoValidator,
} from "./baseValidators";

export type ReadFileParams = {
    path: string;
};

const ValueOfferSlotFileValidator = z.object({
    slotInfo: SlotInfoValidator,
    slotUsage: SlotUsageValidator,
    optionInfo: OptionInfoValidator,
});
export type ValueOfferSlot = {
    slotInfo: SlotInfo;
    slotUsage: SlotUsage;
    optionInfo: OptionInfo;
}

export default async (params: ReadFileParams): Promise<ValueOfferSlot> => {
    const valueOfferSlot = await readJsonFile({
        path: params.path,
        validator: ValueOfferSlotFileValidator,
    });

    return valueOfferSlot;
};

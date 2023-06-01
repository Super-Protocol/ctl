import { PriceType } from "@super-protocol/sdk-js";
import z from "zod";

export const SlotInfoValidator = z.object({
    cpuCores: z.number().min(0),
    ram: z.number().min(0),
    diskUsage: z.number().min(0),
});

export const SlotUsageValidator = z.object({
    priceType: z.nativeEnum(PriceType),
    price: z.string(),
    minTimeMinutes: z.number().min(0),
    maxTimeMinutes: z.number().min(0),
});

export const OptionInfoValidator = z.object({
    bandwidth: z.string(),
    traffic: z.string(),
    externalPort: z.string(),
});

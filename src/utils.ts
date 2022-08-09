import { promisify } from "util";
import { exec as execCallback } from "child_process";
import { Command } from "commander";
import { DateTime } from "luxon";
import { BigNumberish, ethers } from "ethers";

export const exec = promisify(execCallback);

export const processSubCommands = (program: Command, process: (command: Command) => void) => {
    const processRecursive = (cmd: Command) => {
        cmd.commands.forEach((cmd) => {
            process(cmd);
            processRecursive(cmd);
        });
    };

    processRecursive(program);
};

export const commaSeparatedList = (value: string) => {
    return value.split(",").map((item) => item.trim());
};

export const collectOptions = (value: string, previous: string[]) => {
    return previous.concat([value]);
};

export const validateFields = (fields: string[], allowedFields: string[]) => {
    fields.forEach((field) => {
        if (!allowedFields.includes(field))
            throw Error(`Field "${field}" not supported\nSupported fields: ${allowedFields.join(", ")}`);
    });
};

export const generateExternalId = () => [...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");

export const snakeToCamel = (str: string) =>
    str.toLowerCase().replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace("-", "").replace("_", ""));

export const prepareObjectToPrint = (object: { [key: string]: any }, fields: string[]) => {
    const newObject: { [key: string]: any } = {};
    fields.forEach((key) => {
        newObject[key] = object[snakeToCamel(key)];
    });
    return newObject;
};

export const getObjectKey = (value: any, object: { [key: string]: any }) => {
    const result = Object.entries(object).find(([k, v]) => v === value);
    return result ? result[0] : "none";
};

export const formatDate = (date: string | number | Date | undefined) => {
    if (!date) return undefined;
    return DateTime.fromJSDate(new Date(date)).toFormat("ff");
};

export const SilentError = (error: Error) => ({
    error,
    isSilent: true,
});

export const ErrorWithCustomMessage = (message: string, error: Error) => ({
    error,
    message,
    hasCustomMessage: true,
});

export const assertCommand = async (command: string, assertMessage: string) => {
    try {
        await exec(command);
    } catch (error: any) {
        if (error.code === 127 && error.stderr.indexOf(": not found")) {
            throw new Error(assertMessage);
        }
    }
};

export const assertNumber = (value: string | undefined, assertMessage: string) => {
    if (value && !value.match(/^[\d]+$/)) {
        throw new Error(assertMessage);
    }
};

export const assertSize = (value: string | undefined, assertMessage: string) => {
    if (value && !value.match(/^[\d]+[KMG]$/)) {
        throw new Error(assertMessage);
    }
};

export const weiToEther = (wei?: BigNumberish|null, precision = 4) => {
    if (!wei) return undefined;
    let ether = ethers.utils.formatEther(wei);
    return Number(ether.substring(0, ether.indexOf('.') + precision + 1)).toFixed(precision);
};

export const etherToWei = (ether: string) => {
    return ethers.utils.parseEther(ether);
};

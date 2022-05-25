import { Command } from "commander";
import path from "path";
import Printer from "./printer";
import fs from "fs";

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
}

export const validateFields = (fields: string[], allowedFields: string[]) => {
    fields.forEach((field) => {
        if (!allowedFields.includes(field))
            throw Error(`Field "${field}" not supported\nSupported fields: ${allowedFields.join(", ")}`);
    });
};

export const snakeToCamel = (str: string) =>
    str.toLowerCase().replace(/([-_][a-z])/g, group =>
        group
            .toUpperCase()
            .replace('-', '')
            .replace('_', '')
    );

export const SilentError = (error: Error) => ({
    error,
    isSilent: true,
});
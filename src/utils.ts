import { promisify } from "util";
import { exec as execCallback } from "child_process";
import { Command } from "commander";

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

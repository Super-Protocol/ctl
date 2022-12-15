import { promises as fs, existsSync } from "fs";
import { SomeZodObject, ZodError } from "zod";
import { createZodErrorMessage, ErrorWithCustomMessage } from "../utils";

export type ReadJsonFileParams = {
    path: string;
    validator?: SomeZodObject;
};

const readJsonFile = async (params: ReadJsonFileParams) => {
    if (!existsSync(params.path)) {
        throw Error(`File could not be found in ${params.path}`);
    }

    let jsonString = await fs.readFile(params.path, "utf8");
    let parsedValue;
    try {
        parsedValue = JSON.parse(jsonString);
    } catch (e) {
        throw ErrorWithCustomMessage(`Invalid JSON format of file ${params.path}`, e as Error);
    }

    try {
        await params.validator?.parseAsync(JSON.parse(jsonString));
    } catch (error) {
        const errorMessage = createZodErrorMessage((error as ZodError).issues);
        throw ErrorWithCustomMessage(
            `Schema validation failed for file ${params.path}:\n${errorMessage}`,
            error as Error
        );
    }
    return parsedValue;
};

export default readJsonFile;

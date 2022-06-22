import { promises as fs, existsSync } from "fs";
import { ErrorWithCustomMessage } from "../utils";

export type ReadJsonFileParams = {
    path: string;
};

const readResourceFile = async (params: ReadJsonFileParams) => {
    if (!existsSync(params.path)) {
        throw Error(`File not found in ${params.path}`);
    }

    let jsonString = await fs.readFile(params.path, "utf8");
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        throw ErrorWithCustomMessage(`Invalid JSON format of file ${params.path}`, e as Error);
    }
};

export default readResourceFile;

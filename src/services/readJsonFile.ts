import { promises as fs, existsSync } from "fs";

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
        throw Error(`Invalid JSON format of file ${params.path}`);
    }
};

export default readResourceFile;

import path from "path";
import process from "process";
import readResourceFile, { ResourceFile } from "./readResourceFile";

export type ParseInputResourcesParams = {
    options: string[];
    optionsName: string;
};

const idRegexp = /^\d+$/;

export default async (params: ParseInputResourcesParams) => {
    const resourceFiles: ResourceFile[] = [],
        addresses: string[] = [];
    await Promise.all(
        params.options.map(async (param, index) => {
            if (idRegexp.test(param)) {
                addresses.push(param);
                return;
            }

            const resourceFile = await readResourceFile({
                path: path.join(process.cwd(), param),
            });
            resourceFiles.push(resourceFile);
        })
    );

    return {
        resourceFiles,
        addresses,
    };
};

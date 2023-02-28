import readResourceFile, { ResourceFile } from "./readResourceFile";
import { AESEncryption, Cipher, CryptoAlgorithm, Encoding } from "@super-protocol/dto-js";
import { preparePath } from "../utils";
import readJsonFile from "./readJsonFile";

export type ParseInputResourcesParams = {
    options: string[];
    optionsName: string;
};

const idRegexp = /^\d+$/;

export default async (params: ParseInputResourcesParams) => {
    const resourceFiles: ResourceFile[] = [],
        ids: string[] = [],
        tiis: string[] = [];
    await Promise.all(
        params.options.map(async (param, index) => {
            if (idRegexp.test(param)) {
                ids.push(param);
                return;
            }

            // TODO: optimize double file reading
            const file = await readJsonFile({ path: preparePath(param) });
            if (file.tri) {
                tiis.push(JSON.stringify(file));
                return;
            }

            const resourceFile = await readResourceFile({
                path: preparePath(param),
            });

            // TODO: remove this code, after TII with no encryption will be allowed
            if (!resourceFile.encryption) {
                resourceFile.encryption = {
                    algo: CryptoAlgorithm.AES,
                    encoding: Encoding.base64,
                    cipher: Cipher.AES_256_GCM,
                    iv: "",
                    mac: "",
                    key: "",
                } as AESEncryption;
            }

            resourceFiles.push(resourceFile);
        })
    );

    return {
        resourceFiles,
        ids,
        tiis,
    };
};

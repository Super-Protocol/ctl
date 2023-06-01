import readResourceFile, { ResourceFile } from "./readResourceFile";
import {
    AESEncryption,
    Cipher,
    CryptoAlgorithm,
    Encoding,
} from "@super-protocol/dto-js";
import { preparePath } from "../utils";
import readJsonFile from "./readJsonFile";
import { ValueOfferParams } from "./createWorkflow";

export type ParseInputResourcesParams = {
    options: string[];
};

const idRegexp = /^(?:\d+,)?\d+$/;

export default async (params: ParseInputResourcesParams) => {
    const resourceFiles: ResourceFile[] = [],
        offers: ValueOfferParams[] = [],
        tiis: string[] = [];
    await Promise.all(
        params.options.map(async (param) => {
            if (idRegexp.test(param)) {
                const [offerId, slotId] = param.split(",");
                offers.push({ id: offerId, slotId });
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
        offers,
        tiis,
    };
};

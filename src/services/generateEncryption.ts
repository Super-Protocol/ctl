import { CryptoAlgorithm, Encoding, Encryption } from "@super-protocol/dto-js";
import * as crypto from "crypto";

export default async (): Promise<Encryption> => {
    return {
        algo: CryptoAlgorithm.AES,
        key: crypto.randomBytes(32).toString(Encoding.base64),
        encoding: Encoding.base64,
    };
};

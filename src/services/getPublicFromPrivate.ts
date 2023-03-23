import crypto from "crypto";
import { ErrorWithCustomMessage } from "../utils";

export default (privateKey: string): string => {
    try {
        const ecdh = crypto.createECDH("secp256k1");
        ecdh.setPrivateKey(Buffer.from(privateKey, "base64"))

        return ecdh.getPublicKey().toString("base64");
    } catch (error) {
        throw ErrorWithCustomMessage("Invalid private key provided", error as Error);
    }
};

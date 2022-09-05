import eccrypto from "eccrypto";
import { ErrorWithCustomMessage } from "../utils";

export default (privateKey: string): string => {
    try {
        const privateKeyBuffer = Buffer.from(privateKey, "base64");
        return eccrypto.getPublic(privateKeyBuffer).toString("base64");
    } catch (error) {
        throw ErrorWithCustomMessage("Invalid private key provided", error as Error);
    }
};

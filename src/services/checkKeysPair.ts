import { Crypto } from "@super-protocol/sdk-js";
import { Encryption } from "@super-protocol/dto-js";

export type CheckKeysPairParams = {
    encryption: Encryption;
    decryptionKey: string;
};

export default async (params: CheckKeysPairParams) => {
    const testMessage = (Math.random() + 1).toString(36).substring(2);

    const encrypted = await Crypto.encrypt(testMessage, params.encryption);
    encrypted.key = params.decryptionKey;
    const decrypted = await Crypto.decrypt(encrypted);

    if (testMessage !== decrypted) throw Error("Result encryption and decryption keys don't match");
};

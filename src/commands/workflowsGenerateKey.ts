import * as bip39 from 'bip39';

export const workflowGenerateKey = (): string => {
  const mnemonic = bip39.generateMnemonic(256);
  const entropy = bip39.mnemonicToEntropy(mnemonic);

  return Buffer.from(entropy, 'hex').toString('base64');
};

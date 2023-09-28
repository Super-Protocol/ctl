import { Config as BlockchainConfig, OrderResult } from '@super-protocol/sdk-js';
import { GetOrderResultParams } from '../../src/services/getOrderResult';
import ordersDownloadResult, { localTxtPath } from '../../src/commands/ordersDownloadResult';
import fs, { promises as fsPromises } from 'fs';
import path from 'path';
import { CryptoAlgorithm, Encoding, Encryption } from '@super-protocol/dto-js';
import { preparePath } from '../../src/utils';

jest.mock('fs');
jest.mock('../../src/services/initBlockchainConnector');
jest.mock('../../src/services/checkOrder');
jest.mock('../../src/services/getOrderResult', () => {
  return {
    __esModule: true,
    default: jest
      .fn()
      .mockImplementation(async ({ orderId }: GetOrderResultParams) => orderResults[orderId]),
  };
});
jest.mock('../../src/services/downloadFile');
jest.mock('../../src/services/downloadFileByUrl');
jest.mock('../../src/services/decryptFile', () => {
  const mock = jest.fn().mockImplementation(async (filepath: string) => {
    const decryptedFilepath = filepath.substring(0, filepath.lastIndexOf('.encrypted'));
    await fsPromises.writeFile(preparePath(decryptedFilepath), decryptedFileContent);
  });
  return {
    __esModule: true,
    default: mock,
  };
});

const privateKey = 'U1O5yVbsN4F2liuI2Ml3Z1DzPl9pjNuQlU/XlhEU2NM=';

const encryptedResultObj = {
  resource: {
    algo: 'ECIES',
    ciphertext:
      'BWzJKhoQh3ayzXHmOmcwIFLxIm6E8tDy/YJMoEch6u4pL9Y0js6+yn6DaoY+t9JKXvX1WmvI2ZGaH/lVCPJnMV4MFxF1ZU19fL46yuZUThwHiU7RHgPKNCBJP1twgFsPABgWAwqsRgrktEYtR4u5cxpQr/dYnoaKbga9PsTKRMZAiFblXMRAt3AE113pgfUSoq5HQ4A8guP9Ho4St+q8OfUpftm0PrUjIHUq0LzutBjJbTrLAVKcnDaWg73353whlmXKmY9ufYO0fEzyXbUj5bohO+9O+46oUKYBT6O6l2HGoFPKZLup+Z2nUVpbsJzUu+CUnMFNZ8bj9laOJBn1WnFQbiokRe0KCAoVvtbaGBtZ5C6yrE0TGrkKoa8TCS6DI0JfJxC6d3lu4lzQbCbpjWiM8m3+IJgYWrTPI7KbV72UkPt5Ou3+NNq/JX3CGyu0wZie70tKeIJT6rBEEudiNTF90lOJr2+nyvVbxPkUMoX99d9WlXykY4600FSkizX/wISzuTi5Zlv/mXzhKFH0QEZ9fLvMEp3hIMn43HHJ8AJdSCKWtlIUVPtb1VhJnBiCYb/G6tC3Z7+ezG5ZDcYC/xqr8sXxN+ADCpVRqC//+XBryVs68dNfw3IrWDiWd0WPZuIXg15ohvl18jDlak/PVs1j05rG7uuOBI4ZMlxm6ED7OuH7J742mhlhElaAmlA8y4BJzrIWejzIcx39t8Ytw7vRNyjZ3hdNeKN5ud+MiNiEM8z92P2tOLwuJxsmG//SF1ZzcRIekWYoVe/ueebckgqP3ZwzAMPCSo+o9GFnReE=',
    encoding: 'base64',
    ephemPublicKey:
      'BAjUIgb8LGUe7G8JtVirIsaQnt4j7Er6PEpbZ3IYApzqyscuozGE1iu76vrHD/kg/NsAsrJ0VRxGPguzDYHvgl4=',
    iv: 'VhWTDrKwma+AMiFs2WfIbQ==',
    mac: 'KFmpfyUSB+VQ+70LBmrr9V902yXpwdc08VHr3UNuJWQ=',
  },
  encryption: {
    algo: 'ECIES',
    ciphertext:
      '0lqVyw9ZfTc4vqmndHnkNjbdHdeoueFod+5RDIMa3GCrkQ63EWS2lethT2eXH9uJc9qrYPTbsrFATBVp14uVmxppIEF96umT1emIVJgTLE6Pmocmlmq2slCzdi/XDraW9bycn9TBPQVXBc1HiFZcsEXpV/Mo0Yk6Y8SuiK6cK43PfHe9hsPsjNObx58CAfKfqyT1BkdTxFCzRomi6Cty98r0fVK3qwrJaaXj929GiH0=',
    encoding: 'base64',
    ephemPublicKey:
      'BAixOtdQ3IL063Uq9tnL84fd+kv8oes7/yr5d+W8JiGluiYURA1LzGKlgGBVglKYuR7zxmxfi17usEqB0hXKD/U=',
    iv: 'qtPnZ7wBdzo/ZS2clE7OdA==',
    key: 'BEk7AqaE7a6s3JztKVTazS/mTDBNATEQtzcX+8t87LGg+5lUUn28KiGF1/6sSFu16WNqL6jbkbwDiEQOc0DuIJo=',
    mac: 'Oawvh0PNpibWNDGEzr2+1u6b292XZp/u/n61nB+3TlE=',
  },
};
const decryptedFileContent = 'decripted file contents!';

const encryptedTextMessage = {
  iv: 'LY65YD0yYMOrcQIifR6X/g==',
  ephemPublicKey:
    'BPEKymabP0ddxQc20+r2WxH4cL5G+HTJgd0uZcpg1tTjunfxJ3miZY1cwpv4AFrLT5u1KM2rLdYzWxzwxUCm7js=',
  mac: 'sSqJ9ibo5h9UaTsnwcYIFztGag2UnbLSQ2vHfg9c7j8=',
  encoding: Encoding.base64,
  algo: CryptoAlgorithm.ECIES,
  ciphertext: '6ind1B5FVSpwNhlbaKtPNg==',
} as Encryption;
const decryptedTextMessage = 'text message!';

const orderResults: { [id: string]: OrderResult } = {
  '1': {
    encryptedResult: JSON.stringify(encryptedResultObj),
    orderPrice: '1',
  },
  '2': {
    encryptedResult: JSON.stringify(encryptedTextMessage),
    orderPrice: '1',
  },
  '3': {
    encryptedResult: 'Error is not encrypted, because resultPublicKey is invalid.',
    orderPrice: '1',
  },
};

describe('ordersDownloadResult', () => {
  const blockchainConfig = {} as BlockchainConfig;
  const localPath = './result.tar.gz';

  beforeEach(() => {
    (<any>fs).__setMockFiles({});
  });

  it('should save order result to txt file when it does not have resource', async () => {
    await ordersDownloadResult({
      blockchainConfig,
      orderId: '1',
      localPath,
      resultDecryptionKey: privateKey,
    });

    expect(await fsPromises.readFile(path.join(process.cwd(), localPath))).toBe(
      decryptedFileContent,
    );
  });

  it('should save order result to txt file when it does not have resource', async () => {
    await ordersDownloadResult({
      blockchainConfig,
      orderId: '2',
      localPath,
      resultDecryptionKey: privateKey,
    });

    expect(await fsPromises.readFile(path.join(process.cwd(), localTxtPath))).toBe(
      decryptedTextMessage,
    );
  });

  it('should save order encrypted result to txt file when it is not a valid json', async () => {
    await ordersDownloadResult({
      blockchainConfig,
      orderId: '3',
      localPath,
      resultDecryptionKey: privateKey,
    });

    expect(await fsPromises.readFile(path.join(process.cwd(), localTxtPath))).toBe(
      orderResults['3'].encryptedResult,
    );
  });
});

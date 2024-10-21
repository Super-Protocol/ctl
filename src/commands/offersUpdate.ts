import _ from 'lodash';
import {
  Config as BlockchainConfig,
  Offer,
  OfferInfo,
  OfferType,
  TeeOffer,
  TeeOfferInfo,
  validateBySchema,
} from '@super-protocol/sdk-js';
import Printer from '../printer';
import initBlockchainConnector from '../services/initBlockchainConnector';
import { readTeeOfferInfo } from '../services/readTeeOfferInfo';
import { readValueOfferInfo } from '../services/readValueOfferInfo';
import { Config } from '../config';
import readJsonFile from '../services/readJsonFile';
import { uploadOfferInput } from '../services/uploadOfferInput';
import { OfferAttributes } from '@super-protocol/dto-js';

export type OffersUpdateParams = {
  id: string;
  type: 'tee' | 'value';
  offerInfoPath?: string;
  blockchainConfig: BlockchainConfig;
  actionAccountKey: string;
  storageConfig: Config['storage'];
  configurationPath?: string;
};

const createInstance = <T extends Offer | TeeOffer>(ctor: new (id: string) => T, id: string): T =>
  new ctor(id);

class Executor<
  OfferType extends Offer | TeeOffer,
  OfferInfoType extends Partial<OfferInfo> | Partial<TeeOfferInfo>,
> {
  private readonly instance: OfferType;
  private offerInfo: TeeOfferInfo | OfferInfo | undefined;
  constructor(
    id: string,
    private readonly data: OfferInfoType,
    ctor: new (id: string) => OfferType,
  ) {
    this.instance = createInstance<OfferType>(ctor, id);
  }

  async exec(): Promise<void> {
    const currentOfferInfo = await this.getOfferInfo();
    const updatedOfferInfo = _.mergeWith(
      _.cloneDeep(currentOfferInfo),
      this.data,
      (_updValue, srcValue) => {
        if (_.isArray(srcValue)) {
          return srcValue;
        }
      },
    );
    await this.instance.setInfo(updatedOfferInfo as TeeOfferInfo & OfferInfo);
  }

  async updateInput(
    path: string,
    storageConfig: Config['storage'],
    newName?: string,
  ): Promise<void> {
    const offerInfo = (await this.getOfferInfo()) as OfferInfo;
    if (offerInfo.offerType === OfferType.Storage) {
      Printer.print(`Configuration for Storage Offers is not supported and will be ignored`);
      return;
    }

    const configuration = await readJsonFile({ path });
    const { isValid, errors } = validateBySchema(
      configuration,
      OfferAttributes.Schemas.ArgumentSchemas.OfferInputSchema,
      { allErrors: true },
    );
    if (!isValid) {
      throw Error(`Configuration validation error! Errors: ${errors?.join(',')}`);
    }

    const inputResource = await uploadOfferInput({
      data: { configuration },
      offerName: newName || offerInfo.name,
      storageConfig: storageConfig,
    });

    (this.data as OfferInfo).input = JSON.stringify(inputResource);

    Printer.print('Offer configuration was saved successfully');
  }

  private async getOfferInfo(): Promise<OfferInfo | TeeOfferInfo> {
    if (!this.offerInfo) {
      this.offerInfo = await this.instance.getInfo();
    }
    return this.offerInfo;
  }
}

export default async (params: OffersUpdateParams): Promise<void> => {
  await initBlockchainConnector({
    blockchainConfig: params.blockchainConfig,
    actionAccountKey: params.actionAccountKey,
  });

  switch (params.type) {
    case 'tee': {
      if (!params.offerInfoPath) {
        throw new Error(`--path parameter is mandatory for tee offer`);
      }

      if (params.configurationPath) {
        Printer.print(`Configuration for tee offer is not supported and will be ignored`);
      }

      const info = await readTeeOfferInfo({
        path: params.offerInfoPath,
        isPartialContent: true,
      });

      Printer.print('TEE offer info file was read successfully, updating in blockchain');

      const executor = new Executor<TeeOffer, Partial<TeeOfferInfo>>(params.id, info, TeeOffer);
      await executor.exec();

      break;
    }
    case 'value': {
      const info = params.offerInfoPath
        ? await readValueOfferInfo({
            path: params.offerInfoPath,
            isPartialContent: true,
          })
        : {};

      Printer.print('Offer info file was read successfully, updating in blockchain');

      const executor = new Executor<Offer, Partial<OfferInfo>>(params.id, info, Offer);
      if (params.configurationPath) {
        await executor.updateInput(params.configurationPath, params.storageConfig, info.name);
      }
      await executor.exec();

      break;
    }
    default:
      throw new Error(`Unknown offer type ${params.type} provided`);
  }

  Printer.print(`Offer ${params.id} was updated successfully`);
};

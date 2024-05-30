import _ from 'lodash';
import {
  Config as BlockchainConfig,
  Offer,
  OfferInfo,
  TeeOffer,
  TeeOfferInfo,
} from '@super-protocol/sdk-js';
import Printer from '../printer';
import initBlockchainConnector from '../services/initBlockchainConnector';
import { readTeeOfferInfo } from '../services/readTeeOfferInfo';
import { readValueOfferInfo } from '../services/readValueOfferInfo';

export type OffersUpdateParams = {
  id: string;
  type: 'tee' | 'value';
  offerInfoPath: string;
  blockchainConfig: BlockchainConfig;
  actionAccountKey: string;
};

const createInstance = <T extends Offer | TeeOffer>(ctor: new (id: string) => T, id: string): T =>
  new ctor(id);

class Executor<
  OfferType extends Offer | TeeOffer,
  OfferInfoType extends Partial<OfferInfo> | Partial<TeeOfferInfo>,
> {
  private readonly instance: OfferType;
  constructor(
    id: string,
    private readonly data: OfferInfoType,
    ctor: new (id: string) => OfferType,
  ) {
    this.instance = createInstance<OfferType>(ctor, id);
  }

  async exec(): Promise<void> {
    const currentOfferInfo = await this.instance.getInfo();
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
}

export default async (params: OffersUpdateParams): Promise<void> => {
  await initBlockchainConnector({
    blockchainConfig: params.blockchainConfig,
    actionAccountKey: params.actionAccountKey,
  });

  switch (params.type) {
    case 'tee': {
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
      const info = await readValueOfferInfo({
        path: params.offerInfoPath,
        isPartialContent: true,
      });

      Printer.print('Offer info file was read successfully, updating in blockchain');

      const executor = new Executor<Offer, Partial<OfferInfo>>(params.id, info, Offer);
      await executor.exec();

      break;
    }
    default:
      throw new Error(`Unknown offer type ${params.type} provided`);
  }

  Printer.print(`Offer ${params.id} was updated successfully`);
};

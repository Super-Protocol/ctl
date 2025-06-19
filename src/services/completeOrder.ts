import {
  Crypto,
  Order,
  OrderStatus,
  TIIGenerator,
  Web3TransactionRevertedByEvmError,
  getStorageProvider,
} from '@super-protocol/sdk-js';
// import { StorjException } from '@super-protocol/uplink-nodejs/dist/error';
import { ErrorTxRevertedByEvm, ErrorWithCustomMessage, tryParse } from '../utils';
import readResourceFile, {
  EncryptedResourceFileValidator,
  StorageProviderResourceValidator,
} from './readResourceFile';
import readJsonFile from './readJsonFile';
import { getSdk, Order as SdkOrder, OrderInfo, ParentOrder, TOfferType } from '../gql';
import { GraphQLClient } from 'graphql-request';
import getGqlHeaders from './gqlHeaders';
import { EncryptionKey, ResourceType } from '@super-protocol/dto-js';

export const AVAILABLE_STATUSES = [OrderStatus.New, OrderStatus.Processing, OrderStatus.Canceling];
export type TerminatedOrderStatus = OrderStatus.Done | OrderStatus.Canceled | OrderStatus.Error;

export type CompleteOrderParams = {
  accessToken: string;
  backendUrl: string;
  id: string;
  pccsApiUrl: string;
  resourcePath?: string;
  status: TerminatedOrderStatus;
  actionAccountAddress: string;
};

type IParenOrder = Pick<ParentOrder, 'id' | 'offerType'>;
type IOrderInfo = Pick<OrderInfo, 'args' | 'resultInfo' | 'status'>;
type IOrder = Pick<SdkOrder, 'id' | 'offerType'> & {
  parentOrder?: IParenOrder | null;
  orderInfo: IOrderInfo;
};
type GetEncryptedResultFn = (
  order: IOrder,
  path: string,
  newStatus: OrderStatus,
) => Promise<string>;
const ZERO_ID = '0';

export class StorageResourceValidationError extends Error {
  constructor(message: string) {
    const detailed = message ? ` Error: ${message}` : '';
    super(`Result resource validation failed. ${detailed}`);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

export default async (params: CompleteOrderParams): Promise<void> => {
  const { id, status, resourcePath: path, pccsApiUrl } = params;
  const getOrderById = async (orderId: string): Promise<IOrder> => {
    const sdk = getSdk(new GraphQLClient(params.backendUrl));
    const headers = getGqlHeaders(params.accessToken);

    try {
      const result = await sdk.Order({ id: orderId }, headers);

      return result.order;
    } catch (error: any) {
      const mainErrorText = 'Fetching order error';
      const message = error?.response?.errors[0]?.message
        ? `${mainErrorText}: ${error.response.errors[0].message}`
        : mainErrorText;

      throw ErrorWithCustomMessage(message, error);
    }
  };

  const teeOfferResolver: GetEncryptedResultFn = (order) => {
    throw Error(
      `Order(id=${order.id}) has offer type: ${order.offerType}. Such orders couldn't be transferred to the terminal state manually.`,
    );
  };

  const dataOfferResolver: GetEncryptedResultFn = async (order, path, newStatus) => {
    if (
      order.parentOrder?.id &&
      order.parentOrder?.id !== ZERO_ID &&
      order.parentOrder.offerType === TOfferType.TeeOffer
    ) {
      if (newStatus === OrderStatus.Done) {
        const resource = await readResourceFile({
          path,
          validator: EncryptedResourceFileValidator,
        });

        if (resource.resource.type === ResourceType.StorageProvider) {
          await validateStorageResource(
            resource.resource as typeof StorageProviderResourceValidator._type,
          );
        }
        return await TIIGenerator.generate(
          order.id,
          resource.resource,
          order.orderInfo.args,
          resource.encryption!,
          pccsApiUrl,
        );
      } else {
        const resultResource = await readJsonFile({ path });
        return JSON.stringify(resultResource);
      }
    }

    return storageOfferResolver(order, path, newStatus);
  };
  const storageOfferResolver: GetEncryptedResultFn = async (order, path) => {
    if (!order.orderInfo.resultInfo.publicKey) {
      throw Error(
        `Order(id=${order.id}) with offer type ${order.offerType} should have result public key. Such orders couldn't be transferred to the terminal state manually`,
      );
    }
    const resultResource = await readJsonFile({ path });
    if (resultResource.resource) {
      const isResource = StorageProviderResourceValidator.safeParse(resultResource.resource);
      if (isResource.success) {
        await validateStorageResource(resultResource.resource);
      }
    }

    const publicKey: EncryptionKey = tryParse(order.orderInfo.resultInfo.publicKey) ?? {
      encoding: 'base64',
      algo: 'ECIES',
      key: order.orderInfo.resultInfo.publicKey,
    };

    const encryption = await Crypto.encrypt(JSON.stringify(resultResource), publicKey);

    return JSON.stringify(encryption);
  };

  const validateStorageResource = async (
    resource: typeof StorageProviderResourceValidator._type,
  ): Promise<boolean> => {
    try {
      const storageProvider = getStorageProvider({
        storageType: resource.storageType,
        credentials: resource.credentials!,
      });

      const objectSize = await storageProvider.getObjectSize(resource.filepath);
      if (objectSize > 0) {
        return true;
      }

      return false;
    } catch (error) {
      if (error instanceof StorjException) {
        throw new StorageResourceValidationError(error.details);
      }
      if (error instanceof Error) {
        throw new StorageResourceValidationError(error.message);
      }
      throw error;
    }
  };

  const resultPublicResolvers = {
    [TOfferType.TeeOffer]: teeOfferResolver,
    [TOfferType.Data]: dataOfferResolver,
    [TOfferType.Solution]: dataOfferResolver,
    [TOfferType.Storage]: storageOfferResolver,
  };
  let encryptedResult = '';
  const dbOrder = await getOrderById(id);

  if (status === OrderStatus.Canceled && dbOrder?.orderInfo.status !== OrderStatus.Canceling) {
    throw Error(`Order cancellation is possible only from "canceling" status`);
  }
  if (path) {
    encryptedResult = await resultPublicResolvers[dbOrder.offerType](dbOrder, path, status);
  }
  try {
    const order = new Order(id);
    if (dbOrder?.orderInfo.status === OrderStatus.New) {
      await order.updateStatus(OrderStatus.Processing, { from: params.actionAccountAddress });
    }
    await order.complete(status, encryptedResult, { from: params.actionAccountAddress });
  } catch (err: unknown) {
    if (err instanceof Web3TransactionRevertedByEvmError) {
      throw ErrorTxRevertedByEvm(err.originalError);
    }
    throw err;
  }
};

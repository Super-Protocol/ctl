import {
  Crypto,
  Order,
  OrderStatus,
  TIIGenerator,
  Web3TransactionRevertedByEvmError,
} from '@super-protocol/sdk-js';
import { ErrorTxRevertedByEvm, ErrorWithCustomMessage } from '../utils';
import readResourceFile, { ResourceFile } from './readResourceFile';
import { getSdk, Order as SdkOrder, OrderInfo, ParentOrder, TOfferType } from '../gql';
import { GraphQLClient } from 'graphql-request';
import getGqlHeaders from './gqlHeaders';

export const AVAILABLE_STATUSES = [OrderStatus.New, OrderStatus.Processing, OrderStatus.Canceling];
export type TerminatedOrderStatus = OrderStatus.Done | OrderStatus.Canceled | OrderStatus.Error;

export type CompleteOrderParams = {
  accessToken: string;
  backendUrl: string;
  id: string;
  pccsApiUrl: string;
  resourcePath?: string;
  status: TerminatedOrderStatus;
};

type IParenOrder = Pick<ParentOrder, 'id' | 'offerType'>;
type IOrderInfo = Pick<OrderInfo, 'args' | 'resultPublicKey' | 'status'>;
type IOrder = Pick<SdkOrder, 'id' | 'offerType'> & {
  parentOrder?: IParenOrder | null;
  orderInfo: IOrderInfo;
};
type ResourceInfo = Pick<ResourceFile, 'resource' | 'encryption'>;
type GetEncryptedResultFn = (order: IOrder, resource: ResourceInfo) => Promise<string>;
const ZERO_ID = '0';

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
  const dataOfferResolver: GetEncryptedResultFn = async (order, resource) => {
    if (
      order.parentOrder?.id &&
      order.parentOrder?.id !== ZERO_ID &&
      order.parentOrder.offerType === TOfferType.TeeOffer
    ) {
      if (!resource.encryption) {
        throw Error(
          `Order(id=${order.id}) has offer type: ${order.offerType} and resource doesn't have encryption info. Such orders couldn't be transferred to the terminal state manually`,
        );
      }

      return TIIGenerator.generate(
        order.id,
        resource.resource,
        order.orderInfo.args,
        resource.encryption,
        pccsApiUrl,
      );
    }

    return storageOfferResolver(order, resource);
  };
  const storageOfferResolver: GetEncryptedResultFn = async (order, resource) => {
    if (!order.orderInfo.resultPublicKey) {
      throw Error(
        `Order(id=${order.id}) with offer type ${order.offerType} should have result public key. Such orders couldn't be transferred to the terminal state manually`,
      );
    }
    const encryption = await Crypto.encrypt(
      JSON.stringify(resource),
      JSON.parse(order.orderInfo.resultPublicKey),
    );

    return JSON.stringify(encryption);
  };
  const resultPublicResolvers = {
    [TOfferType.TeeOffer]: teeOfferResolver,
    [TOfferType.Data]: dataOfferResolver,
    [TOfferType.Solution]: dataOfferResolver,
    [TOfferType.Storage]: storageOfferResolver,
  };
  let encryptedResult = '';
  let dbOrder: IOrder | undefined;
  let resource: ResourceInfo | undefined;

  if (path) {
    [resource, dbOrder] = await Promise.all([readResourceFile({ path }), getOrderById(id)]);
    encryptedResult = await resultPublicResolvers[dbOrder.offerType](dbOrder, resource);
  }
  if (status === OrderStatus.Canceled && dbOrder?.orderInfo.status !== OrderStatus.Canceling) {
    throw Error(`Cancel order is possible only from "canceling" status`);
  }
  try {
    const order = new Order(id);
    if (dbOrder?.orderInfo.status === OrderStatus.New) {
      await order.updateStatus(OrderStatus.Processing);
    }
    await order.complete(status, encryptedResult);
  } catch (err: unknown) {
    if (err instanceof Web3TransactionRevertedByEvmError) {
      throw ErrorTxRevertedByEvm(err.originalError);
    }
    throw err;
  }
};

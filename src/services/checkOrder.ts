import { Order, OrderStatus } from '@super-protocol/sdk-js';
import { getObjectKey } from '../utils';

export type CheckOrderParams = {
  id: string;
  statuses?: OrderStatus[];
};

const checkOrder = async (params: CheckOrderParams) => {
  const order = new Order(params.id);
  if (!(await order.isExist())) {
    throw Error('Order does not exist');
  }

  if (params.statuses?.length) {
    const info = await order.getOrderInfo();

    if (!params.statuses.includes(info.status)) {
      const current = getObjectKey(info.status, OrderStatus);
      const supported = params.statuses.map((s) => getObjectKey(s, OrderStatus)).join(', ');
      throw new Error(
        `Order status ${current} is not supported for this command, supported order statuses are: ${supported}`,
      );
    }
  }
};

export default checkOrder;

import { Order, OrderStatus } from '@super-protocol/sdk-js';
import checkOrder from '../../src/services/checkOrder';

jest.mock('@super-protocol/sdk-js');

// @ts-ignore
Order.mockImplementation((id: string) => {
  const order = {
    id,
    orderInfo: orders[id].orderInfo,
    getOrderInfo: () => order.orderInfo,
    isExist: orders[id].isExist,
  };
  return order;
});

const orders = {
  '1': {
    orderInfo: {},
    isExist: async () => false,
  } as Order,
  '2': {
    orderInfo: {
      status: OrderStatus.Done,
    },
    isExist: async () => true,
  } as Order,
  '3': {
    orderInfo: {
      status: OrderStatus.New,
    },
    isExist: async () => true,
  } as Order,
} as { [id: string]: Order };

describe('checkOrder', () => {
  it('should pass when order exists', async () => {
    await expect(checkOrder({ id: '2' })).resolves.not.toThrow();
  });

  it('should throw error when order does not exist', async () => {
    await expect(checkOrder({ id: '1' })).rejects.toThrowError('Order does not exist');
  });

  it('should pass when order status matches required', async () => {
    await expect(checkOrder({ id: '2', statuses: [OrderStatus.Done] })).resolves.not.toThrow();
  });

  it('should throw error when order is not in the required status', async () => {
    await expect(checkOrder({ id: '3', statuses: [OrderStatus.Done] })).rejects.toThrowError(
      `Order status New is not supported for this command, supported order statuses are: Done`,
    );
  });

  it('should throw error when order is not in some of the required statuses', async () => {
    await expect(
      checkOrder({ id: '3', statuses: [OrderStatus.Done, OrderStatus.Canceled] }),
    ).rejects.toThrowError(
      `Order status New is not supported for this command, supported order statuses are: Done, Canceled`,
    );
  });
});

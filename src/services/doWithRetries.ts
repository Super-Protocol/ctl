import { ATTEMPT_PERIOD_MS, MAX_ATTEMPT_WAITING_NEW_TX } from '../constants';
import { sleep } from '../utils';

export default async <T>(
  tryAction: () => Promise<T>,
  retryCount = MAX_ATTEMPT_WAITING_NEW_TX,
  retryTimeout = ATTEMPT_PERIOD_MS,
): Promise<T> => {
  let retries = retryCount;

  const action = async (): Promise<T> => {
    try {
      return await tryAction();
    } catch (error) {
      retries -= 1;

      if (retries) {
        await sleep(retryTimeout);
        return action();
      }

      throw error;
    }
  };

  return action();
};

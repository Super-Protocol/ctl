import { TeeOfferFilter } from '../gql';
import { ErrorWithCustomMessage } from '../utils';
import { ValueOfferParams } from './createWorkflow';
import fetchMinConfiguration from './fetchMinConfiguration';
import fetchMatchingTeeSlots, { MatchingTeeSlot } from './fetchMatchingTeeSlots';
import { CPU_CORES_FOR_CUSTOM_SOLUTION } from '../constants';

export type FetchMatchingTeeSlotsParams = {
  backendUrl: string;
  accessToken: string;
  tee: Partial<ValueOfferParams>;
  storage: ValueOfferParams;
  data: ValueOfferParams[];
  solutions: ValueOfferParams[];
  usageMinutes: number;
};

export default async (params: FetchMatchingTeeSlotsParams): Promise<MatchingTeeSlot> => {
  const { storage, data, solutions } = params;

  try {
    const valueOffers: [string, string][] = [<[string, string]>[storage.id, storage.slotId]]
      .concat(data.map((offer): [string, string] => [offer.id, offer.slotId]))
      .concat(solutions.map((solution): [string, string] => [solution.id, solution.slotId]));

    const minConfiguration = await fetchMinConfiguration({
      backendUrl: params.backendUrl,
      accessToken: params.accessToken,
      valueOffers,
    });

    if (!minConfiguration) {
      throw new Error('Unable to fetch munimum TEE slot configuration');
    }

    const filter: TeeOfferFilter = {
      cpuCores: [minConfiguration.cpuCores || CPU_CORES_FOR_CUSTOM_SOLUTION],
      gpuCores: [minConfiguration.gpuCores],
      vram: [minConfiguration.vram],
      ram: [minConfiguration.ram],
      diskUsage: [minConfiguration.diskUsage],
      bandwidth: minConfiguration.bandwidth,
      traffic: minConfiguration.traffic,
      externalPort: minConfiguration.externalPort,
      enabled: true,
      id: params.tee.id || undefined,
      usageMinutes: params.usageMinutes,
    };

    const slot = await fetchMatchingTeeSlots({
      backendUrl: params.backendUrl,
      accessToken: params.accessToken,
      filter: filter,
      limit: 1,
    }).then((slots) => slots?.at(0)?.node);

    return slot;
  } catch (error: any) {
    let message = error?.message || 'Unable to find a TEE slot';
    if (error?.response?.errors[0]?.message) message += ': ' + error.response.errors[0].message;
    throw ErrorWithCustomMessage(message, error);
  }
};

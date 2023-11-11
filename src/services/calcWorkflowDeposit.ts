import { Offer, ParamName, Superpro, TeeOffer } from '@super-protocol/sdk-js';
import { BigNumber } from 'ethers';
import { TeeOfferParams, ValueOfferParams } from './createWorkflow';

export type CalcWorkflowDepositParams = {
  tee: TeeOfferParams;
  storage: ValueOfferParams;
  solutions: ValueOfferParams[];
  data: ValueOfferParams[];
};

const calcWorkflowDeposit = async (params: CalcWorkflowDepositParams) => {
  const offers = [...params.solutions, ...params.data, params.storage];
  const orderMinDeposit = await Superpro.getParam(ParamName.OrderMinimumDeposit);

  let offersDeposits = BigNumber.from(0);
  await Promise.all(
    offers.map(async ({ id, slotId }) => {
      const offer = new Offer(id);
      const holdDeposit = await offer.getMinDeposit(slotId);
      offersDeposits = offersDeposits.add(holdDeposit);
    }),
  );

  const { id: teeId, slotId, slotCount, optionsIds, optionsCount } = params.tee;
  const teeOfferMinDeposit = await new TeeOffer(teeId).getMinDeposit(
    slotId,
    slotCount,
    optionsIds,
    optionsCount,
  );
  offersDeposits = offersDeposits.add(teeOfferMinDeposit);

  const workflowDeposit = offersDeposits.gte(orderMinDeposit)
    ? offersDeposits
    : BigNumber.from(orderMinDeposit);

  return workflowDeposit;
};

export default calcWorkflowDeposit;

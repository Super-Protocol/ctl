import { Offer, ParamName, Superpro } from "@super-protocol/sdk-js";
import { BigNumber } from "ethers";

export type CalcWorkflowDepositParams = {
    tee: string;
    storage: string;
    solutions: string[];
    data: string[];
};

const calcWorkflowDeposit = async (params: CalcWorkflowDepositParams) => {
    const offers = [...params.solutions, ...params.data, params.storage, params.tee];
    const orderMinDeposit = await Superpro.getParam(ParamName.OrderMinimumDeposit);

    let offersDeposits = BigNumber.from(0);
    await Promise.all(
        offers.map(async (id) => {
            const offer = new Offer(id);
            const holdDeposit = await offer.getHoldDeposit();
            offersDeposits = offersDeposits.add(holdDeposit);
        })
    );

    const workflowDeposit = offersDeposits.gte(orderMinDeposit) ? offersDeposits : BigNumber.from(orderMinDeposit);

    return workflowDeposit;
};

export default calcWorkflowDeposit;

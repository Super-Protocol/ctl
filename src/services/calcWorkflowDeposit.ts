import { Offer, ParamName, Superpro } from "@super-protocol/sp-sdk-js";
import { BigNumber } from "ethers";

export type CalcWorkflowDepositParams = {
    tee: string;
    storage: string;
    solutions: string[];
    data: string[];
};

const calcWorkflowDeposit = async (params: CalcWorkflowDepositParams) => {
    const valueOffers = params.solutions.concat(params.data, [params.storage]);
    const orderMinDeposit = await Superpro.getParam(ParamName.OrderMinimumDeposit);

    let offersDeposits = BigNumber.from(0);
    await Promise.all(
        valueOffers.map(async (address) => {
            const offer = new Offer(address);
            const { holdSum } = await offer.getInfo();
            offersDeposits.add(holdSum);
        })
    );

    // TODO: add calc for TEE offer
    offersDeposits.add(orderMinDeposit);

    return offersDeposits;
};

export default calcWorkflowDeposit;

import { Offer, ParamName, Superpro } from "@super-protocol/sp-sdk-js";

export type CalcWorkflowDepositParams = {
    tee: string;
    storage: string;
    solutions: string[];
    data: string[];
};

const calcWorkflowDeposit = async (params: CalcWorkflowDepositParams) => {
    const valueOffers = params.solutions.concat(params.data, [params.storage]);
    const orderMinDeposit = await Superpro.getParam(ParamName.OrderMinimumDeposit);

    let offersDeposits = 0;
    await Promise.all(
        valueOffers.map(async (address) => {
            const offer = new Offer(address);
            const { holdSum } = await offer.getInfo();
            offersDeposits += holdSum;
        })
    );

    // TODO: add calc for TEE offer
    offersDeposits += orderMinDeposit;

    return offersDeposits;
};

export default calcWorkflowDeposit;

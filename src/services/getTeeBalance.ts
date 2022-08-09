import { SuperproToken } from "@super-protocol/sdk-js";
import { BigNumber } from "ethers";

export type GetTeeBalanceParams = {
    address: string;
};

const getTeeBalance = async (params: GetTeeBalanceParams) => {
    const balance = await SuperproToken.balanceOf(params.address);
    return BigNumber.from(balance);
};

export default getTeeBalance;

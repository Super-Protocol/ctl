import { SuperproToken } from "@super-protocol/sdk-js";

export type GetTeeBalanceParams = {
    address: string;
};

const getTeeBalance = async (params: GetTeeBalanceParams) => {
    const wei = await SuperproToken.balanceOf(params.address);
    return +wei / 1000000000000000000;
};

export default getTeeBalance;

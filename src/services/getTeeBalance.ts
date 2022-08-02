import { SuperproToken } from "@super-protocol/sdk-js";
import { ethers } from "ethers";

export type GetTeeBalanceParams = {
    address: string;
};

const getTeeBalance = async (params: GetTeeBalanceParams) => {
    const wei = await SuperproToken.balanceOf(params.address);
    return ethers.utils.formatEther(wei);
};

export default getTeeBalance;

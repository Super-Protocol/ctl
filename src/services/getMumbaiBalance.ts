import BlockchainConnector from "@super-protocol/sdk-js";
import { ethers } from "ethers";

export type GetMumbaiBalanceParams = {
    address: string;
};

const getMumbaiBalance = async (params: GetMumbaiBalanceParams) => {
    const wei = await BlockchainConnector.getBalance(params.address);
    return ethers.utils.formatEther(wei);
};

export default getMumbaiBalance;

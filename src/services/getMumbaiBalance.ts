import BlockchainConnector from "@super-protocol/sdk-js";
import  { BigNumber } from "ethers";

export type GetMumbaiBalanceParams = {
    address: string;
};

const getMumbaiBalance = async (params: GetMumbaiBalanceParams) => {
    const weiString = await BlockchainConnector.getBalance(params.address);
    return BigNumber.from(weiString);
};

export default getMumbaiBalance;

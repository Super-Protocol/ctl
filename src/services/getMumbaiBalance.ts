import BlockchainConnector from "@super-protocol/sdk-js";

export type GetMumbaiBalanceParams = {
    address: string;
};

const getMumbaiBalance = async (params: GetMumbaiBalanceParams) => {
    const wei = await BlockchainConnector.getBalance(params.address);
    return +wei / 1000000000000000000;
};

export default getMumbaiBalance;

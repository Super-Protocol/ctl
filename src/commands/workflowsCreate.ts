import {
    Config as BlockchainConfig,
    TIIGenerator,
    SuperproToken,
    OrdersFactory,
    OrderStatus,
    Offer,
    OfferType,
    OfferInfo,
} from "@super-protocol/sdk-js";
import Printer from "../printer";
import initBlockchainConnectorService from "../services/initBlockchainConnector";
import validateOfferWorkflowService from "../services/validateOfferWorkflow";
import { CryptoAlgorithm, Encoding, Encryption } from "@super-protocol/dto-js";
import createWorkflowService from "../services/createWorkflow";
import parseInputResourcesService from "../services/parseInputResources";
import calcWorkflowDepositService from "../services/calcWorkflowDeposit";
import getTeeBalance from "../services/getTeeBalance";
import { ErrorTxRevertedByEvm, etherToWei, formatDate, getObjectKey, weiToEther } from "../utils";
import getPublicFromPrivate from "../services/getPublicFromPrivate";
import fetchOrdersCountService from "../services/fetchOrdersCount";
import { TOfferType } from "../gql";
import { TX_REVERTED_BY_EVM_ERROR } from "../constants";
import fetchOffers from "../services/fetchOffers";
import fetchTeeOffers from "../services/fetchTeeOffers";
import { BigNumber } from "ethers";

export type WorkflowCreateParams = {
    backendUrl: string;
    accessToken: string;
    blockchainConfig: BlockchainConfig;
    actionAccountKey: string;
    tee: string;
    storage: string;
    solutions: string[];
    data: string[];
    resultEncryption: Encryption;
    userDepositAmount: string;
    workflowNumber: number;
    ordersLimit: number;
};

type FethchedOffer = Partial<OfferInfo> & { id: string; };

const workflowCreate = async (params: WorkflowCreateParams): Promise<string | void> => {
    if (params.resultEncryption.algo !== CryptoAlgorithm.ECIES)
        throw Error("Only ECIES result encryption is supported");
    if (params.resultEncryption.encoding !== Encoding.base64)
        throw new Error("Only base64 result encryption is supported");

    Printer.print("Connecting to the blockchain");
    const consumerAddress = await initBlockchainConnectorService({
        blockchainConfig: params.blockchainConfig,
        actionAccountKey: params.actionAccountKey,
    });

    const ordersCount = await fetchOrdersCountService({
        backendUrl: params.backendUrl,
        accessToken: params.accessToken,
        includeStatuses: [OrderStatus.New, OrderStatus.Processing],
        consumer: consumerAddress!,
        offerType: TOfferType.TeeOffer,
    });

    if (params.workflowNumber === 1 && ordersCount >= params.ordersLimit) {
        throw new Error(
            `You have reached a limit on the number of active orders: ${params.ordersLimit}\nThis restriction was introduced temporarily due to the limited computing resources available during the Testnet phase`
        );
    }

    const resultEncryption: Encryption = {
        algo: params.resultEncryption.algo,
        encoding: params.resultEncryption.encoding,
        key: getPublicFromPrivate(params.resultEncryption.key!),
    };

    const solutions = await parseInputResourcesService({
        options: params.solutions,
        optionsName: "solution",
    });
    const data = await parseInputResourcesService({
        options: params.data,
        optionsName: "data",
    });

    const teeOffer = await fetchTeeOffers({
        backendUrl: params.backendUrl,
        accessToken: params.accessToken,
        limit: 1,
        id: params.tee,
    }).then(({ list }) => list[0]);

    if (!teeOffer) {
        throw new Error(`TEE offer ${params.tee} does not exist or is of the wrong type`);
    }

    const valueOfferIds = [...solutions.ids, ...data.ids, params.storage];
    const offers = await fetchOffers({
        backendUrl: params.backendUrl,
        accessToken: params.accessToken,
        limit: valueOfferIds.length,
        ids: valueOfferIds,
    }).then(({ list }) => <FethchedOffer[]>list
        .map((item) => {
            if (item.node) {
                return {
                    ...item.node.offerInfo,
                    id: item.node.id,
                }
            }
            return undefined;
        })
        .filter(item => Boolean(item))
    );

    const offersMap = new Map<string, FethchedOffer>(offers.map((o) => [o.id, o]));

    checkFetchedOffers([params.storage], offersMap, OfferType.Storage);
    checkFetchedOffers(solutions.ids, offersMap, OfferType.Solution);
    checkFetchedOffers(data.ids, offersMap, OfferType.Data);

    const restrictionOffersMap = new Map<string, Offer>(
        offers.flatMap(({ restrictions }) => restrictions?.offers || []).map((id) => [id, new Offer(id)])
    );

    Printer.print("Validating workflow configuration");
    await Promise.all(
        [...solutions.ids, ...data.ids].map(async (offerId) => {
            const offerToCheck = offers.find((o) => o.id === offerId);
            const restrictions =
                <Offer[]>(offerToCheck?.restrictions?.offers || []).map((o) => restrictionOffersMap.get(o)).filter(Boolean) ?? [];
            return validateOfferWorkflowService({
                offerId,
                restrictions,
                tee: params.tee,
                solutions: solutions.ids,
                data: data.ids,
                solutionArgs: solutions.resourceFiles,
                dataArgs: data.resourceFiles,
            });
        })
    );

    let { hashes, linkage } = await TIIGenerator.getSolutionHashesAndLinkage(solutions.ids.concat(data.ids));

    [...solutions.resourceFiles, ...data.resourceFiles].forEach((resource) => {
        if (resource.hash) hashes.push(resource.hash);

        if (!linkage && resource.linkage) {
            linkage = JSON.stringify(resource.linkage);
        }
    });

    Printer.print("Generating input arguments for TEE");
    const [solutionTIIs, dataTIIs] = await Promise.all([
        Promise.all(
            solutions.resourceFiles.map((solution) =>
                TIIGenerator.generateByOffer(
                    params.tee,
                    hashes,
                    linkage,
                    solution.resource,
                    solution.args,
                    solution.encryption!
                )
            )
        ),
        await Promise.all(
            data.resourceFiles.map((data) =>
                TIIGenerator.generateByOffer(params.tee, hashes, linkage, data.resource, data.args, data.encryption!)
            )
        ),
    ]);

    Printer.print("Calculating payment deposit");
    let holdDeposit = await calcWorkflowDepositService({
        tee: params.tee,
        storage: params.storage,
        solutions: solutions.ids,
        data: data.ids,
    });

    if (params.userDepositAmount) {
        const userDeposit = etherToWei(params.userDepositAmount);
        if (userDeposit.lt(holdDeposit)) {
            Printer.error(
                `Provided deposit is less than the minimum required deposit of (${weiToEther(holdDeposit)} TEE)`
            );
            return;
        }
        holdDeposit = userDeposit;

        const balance = await getTeeBalance({ address: consumerAddress! });
        if (balance.lt(holdDeposit)) {
            Printer.error(
                `Balance of your account (${weiToEther(
                    balance
                )} TEE) is less than the workflow payment deposit (${weiToEther(holdDeposit)} TEE)`
            );
            return;
        }
    }

    Printer.print(`Total deposit is ${weiToEther(holdDeposit.mul(params.workflowNumber))} TEE tokens`);

    let workflowPromises = new Array(params.workflowNumber);

    const allowance = await SuperproToken.allowance(consumerAddress!, OrdersFactory.address);
    if (holdDeposit.gt(allowance)) {
        Printer.print("Approving TEE tokens");
        try {
            await SuperproToken.approve(
                OrdersFactory.address,
                etherToWei(BigNumber.from(1e10).toString()).toString(),
                { from: consumerAddress! },
            );
        } catch (error: any) {
            if (error.message?.includes(TX_REVERTED_BY_EVM_ERROR)) throw ErrorTxRevertedByEvm(error);
            else throw error;
        }
    }

    Printer.print(`Creating workflow${params.workflowNumber > 1 ? 's' : ''}`);

    for (let pos = 0; pos < params.workflowNumber; pos++) {
        workflowPromises[pos] = new Promise(async (resolve, reject) => {
            try {
                resolve(
                    await createWorkflowService({
                        teeOffer: params.tee,
                        storageOffer: params.storage,
                        inputOffers: solutions.ids.concat(data.ids),
                        argsToEncrypt: JSON.stringify({
                            data: dataTIIs,
                            solution: solutionTIIs,
                        }),
                        resultPublicKey: resultEncryption,
                        holdDeposit: holdDeposit.toString(),
                        consumerAddress: consumerAddress!,
                    })
                );
            } catch (error) {
                Printer.error(`Error creating workflow ${error}`);
                resolve(null);
            }
        });
    }

    const results = await Promise.all(workflowPromises);
    const id = JSON.stringify(results);

    Printer.print(`Workflow was created, TEE order id: ${id}`);

    return id;
};

export default workflowCreate;

const checkFetchedOffers = (ids: string[], offers: Map<string, FethchedOffer>, type: OfferType) => {
    ids.forEach((id) => {
        const fetchedOffer = offers.get(id);

        if (!fetchedOffer) {
            throw new Error(`Offer ${id} does not exist`);
            // TODO: move prettifying of offers from fetching to separate service and remove getObjectKey here
        } else if (fetchedOffer.offerType !== getObjectKey(type, OfferType)) {
            throw new Error(`Offer ${id} has wrong type ${fetchedOffer.offerType} instead of ${getObjectKey(type, OfferType)}`);
        }
    });
};

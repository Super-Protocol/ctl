import {
    Config as BlockchainConfig,
    TIIGenerator,
    SuperproToken,
    Orders,
    OrderStatus,
    Offer,
    OfferType,
    OfferInfo,
} from "@super-protocol/sdk-js";
import Printer from "../printer";
import initBlockchainConnectorService from "../services/initBlockchainConnector";
import validateOfferWorkflowService from "../services/validateOfferWorkflow";
import { CryptoAlgorithm, Encoding, Encryption } from "@super-protocol/dto-js";
import createWorkflowService, { TeeOfferParams } from "../services/createWorkflow";
import parseInputResourcesService from "../services/parseInputResources";
import calcWorkflowDepositService from "../services/calcWorkflowDeposit";
import getTeeBalance from "../services/getTeeBalance";
import { ErrorTxRevertedByEvm, etherToWei, getObjectKey, weiToEther } from "../utils";
import getPublicFromPrivate from "../services/getPublicFromPrivate";
import fetchOrdersCountService from "../services/fetchOrdersCount";
import { TOfferType } from "../gql";
import fetchOffers from "../services/fetchOffers";
import fetchTeeOffers from "../services/fetchTeeOffers";
import { BigNumber } from "ethers";
import { ValueOfferSlot } from "@super-protocol/sdk-js/build/types/ValueOfferSlot";
import { Web3TransactionRevertedByEvmError } from "@super-protocol/sdk-js/build/utils/TxManager";

export type WorkflowCreateParams = {
    backendUrl: string;
    accessToken: string;
    blockchainConfig: BlockchainConfig;
    actionAccountKey: string;

    tee: string;
    teeSlotCount: string;
    teeOptionsIds: string[];
    teeOptionsCount: string[];

    storage: string;
    solution: string[];
    data: string[];
    resultEncryption: Encryption;
    userDepositAmount: string;
    workflowNumber: number;
    ordersLimit: number;
};

type FethchedOffer =  { id: string; offerInfo: Partial<OfferInfo>, slots: Partial<ValueOfferSlot>[] };

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
    const tee = await parseInputResourcesService({
        options: [params.tee],
    })
    .then(({ offers }) => offers[0]);

    const storage = await parseInputResourcesService({
        options: [params.storage],
    })
    .then(({ offers }) => offers[0]);

    const solutions = await parseInputResourcesService({
        options: params.solution,
    });
    const solutionIds = solutions.offers.map((offer) => offer.id);

    const data = await parseInputResourcesService({
        options: params.data,
    });
    const dataIds = data.offers.map((offer) => offer.id);

    const fetchedTeeOffer = await fetchTeeOffers({
        backendUrl: params.backendUrl,
        accessToken: params.accessToken,
        limit: 1,
        id: tee.id,
    }).then(({ list }) => list[0]);

    if (!fetchedTeeOffer) {
        throw new Error(`TEE offer ${tee.id} does not exist or is of the wrong type`);
    }

    const offerSlots = fetchedTeeOffer.node?.slots.map((slot) => slot.id);
    if (!offerSlots?.includes(tee.slotId)) {
        throw new Error(`Offer ${tee.id} doesn't have slot ${tee.slotId}, please use slot from this list: ${offerSlots}`);
    }

    const valueOfferIds = [...solutionIds, ...dataIds, storage.id];

    const fetchedValueOffers = await fetchOffers({
        backendUrl: params.backendUrl,
        accessToken: params.accessToken,
        limit: valueOfferIds.length,
        ids: valueOfferIds,
    }).then(({ list }) => <FethchedOffer[]>list
        .filter(item => Boolean(item.node))
        .map((item) => ({
            offerInfo: item.node?.offerInfo || {},
            slots: item.node?.slots || [],
            id: item.node?.id,
        }))
    );

    const offersMap = new Map<string, FethchedOffer>(fetchedValueOffers.map((o) => [o.id, o]));

    checkFetchedOffers([storage.id], offersMap, OfferType.Storage);
    checkFetchedOffers(solutionIds, offersMap, OfferType.Solution);
    checkFetchedOffers(dataIds, offersMap, OfferType.Data);

    const restrictionOffersMap = new Map<string, Offer>(
        fetchedValueOffers.flatMap(({ offerInfo }) => offerInfo.restrictions?.offers || []).map((id) => [id, new Offer(id)])
    );

    Printer.print("Validating workflow configuration");
    await Promise.all(
        [...solutionIds, ...dataIds].map(async (offerId) => {
            const offerToCheck = fetchedValueOffers.find((o) => o.id === offerId);
            const restrictions =
                <Offer[]>(offerToCheck?.offerInfo?.restrictions?.offers || []).map((o) => restrictionOffersMap.get(o)).filter(Boolean) ?? [];
            return validateOfferWorkflowService({
                offerId,
                restrictions,
                tee: tee.id,
                solutions: solutionIds,
                data: dataIds,
                solutionArgs: solutions.resourceFiles,
                dataArgs: data.resourceFiles,
            });
        })
    );

    let { hashes, linkage } = await TIIGenerator.getSolutionHashesAndLinkage(solutionIds.concat(dataIds));

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
                    tee.id,
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
                TIIGenerator.generateByOffer(tee.id, hashes, linkage, data.resource, data.args, data.encryption!)
            )
        ),
    ]);

    if (solutions.tiis.length) {
        solutionTIIs.push(...solutions.tiis);
    }
    if (data.tiis.length) {
        dataTIIs.push(...data.tiis);
    }

    Printer.print("Calculating payment deposit");

    const teeOfferParams: TeeOfferParams = {
        id: tee.id,
        slotId: tee.slotId,
        slotCount: params.teeSlotCount,
        optionsIds: params.teeOptionsIds,
        optionsCount: params.teeOptionsCount
    };

    let holdDeposit = await calcWorkflowDepositService({
        tee: teeOfferParams,
        storage: storage,
        solutions: solutions.offers,
        data: data.offers,
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

    const allowance = await SuperproToken.allowance(consumerAddress!, Orders.address);
    if (holdDeposit.gt(allowance)) {
        Printer.print("Approving TEE tokens");
        try {
            await SuperproToken.approve(
                Orders.address,
                etherToWei(BigNumber.from(1e10).toString()).toString(),
                { from: consumerAddress! },
            );
        } catch (error: any) {
            if (error instanceof Web3TransactionRevertedByEvmError) throw ErrorTxRevertedByEvm(error);
            else throw error;
        }
    }

    const inputOffersParams = [...solutions.offers, ...data.offers];

    Printer.print(`Creating workflow${params.workflowNumber > 1 ? 's' : ''}`);

    for (let pos = 0; pos < params.workflowNumber; pos++) {
        workflowPromises[pos] = new Promise(async (resolve) => {
            try {
                resolve(
                    await createWorkflowService({
                        teeOffer: teeOfferParams,
                        storageOffer: storage,
                        inputOffers: inputOffersParams,
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
        } else if (fetchedOffer.offerInfo.offerType !== type) {
            throw new Error(`Offer ${id} has wrong type ${getObjectKey(fetchedOffer.offerInfo.offerType, OfferType)} instead of ${getObjectKey(type, OfferType)}`);
        }
    });
};

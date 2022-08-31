import { Config as BlockchainConfig, TIIGenerator, SuperproToken, OrdersFactory } from "@super-protocol/sdk-js";
import Printer from "../printer";
import initBlockchainConnectorService from "../services/initBlockchainConnector";
import validateOfferWorkflowService from "../services/validateOfferWorkflow";
import { CryptoAlgorithm, Encryption } from "@super-protocol/dto-js";
import createWorkflowService from "../services/createWorkflow";
import parseInputResourcesService from "../services/parseInputResources";
import calcWorkflowDepositService from "../services/calcWorkflowDeposit";
import { Wallet } from "ethers";
import getTeeBalance from "../services/getTeeBalance";
import { etherToWei, weiToEther } from "../utils";
import getPublicFromPrivate from "../services/getPublicFromPrivate";

export type WorkflowCreateParams = {
    blockchainConfig: BlockchainConfig;
    actionAccountKey: string;
    tee: string;
    storage: string;
    solutions: string[];
    data: string[];
    resultEncryption: Encryption;
    resultDecryptionKey: string;
    userDepositAmount: string;
    createWorkflows: number;
};

const workflowCreate = async (params: WorkflowCreateParams) => {
    if (params.resultEncryption.algo !== CryptoAlgorithm.ECIES)
        throw Error("TEE order supports ECIES result encryption only");

    const resultEncryption: Encryption = {
        ...params.resultEncryption,
        key: getPublicFromPrivate(params.resultDecryptionKey),
    };

    const solutions = await parseInputResourcesService({
        options: params.solutions,
        optionsName: "solution",
    });
    const data = await parseInputResourcesService({
        options: params.data,
        optionsName: "data",
    });

    Printer.print("Connecting to blockchain...");
    const consumerAddress = await initBlockchainConnectorService({
        blockchainConfig: params.blockchainConfig,
        actionAccountKey: params.actionAccountKey,
    });

    Printer.print("Connected successfully, validating workflow configuration...");
    await Promise.all(
        [...solutions.ids, ...data.ids].map((solutionId) =>
            validateOfferWorkflowService({
                offerId: solutionId,
                tee: params.tee,
                solutions: solutions.ids,
                data: data.ids,
                solutionArgs: solutions.resourceFiles,
                dataArgs: data.resourceFiles,
            })
        )
    );

    let { hashes, linkage } = await TIIGenerator.getSolutionHashesAndLinkage(solutions.ids.concat(data.ids));

    [...solutions.resourceFiles, ...data.resourceFiles].forEach((resource) => {
        if (resource.hash) hashes.push(resource.hash);

        if (!linkage && resource.linkage) {
            linkage = JSON.stringify(resource.linkage);
        }
    });

    Printer.print("Workflow configuration is valid, generating input arguments for TEE...");
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

    Printer.print("Input arguments have been generated, checking hold deposit...");
    let holdDeposit = await calcWorkflowDepositService({
        tee: params.tee,
        storage: params.storage,
        solutions: solutions.ids,
        data: data.ids,
    });

    if (params.userDepositAmount) {
        const userDeposit = etherToWei(params.userDepositAmount);
        if (userDeposit.lt(holdDeposit)) {
            Printer.error(`Provided deposit less than minimal required deposit (${weiToEther(holdDeposit)} TEE)`);
            return;
        }
        holdDeposit = userDeposit;

        const balance = await getTeeBalance({ address: new Wallet(params.actionAccountKey).address });
        if (balance.lt(holdDeposit)) {
            Printer.error(
                `Balance of TEE tokens on your account (${weiToEther(
                    balance
                )} TEE) less then workflow hold deposit (${weiToEther(holdDeposit)} TEE)`
            );
            return;
        }
    }

    Printer.print(
        `Hold deposit has been checked, creating workflow orders with ${weiToEther(holdDeposit)} TEE of deposit ...`
    );

    let workflowPromises = new Array(params.createWorkflows);

    Printer.print("Approve tokens for all workflows");
    await SuperproToken.approve(OrdersFactory.address, holdDeposit.mul(params.createWorkflows).toString(), {
        from: consumerAddress!,
    });

    Printer.print("Create workflows");
    for (let pos = 0; pos < params.createWorkflows; pos++) {
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

    Printer.print(`Workflows has been created successfully, root TEE order ids: ${JSON.stringify(results)}`);
};

export default workflowCreate;

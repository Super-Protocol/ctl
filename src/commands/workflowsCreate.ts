import { Config as BlockchainConfig, TIIGenerator } from "@super-protocol/sdk-js";
import Printer from "../printer";
import initBlockchainConnectorService from "../services/initBlockchainConnector";
import validateOfferWorkflowService from "../services/validateOfferWorkflow";
import { Encryption } from "@super-protocol/dto-js";
import createWorkflowService from "../services/createWorkflow";
import parseInputResourcesService from "../services/parseInputResources";
import calcWorkflowDepositService from "../services/calcWorkflowDeposit";
import { Wallet } from "ethers";
import getTeeBalance from "../services/getTeeBalance";
import { etherToWei, weiToEther } from "../utils";

export type WorkflowCreateParams = {
    blockchainConfig: BlockchainConfig;
    actionAccountKey: string;
    tee: string;
    storage: string;
    solutions: string[];
    data: string[];
    resultEncryption: Encryption;
    userDepositAmount: string;
};

const workflowCreate = async (params: WorkflowCreateParams) => {
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
            Printer.error(`Balance of TEE tokens on your account (${weiToEther(balance)} TEE) less then workflow hold deposit (${weiToEther(holdDeposit)} TEE)`);
            return;
        }
    }

    Printer.print(
        `Hold deposit has been checked, creating workflow orders with ${weiToEther(holdDeposit)} TEE of deposit ...`
    );
    const teeOrderId = await createWorkflowService({
        teeOffer: params.tee,
        storageOffer: params.storage,
        inputOffers: solutions.ids.concat(data.ids),
        argsToEncrypt: JSON.stringify({
            data: dataTIIs,
            solution: solutionTIIs,
        }),
        resultPublicKey: params.resultEncryption,
        holdDeposit: holdDeposit.toString(),
        consumerAddress: consumerAddress!,
    });

    Printer.print(`Workflow has been created successfully, root TEE order id: ${teeOrderId}`);
};

export default workflowCreate;

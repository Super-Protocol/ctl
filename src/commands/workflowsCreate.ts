import { Config as BlockchainConfig, TIIGenerator } from "@super-protocol/sdk-js";
import Printer from "../printer";
import initBlockchainConnectorService from "../services/initBlockchainConnector";
import validateOfferWorkflowService from "../services/validateOfferWorkflow";
import { Encryption } from "@super-protocol/dto-js";
import createWorkflowService from "../services/createWorkflow";
import parseInputResourcesService from "../services/parseInputResources";
import calcWorkflowDepositService from "../services/calcWorkflowDeposit";

export type WorkflowCreateParams = {
    blockchainConfig: BlockchainConfig;
    actionAccountKey: string;
    tee: string;
    storage: string;
    solutions: string[];
    data: string[];
    resultEncryption: Encryption;
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
        [...solutions.addresses, ...data.addresses].map((solutionsAddress) =>
            validateOfferWorkflowService({
                offerAddress: solutionsAddress,
                tee: params.tee,
                solutions: solutions.addresses,
                data: data.addresses,
                solutionArgs: solutions.resourceFiles,
                dataArgs: data.resourceFiles,
            })
        )
    );

    let { hashes, linkage } = await TIIGenerator.getSolutionHashesAndLinkage(
        solutions.addresses.concat(data.addresses)
    );

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

    Printer.print("Input arguments have been generated, calculating hold deposit...");
    const holdDeposit = await calcWorkflowDepositService({
        tee: params.tee,
        storage: params.storage,
        solutions: solutions.addresses,
        data: data.addresses,
    });

    Printer.print(
        `Hold deposit has been calculated, creating workflow orders with ${holdDeposit} tokens of deposit ...`
    );
    const teeOrderAddress = await createWorkflowService({
        teeOffer: params.tee,
        storageOffer: params.storage,
        inputOffers: solutions.addresses.concat(data.addresses),
        argsToEncrypt: JSON.stringify({
            data: dataTIIs,
            solution: solutionTIIs,
        }),
        resultPublicKey: params.resultEncryption,
        holdDeposit: holdDeposit.toString(),
        consumerAddress: consumerAddress!,
    });

    Printer.print(`Workflow has been created successfully, root TEE order id: ${teeOrderAddress}`);
};

export default workflowCreate;

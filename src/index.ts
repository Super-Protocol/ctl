import {HashAlgorithm} from "@super-protocol/sp-dto-js";

const packageJson = require("../package.json");

import { Command, Option } from "commander";
import fs from "fs";
import path from "path";

import ConfigLoader, { Config } from "./config";
import download from "./commands/filesDownload";
import upload from "./commands/filesUpload";
import filesDelete from "./commands/filesDelete";
import providersList from "./commands/providersList";
import providersGet from "./commands/providersGet";
import ordersList from "./commands/ordersList";
import ordersGet from "./commands/ordersGet";
import ordersCancel from "./commands/ordersCancel";
import ordersReplenishDeposit from "./commands/ordersReplenishDeposit";
import workflowsCreate from "./commands/workflowsCreate";
import Printer from "./printer";
import { collectOptions, commaSeparatedList, processSubCommands, validateFields } from "./utils";
import generateSolutionKey from "./commands/solutionsGenerateKey";
import prepareSolution from "./commands/solutionsPrepare";
import ordersDownloadResult from "./commands/ordersDownloadResult";
import tokensRequest from "./commands/tokensRequest";
import tokensBalance from "./commands/tokensBalance";
import offersListTee from "./commands/offersListTee";
import offersListValue from "./commands/offersListValue";

async function main() {
    const program = new Command();
    program.name(packageJson.name).description(packageJson.description).version(packageJson.version);

    const providersCommand = program.command("providers");
    const ordersCommand = program.command("orders");
    const workflowsCommand = program.command("workflows");
    const filesCommand = program.command("files");
    const solutionsCommand = program.command("solutions");
    const tokensCommand = program.command("tokens");
    const offersCommand = program.command("offers");
    const offersListCommand = offersCommand.command("list");

    const providersListFields = ["id", "name", "description", "authority_account", "action_account", "modified_date"],
        providersListDefaultFields = ["id", "name"];
    providersCommand
        .command("list")
        .description("Fetches list of providers")
        .addOption(
            new Option(
                "--fields <fields>",
                `Provider fields to fetch (available fields: ${providersListFields.join(", ")})`
            )
                .argParser(commaSeparatedList)
                .default(providersListDefaultFields, providersListDefaultFields.join(","))
        )
        .option("--limit <number>", "Limit of records", "10")
        .option("--cursor <cursorString>", "Cursor for pagination")
        .action(async (options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const backendAccess = configLoader.loadSection("backend") as Config["backend"];

            validateFields(options.fields, providersGetFields);

            await providersList({
                fields: options.fields,
                backendUrl: backendAccess.url,
                limit: +options.limit,
                cursor: options.cursor,
            });
        });

    const providersGetFields = ["id", "name", "description", "authority_account", "action_account", "modified_date"],
        providersGetDefaultFields = ["name", "description", "authority_account", "action_account"];
    providersCommand
        .command("get")
        .description("Fetch fields of provider with <id>")
        .argument("id", "ID to fetch the provider")
        .addOption(
            new Option(
                "--fields <fields>",
                `Provider fields to fetch (available fields: ${providersListFields.join(", ")})`
            )
                .argParser(commaSeparatedList)
                .default(providersGetDefaultFields, providersGetDefaultFields.join(","))
        )
        .action(async (id: string, options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const backendAccess = configLoader.loadSection("backend") as Config["backend"];

            validateFields(options.fields, providersGetFields);

            await providersGet({
                fields: options.fields,
                backendUrl: backendAccess.url,
                id,
            });
        });

    ordersCommand
        .command("cancel")
        .description("Cancel order with <id>")
        .argument("id", "Order id")
        .action(async (address: string, options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const blockchainAccess = configLoader.loadSection("blockchain") as Config["blockchain"];
            const blockchainKeys = configLoader.loadSection("blockchainKeys") as Config["blockchainKeys"];

            await ordersCancel({
                blockchainConfig: blockchainAccess,
                actionAccountKey: blockchainKeys.actionAccountKey,
                address,
            });
        });

    ordersCommand
        .command("replenish-deposit")
        .description("Replenish order deposit with <id> by <amount>")
        .argument("id", "Order id")
        .argument("amount", "Amount of tokens to replenish")
        .action(async (address: string, amount: string, options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const blockchainAccess = configLoader.loadSection("blockchain") as Config["blockchain"];
            const blockchainKeys = configLoader.loadSection("blockchainKeys") as Config["blockchainKeys"];

            await ordersReplenishDeposit({
                blockchainConfig: blockchainAccess,
                actionAccountKey: blockchainKeys.actionAccountKey,
                address,
                amount,
            });
        });

    workflowsCommand
        .command("create")
        .description("Creates workflow orders")
        .requiredOption("--tee <id>", "TEE offer id (required)")
        .requiredOption("--storage <id>", "Output storage offer id (required)")
        .requiredOption(
            "--solution <id> --solution <filepath>",
            "Solution offer id or resource file path (required, may be many)",
            collectOptions,
            []
        )
        .option(
            "--data <id> --data <filepath>",
            "Data offer id or resource file path (may be many)",
            collectOptions,
            []
        )
        .action(async (options: any) => {
            if (!options.solution.length) {
                Printer.error("error: required option '--solution <id> --solution <filepath>' not specified");
                return;
            }

            const configLoader = new ConfigLoader(options.config);
            const blockchainAccess = configLoader.loadSection("blockchain") as Config["blockchain"];
            const blockchainKeys = configLoader.loadSection("blockchainKeys") as Config["blockchainKeys"];
            const workflowConfig = configLoader.loadSection("workflow") as Config["workflow"];

            await workflowsCreate({
                blockchainConfig: blockchainAccess,
                actionAccountKey: blockchainKeys.actionAccountKey,
                tee: options.tee,
                storage: options.storage,
                solutions: options.solution,
                data: options.data,
                resultEncryption: workflowConfig.resultEncryption,
            });
        });

    const ordersListFields = [
            "id",
            "offer_name",
            "offer_description",
            "type",
            "status",
            "offer_id",
            "consumer_address",
            "parent_order_id",
            "total_deposit",
            "unspent_deposit",
            "cancelebel",
            "sub_orders_count",
            "modified_date",
        ],
        ordersListDefaultFields = ["id", "offer_name", "status"];
    ordersCommand
        .command("list")
        .description("Fetches list of orders")
        .addOption(
            new Option("--fields <fields>", `Orders fields to fetch (available fields: ${ordersListFields.join(", ")})`)
                .argParser(commaSeparatedList)
                .default(ordersListDefaultFields, ordersListDefaultFields.join(","))
        )
        .option("--limit <number>", "Limit of records", "10")
        .option("--cursor <cursorString>", "Cursor for pagination")
        .action(async (options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const backendAccess = configLoader.loadSection("backend") as Config["backend"];

            validateFields(options.fields, ordersListFields);

            await ordersList({
                fields: options.fields,
                backendUrl: backendAccess.url,
                limit: +options.limit,
                cursor: options.cursor,
            });
        });

    const ordersGetFields = [
            "id",
            "offer_name",
            "offer_description",
            "type",
            "status",
            "offer_id",
            "consumer_address",
            "parent_order_id",
            "total_deposit",
            "unspent_deposit",
            "cancelebel",
            "modified_date",
        ],
        ordersGetDefaultFields = [
            "offer_name",
            "offer_description",
            "type",
            "status",
            "total_deposit",
            "unspent_deposit",
            "modified_date",
        ],
        subOrdersGetFields = [
            "id",
            "offer_name",
            "offer_description",
            "type",
            "status",
            "cancelebel",
            "actual_cost",
            "modified_date",
        ],
        subOrdersGetDefaultFields = ["id", "offer_name", "offer_description", "type", "status", "modified_date"];
    ordersCommand
        .command("get")
        .description("Fetch fields of order with <id>")
        .argument("id", "ID to fetch the order")
        .addOption(
            new Option("--fields <fields>", `Orders fields to fetch (available fields: ${ordersGetFields.join(", ")})`)
                .argParser(commaSeparatedList)
                .default(ordersGetDefaultFields, ordersGetDefaultFields.join(","))
        )
        .option("--suborders", "Show suborders", false)
        .addOption(
            new Option(
                "--suborders_fields <fields>",
                `Sub orders fields to fetch (available fields: ${subOrdersGetFields.join(", ")})`
            )
                .argParser(commaSeparatedList)
                .default(subOrdersGetDefaultFields, subOrdersGetDefaultFields.join(","))
        )
        .action(async (id: string, options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const backendAccess = configLoader.loadSection("backend") as Config["backend"];

            validateFields(options.fields, ordersGetFields);
            if (options.suborders) validateFields(options.suborders_fields, subOrdersGetFields);

            await ordersGet({
                fields: options.fields,
                subOrdersFields: options.suborders ? options.suborders_fields : [],
                backendUrl: backendAccess.url,
                id,
            });
        });

    ordersCommand
        .command("download-result")
        .description("Downloading result of order with <id>")
        .argument("id", "ID of order to fetch result")
        .option("--save-to <path>", "Path to save decrypted result", "./result.gz")
        .action(async (orderId: string, options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const blockchainAccess = configLoader.loadSection("blockchain") as Config["blockchain"];
            const orderResultConfig = configLoader.loadSection("orderResult") as Config["orderResult"];

            await ordersDownloadResult({
                blockchainConfig: blockchainAccess,
                orderId,
                localPath: options.saveTo,
                resultDecryptionKey: orderResultConfig.resultDecryptionKey,
            });
        });

    tokensCommand
        .command("request")
        .description("Request tokens to action account")
        .option("--matic", "Request Polygon Mumbai MATIC tokens", false)
        .option("--tee", "Request SuperProtocol TEE tokens", false)
        .action(async (options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const blockchainKeysConfig = configLoader.loadSection("blockchainKeys") as Config["blockchainKeys"];
            const backendConfig = configLoader.loadSection("backend") as Config["backend"];

            await tokensRequest({
                backendUrl: backendConfig.url,
                actionAccountPrivateKey: blockchainKeysConfig.actionAccountKey,
                requestMatic: options.matic,
                requestTee: options.tee,
            });
        });

    tokensCommand
        .command("balance")
        .description("Fetch token balance for action account")
        .action(async (options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const blockchainKeysConfig = configLoader.loadSection("blockchainKeys") as Config["blockchainKeys"];
            const blockchainConfig = configLoader.loadSection("blockchain") as Config["blockchain"];

            await tokensBalance({
                blockchainConfig,
                actionAccountPrivateKey: blockchainKeysConfig.actionAccountKey,
            });
        });

    const offersListTeeFields = [
            "id",
            "name",
            "description",
            "provider_id",
            "provider_name",
            "total_cores",
            "free_cores",
            "orders_in_queue",
            "cancelebel",
            "modified_date",
        ],
        offersListTeeDefaultFields = ["id", "name"];
    offersListCommand
        .command("tee")
        .description("Fetches list of offers")
        .addOption(
            new Option(
                "--fields <fields>",
                `Orders fields to fetch (available fields: ${offersListTeeFields.join(", ")})`
            )
                .argParser(commaSeparatedList)
                .default(offersListTeeDefaultFields, offersListTeeDefaultFields.join(","))
        )
        .option("--limit <number>", "Limit of records", "10")
        .option("--cursor <cursorString>", "Cursor for pagination")
        .action(async (options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const backendAccess = configLoader.loadSection("backend") as Config["backend"];

            validateFields(options.fields, offersListTeeFields);

            await offersListTee({
                fields: options.fields,
                backendUrl: backendAccess.url,
                limit: +options.limit,
                cursor: options.cursor,
            });
        });

    const offersListValueFields = [
            "id",
            "name",
            "description",
            "type",
            "provider_id",
            "provider_name",
            "hold_sum",
            "cancelebel",
            "modified_date",
        ],
        offersListValueDefaultFields = ["id", "name", "type"];
    offersListCommand
        .command("value")
        .description("Fetches list of offers")
        .addOption(
            new Option(
                "--fields <fields>",
                `Orders fields to fetch (available fields: ${offersListValueFields.join(", ")})`
            )
                .argParser(commaSeparatedList)
                .default(offersListValueDefaultFields, offersListValueDefaultFields.join(","))
        )
        .option("--limit <number>", "Limit of records", "10")
        .option("--cursor <cursorString>", "Cursor for pagination")
        .action(async (options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const backendAccess = configLoader.loadSection("backend") as Config["backend"];

            validateFields(options.fields, offersListValueFields);

            await offersListValue({
                fields: options.fields,
                backendUrl: backendAccess.url,
                limit: +options.limit,
                cursor: options.cursor,
            });
        });

    filesCommand
        .command("upload")
        .description("Uploads a file or a directory specified by the <localPath> argument to the remote storage")
        .argument("localPath", "Path to a file or folder for uploading")
        .option(
            "--output <path>",
            "Path to save output resource file (download credentials, encryption and metadata)",
            "./resource.json"
        )
        .option("--metadata <path>", "Path to a metadata file for adding fields to output resource")
        .action(async (localPath: string, options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const storageConfig = configLoader.loadSection("storage") as Config["storage"];

            await upload({
                localPath,
                storageType: storageConfig.storageType,
                writeCredentials: storageConfig.writeCredentials,
                readCredentials: storageConfig.readCredentials,
                outputPath: options.output,
                metadataPath: options.metadata,
            });
        });

    filesCommand
        .command("download")
        .description(
            "Downloads and decrypts file from remote storage using resource in <resourcePath> to the <localPath>"
        )
        .argument("resourcePath", "A path to resource file (generated by upload command)")
        .argument("localPath", "Path to a file to save")
        .action(async (resourcePath: string, localPath: string) => {
            await download({
                resourcePath,
                localPath,
            });
        });

    filesCommand
        .command("delete")
        .description("Deletes file in remote storage using resource in <resourcePath>")
        .argument("resourcePath", "A path to resource file (generated by upload command)")
        .action(async (resourcePath: string) => {
            await filesDelete({
                resourcePath,
            });
        });

    solutionsCommand
        .command("generate-key")
        .description("Generates a solution key to the <outputPath>")
        .argument("outputPath", "Path to a solution key file for saving")
        .action(async (outputPath: string, options: any) => {
            await generateSolutionKey({ outputPath });
        });

    solutionsCommand
        .command("prepare")
        .description("Prepares a solution in <solutionPath>, signs it with <solutionKeyPath>")
        .argument("solutionPath", "Path to a file for uploading")
        .argument("solutionKeyPath", "Path to a solution key")
        .option("--metadata <pathToSave>", "Path to save metadata (hash and MrEnclave)", "./metadata.json")
        .option("--pack-solution <packSolution>", "Pack solution folder into tar gz", "")
        .option("--base-image-path <pathToContainerImage>", "A container image file", "")
        .option("--base-image-resource <containerImageResource>", "A container image resource name", "")
        .option("--write-default-manifest", "Write a default manifest for solutions with empty sgxMrEnclave", false)
        .option("--hash-algo <solutionHashAlgo>", "Hash calculation algorithm for solution", HashAlgorithm.SHA256)
        .option("--sgx-thread-num <threadNum>", "A number of enclave threads", "")
        .option("--sgx-enclave-size <enclaveSize>", "Entire enclave size (#M or #G), must be some value to the power of 2", "")
        .option("--sgx-loader-internal-size <internalSize>", "Size of the internal enclave structs (#M or #G)", "")
        .option("--sgx-stack-size <stackSize>", "Size of the enclave thread stack (#K, #M or #G)", "")
        .action(async (solutionPath: string, solutionKeyPath: string, options: any) => {
            await prepareSolution({
                metadataPath: options.metadata,
                solutionHashAlgo: options.hashAlgo,
                solutionPath,
                solutionOutputPath: options.packSolution,
                keyPath: solutionKeyPath,
                baseImagePath: options.baseImagePath,
                baseImageResource: options.baseImageResource,
                loaderPalInternalMemSize: options.sgxLoaderInternalSize,
                sgxEnclaveSize: options.sgxEnclaveSize,
                sgxThreadNum: options.sgxThreadNum,
                sysStackSize: options.sgxStackSize,
                writeDefaultManifest: options.writeDefaultManifest,
            });
        });

    // Add global options
    processSubCommands(program, (command) => {
        command.option("--config <configPath>", "Path to configuration file", "./config.json");
    });

    await program.parseAsync(process.argv);
}

main()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        const isSilent = error.isSilent;
        const message = error.message;

        if (isSilent || error.hasCustomMessage) error = error.error;
        if (!isSilent) Printer.error("Error occured during execution");

        const errorLogPath = path.join(process.cwd(), "error.log");
        const errorDetails = JSON.stringify(error, null, 2);
        fs.writeFileSync(
            errorLogPath,
            `${error.stack}\n\n` + (errorDetails != "{}" ? `Details:\n ${errorDetails}\n` : "")
        );

        if (!isSilent) {
            Printer.error(`Error log was written to ${errorLogPath}`);
            if (message) Printer.error(message);
            process.exit(1);
        } else {
            process.exit(0);
        }
    });

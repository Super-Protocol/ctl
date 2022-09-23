import { HashAlgorithm } from "@super-protocol/dto-js";
import { OfferType } from "@super-protocol/sdk-js";

const packageJson = require("../package.json");

import { Command, Option } from "commander";
import fs from "fs";
import path from "path";
import eccrypto from "eccrypto";

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
import offersDownloadContent from "./commands/offersDownloadContent";
import ordersWithdrawDeposit from "./commands/ordersWithdrawDeposit";
import { MAX_ORDERS_RUNNING } from "./constants";
import offersGet from "./commands/offersGet";

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
    const offersGetCommand = offersCommand.command("get");

    const providersListFields = [
            "address",
            "name",
            "description",
            "authority_account",
            "action_account",
            "modified_date",
        ],
        providersListDefaultFields = ["address", "name"];
    providersCommand
        .command("list")
        .description("List providers")
        .addOption(
            new Option("--fields <fields>", `Available fields: ${providersListFields.join(", ")}`)
                .argParser(commaSeparatedList)
                .default(providersListDefaultFields, providersListDefaultFields.join(","))
        )
        .option("--limit <number>", "Number of records to display", "10")
        .option("--cursor <cursorString>", "Cursor for pagination")
        .action(async (options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const backendAccess = configLoader.loadSection("backend") as Config["backend"];
            const accessToken = configLoader.loadSection("accessToken") as Config["accessToken"];

            validateFields(options.fields, providersGetFields);

            await providersList({
                fields: options.fields,
                backendUrl: backendAccess.url,
                accessToken,
                limit: +options.limit,
                cursor: options.cursor,
            });
        });

    const providersGetFields = [
            "address",
            "name",
            "description",
            "authority_account",
            "action_account",
            "modified_date",
        ],
        providersGetDefaultFields = ["name", "description", "authority_account", "action_account"];
    providersCommand
        .command("get")
        .description("Display detailed information on provider with <address>")
        .argument("address", "Provider address")
        .addOption(
            new Option("--fields <fields>", `Available fields: ${providersListFields.join(", ")}`)
                .argParser(commaSeparatedList)
                .default(providersGetDefaultFields, providersGetDefaultFields.join(","))
        )
        .action(async (address: string, options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const backendAccess = configLoader.loadSection("backend") as Config["backend"];
            const accessToken = configLoader.loadSection("accessToken") as Config["accessToken"];

            validateFields(options.fields, providersGetFields);

            await providersGet({
                fields: options.fields,
                backendUrl: backendAccess.url,
                accessToken,
                address,
            });
        });

    ordersCommand
        .command("cancel")
        .description("Cancel order with <id>")
        .argument("id", "Order <id>")
        .action(async (id: string, options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const blockchainAccess = configLoader.loadSection("blockchain") as Config["blockchain"];
            const blockchainKeys = configLoader.loadSection("blockchainKeys") as Config["blockchainKeys"];

            await ordersCancel({
                blockchainConfig: blockchainAccess,
                actionAccountKey: blockchainKeys.actionAccountKey,
                id,
            });
        });

    ordersCommand
        .command("replenish-deposit")
        .description("Replenish order deposit with <id> by <amount>")
        .argument("id", "Order <id>")
        .argument("amount", "Amount of tokens")
        .action(async (id: string, amount: string, options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const blockchainAccess = configLoader.loadSection("blockchain") as Config["blockchain"];
            const blockchainKeys = configLoader.loadSection("blockchainKeys") as Config["blockchainKeys"];

            await ordersReplenishDeposit({
                blockchainConfig: blockchainAccess,
                actionAccountKey: blockchainKeys.actionAccountKey,
                id,
                amount,
            });
        });

    workflowsCommand
        .command("generate-key")
        .description("Generate private key to encrypt order results")
        .action(() => {
            Printer.print(eccrypto.generatePrivate().toString("base64"));
        });

    workflowsCommand
        .command("create")
        .description("Create new orders")
        .requiredOption("--tee <id>", "TEE offer <id> (required)")
        .requiredOption("--storage <id>", "Storage offer <id> (required)")
        .requiredOption(
            "--solution <id> --solution <filepath>",
            "Solution offer <id> or resource file path (required and accepts multiple values)",
            collectOptions,
            []
        )
        .option(
            "--data <id> --data <filepath>",
            "Data offer <id> or resource file path (accepts multiple values)",
            collectOptions,
            []
        )
        .option(
            "--deposit <TEE>",
            "Amount of the payment deposit in TEE tokens (if not specified, the minimum deposit required is used)"
        )
        .addOption(new Option("--workflow-number <number>", "Number of workflows to create").default(1).hideHelp())
        .addOption(
            new Option("--orders-limit <number>", "Override default orders limit per user")
                .default(MAX_ORDERS_RUNNING)
                .hideHelp()
        )
        .action(async (options: any) => {
            if (!options.solution.length) {
                Printer.error("error: required option '--solution <id> --solution <filepath>' not specified");
                return;
            }

            const configLoader = new ConfigLoader(options.config);
            const backendAccess = configLoader.loadSection("backend") as Config["backend"];
            const accessToken = configLoader.loadSection("accessToken") as Config["accessToken"];
            const blockchainAccess = configLoader.loadSection("blockchain") as Config["blockchain"];
            const blockchainKeys = configLoader.loadSection("blockchainKeys") as Config["blockchainKeys"];
            const workflowConfig = configLoader.loadSection("workflow") as Config["workflow"];

            await workflowsCreate({
                backendUrl: backendAccess.url,
                accessToken,
                blockchainConfig: blockchainAccess,
                actionAccountKey: blockchainKeys.actionAccountKey,
                tee: options.tee,
                storage: options.storage,
                solutions: options.solution,
                data: options.data,
                resultEncryption: workflowConfig.resultEncryption,
                userDepositAmount: options.deposit,
                workflowNumber: Number(options.workflowNumber),
                ordersLimit: Number(options.ordersLimit),
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
            "total_unspent_deposit",
            "deposit",
            "unspent_deposit",
            "cancelable",
            "sub_orders_count",
            "modified_date",
        ],
        ordersListDefaultFields = ["id", "offer_name", "status"],
        ordersListOfferTypes = {
            tee: OfferType.TeeOffer,
            storage: OfferType.Storage,
            solution: OfferType.Solution,
            data: OfferType.Data,
        };
    ordersCommand
        .command("list")
        .description("List orders")
        .addOption(
            new Option("--fields <fields>", `Available fields: ${ordersListFields.join(", ")}`)
                .argParser(commaSeparatedList)
                .default(ordersListDefaultFields, ordersListDefaultFields.join(","))
        )
        .option(
            "--my-account",
            "Only show orders that were created by the action account specified in the config file",
            false
        )
        .addOption(
            new Option("--type <type>", "Only show orders of the specified type")
                .choices(Object.keys(ordersListOfferTypes))
        )
        .option("--limit <number>", "Number of records to display", "10")
        .option("--cursor <cursorString>", "Cursor for pagination")
        .action(async (options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const backendAccess = configLoader.loadSection("backend") as Config["backend"];
            const accessToken = configLoader.loadSection("accessToken") as Config["accessToken"];

            let actionAccountKey;
            if (options.myAccount) {
                actionAccountKey = (configLoader.loadSection("blockchainKeys") as Config["blockchainKeys"])
                    .actionAccountKey;
            }

            validateFields(options.fields, ordersListFields);

            await ordersList({
                fields: options.fields,
                backendUrl: backendAccess.url,
                accessToken,
                limit: +options.limit,
                cursor: options.cursor,
                actionAccountKey,
                offerType: ordersListOfferTypes[options.type as keyof typeof ordersListOfferTypes],
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
            "total_unspent_deposit",
            "deposit",
            "unspent_deposit",
            "cancelable",
            "modified_date",
        ],
        ordersGetDefaultFields = [
            "offer_name",
            "offer_description",
            "type",
            "status",
            "total_deposit",
            "total_unspent_deposit",
            "modified_date",
        ],
        subOrdersGetFields = [
            "id",
            "offer_name",
            "offer_description",
            "type",
            "status",
            "cancelable",
            "actual_cost",
            "modified_date",
        ],
        subOrdersGetDefaultFields = ["id", "offer_name", "offer_description", "type", "status", "modified_date"];
    ordersCommand
        .command("get")
        .description("Display detailed information on order with <id>")
        .argument("id", "Order <id>")
        .addOption(
            new Option("--fields <fields>", `Available fields: ${ordersGetFields.join(", ")}`)
                .argParser(commaSeparatedList)
                .default(ordersGetDefaultFields, ordersGetDefaultFields.join(","))
        )
        .option("--suborders", "Show sub-orders", false)
        .addOption(
            new Option("--suborders_fields <fields>", `Sub-order available fields: ${subOrdersGetFields.join(", ")}`)
                .argParser(commaSeparatedList)
                .default(subOrdersGetDefaultFields, subOrdersGetDefaultFields.join(","))
        )
        .action(async (id: string, options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const backendAccess = configLoader.loadSection("backend") as Config["backend"];
            const accessToken = configLoader.loadSection("accessToken") as Config["accessToken"];

            validateFields(options.fields, ordersGetFields);
            if (options.suborders) validateFields(options.suborders_fields, subOrdersGetFields);

            await ordersGet({
                fields: options.fields,
                subOrdersFields: options.suborders ? options.suborders_fields : [],
                backendUrl: backendAccess.url,
                accessToken,
                id,
            });
        });

    ordersCommand
        .command("download-result")
        .description("Downloading result of order with <id>")
        .argument("id", "Order <id>")
        .option("--save-to <path>", "Path to save the result", "./result.tar.gz")
        .action(async (orderId: string, options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const blockchainAccess = configLoader.loadSection("blockchain") as Config["blockchain"];
            const workflowConfig = configLoader.loadSection("workflow") as Config["workflow"];

            await ordersDownloadResult({
                blockchainConfig: blockchainAccess,
                orderId,
                localPath: options.saveTo,
                resultDecryptionKey: workflowConfig.resultEncryption.key!,
            });
        });

    ordersCommand
        .command("withdraw-deposit")
        .description("Withdraw unspent deposit from a completed order with <id>")
        .argument("id", "Order <id>")
        .action(async (id: string, options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const blockchainAccess = configLoader.loadSection("blockchain") as Config["blockchain"];
            const blockchainKeys = configLoader.loadSection("blockchainKeys") as Config["blockchainKeys"];

            await ordersWithdrawDeposit({
                blockchainConfig: blockchainAccess,
                actionAccountKey: blockchainKeys.actionAccountKey,
                id,
            });
        });

    tokensCommand
        .command("request")
        .description("Request tokens for the account")
        .option("--matic", "Request Polygon Mumbai MATIC tokens", false)
        .option("--tee", "Request Super Protocol TEE tokens", false)
        .action(async (options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const blockchainKeysConfig = configLoader.loadSection("blockchainKeys") as Config["blockchainKeys"];
            const backendConfig = configLoader.loadSection("backend") as Config["backend"];
            const accessToken = configLoader.loadSection("accessToken") as Config["accessToken"];

            await tokensRequest({
                backendUrl: backendConfig.url,
                accessToken,
                actionAccountPrivateKey: blockchainKeysConfig.actionAccountKey,
                requestMatic: options.matic,
                requestTee: options.tee,
            });
        });

    tokensCommand
        .command("balance")
        .description("Display the token balance of the account")
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
            "provider_address",
            "provider_name",
            "total_cores",
            "free_cores",
            "orders_in_queue",
            "cancelable",
            "modified_date",
        ],
        offersListTeeDefaultFields = ["id", "name", "orders_in_queue"];
    offersListCommand
        .command("tee")
        .description("List TEE offers")
        .addOption(
            new Option("--fields <fields>", `Available fields: ${offersListTeeFields.join(", ")}`)
                .argParser(commaSeparatedList)
                .default(offersListTeeDefaultFields, offersListTeeDefaultFields.join(","))
        )
        .option("--limit <number>", "Number of records to display", "10")
        .option("--cursor <cursorString>", "Cursor for pagination")
        .action(async (options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const backendAccess = configLoader.loadSection("backend") as Config["backend"];
            const accessToken = configLoader.loadSection("accessToken") as Config["accessToken"];

            validateFields(options.fields, offersListTeeFields);

            await offersListTee({
                fields: options.fields,
                backendUrl: backendAccess.url,
                accessToken,
                limit: +options.limit,
                cursor: options.cursor,
            });
        });

    const offersListValueFields = [
            "id",
            "name",
            "description",
            "type",
            "provider_address",
            "provider_name",
            "hold_sum",
            "cancelable",
            "modified_date",
        ],
        offersListValueDefaultFields = ["id", "name", "type"];
    offersListCommand
        .command("value")
        .description("List value offers")
        .addOption(
            new Option("--fields <fields>", `Available fields: ${offersListValueFields.join(", ")}`)
                .argParser(commaSeparatedList)
                .default(offersListValueDefaultFields, offersListValueDefaultFields.join(","))
        )
        .option("--limit <number>", "Number of records to display", "10")
        .option("--cursor <cursorString>", "Cursor for pagination")
        .action(async (options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const backendAccess = configLoader.loadSection("backend") as Config["backend"];
            const accessToken = configLoader.loadSection("accessToken") as Config["accessToken"];

            validateFields(options.fields, offersListValueFields);

            await offersListValue({
                fields: options.fields,
                backendUrl: backendAccess.url,
                accessToken,
                limit: +options.limit,
                cursor: options.cursor,
            });
        });

    const teeOffersGetFields = [
        "name",
        "description",
        "provider_address",
        "provider_name",
        "total_cores",
        "free_cores",
        "orders_in_queue",
        "cancelable",
        "modified_date",
    ];
    offersGetCommand
        .command("tee")
        .description("Display detailed information on TEE offer with <id>")
        .argument("id", "Offer id")
        .addOption(
            new Option("--fields <fields>", `Available fields: ${teeOffersGetFields.join(", ")}`)
                .argParser(commaSeparatedList)
                .default(teeOffersGetFields, teeOffersGetFields.join(","))
        )
        .action(async (id: string, options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const backendAccess = configLoader.loadSection("backend") as Config["backend"];
            const accessToken = configLoader.loadSection("accessToken") as Config["accessToken"];

            validateFields(options.fields, teeOffersGetFields);

            await offersGet({
                fields: options.fields,
                backendUrl: backendAccess.url,
                type: "tee",
                accessToken,
                id,
            });
        });

    const offersGetFields = [
        "provider_address",
        "name",
        "description",
        "type",
        "cancelable",
        "modified_date",
        "hold_sum",
        "restrictions",
    ];
    offersGetCommand
        .command("value")
        .description("Display detailed information on value offer with <id>")
        .argument("id", "Offer id")
        .addOption(
            new Option("--fields <fields>", `Available fields: ${offersGetFields.join(", ")}`)
                .argParser(commaSeparatedList)
                .default(offersGetFields, offersGetFields.join(","))
        )
        .action(async (id: string, options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const backendAccess = configLoader.loadSection("backend") as Config["backend"];
            const accessToken = configLoader.loadSection("accessToken") as Config["accessToken"];

            validateFields(options.fields, offersGetFields);

            await offersGet({
                fields: options.fields,
                backendUrl: backendAccess.url,
                type: "value",
                accessToken,
                id,
            });
        });

    offersCommand
        .command("download-content")
        .description("Download the content of an offer with <id> (only for offers that allows this operation)")
        .argument("id", "Offer id")
        .option("--save-to <path>", "Path to save the content", "./offer.tar.gz")
        .action(async (offerId: string, options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const blockchainAccess = configLoader.loadSection("blockchain") as Config["blockchain"];

            await offersDownloadContent({
                blockchainConfig: blockchainAccess,
                offerId,
                localPath: options.saveTo,
            });
        });

    filesCommand
        .command("upload")
        .description("Upload a file specified by the <localPath> argument to the remote storage")
        .argument("localPath", "Path to a file for uploading")
        .option("--filename <string>", "The name of the resulting file in the storage")
        .option(
            "--output <path>",
            "Path to save resource file that is used to access the uploaded file",
            "./resource.json"
        )
        .option("--metadata <path>", "Path to a metadata file for adding fields to the resource file")
        .action(async (localPath: string, options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const storageConfig = configLoader.loadSection("storage") as Config["storage"];

            await upload({
                localPath,
                storageType: storageConfig.storageType,
                writeCredentials: storageConfig.writeCredentials,
                readCredentials: storageConfig.readCredentials,
                remotePath: options.filename,
                outputPath: options.output,
                metadataPath: options.metadata,
            });
        });

    filesCommand
        .command("download")
        .description(
            "Download and decrypt a file from the remote storage to <localPath> using resource file <resourcePath>"
        )
        .argument("resourcePath", "Path to a resource file")
        .argument("localDirectory", "Path to save downloaded file")
        .action(async (resourcePath: string, localDirectory: string) => {
            await download({
                resourcePath,
                localDirectory,
            });
        });

    filesCommand
        .command("delete")
        .description("Delete a file in the remote storage using resource file <resourcePath>")
        .argument("resourcePath", "Path to a resource file")
        .action(async (resourcePath: string) => {
            await filesDelete({
                resourcePath,
            });
        });

    solutionsCommand
        .command("generate-key")
        .description("Generate a solution signing key")
        .argument("outputPath", "Path to save a key file")
        .action(async (outputPath: string, options: any) => {
            await generateSolutionKey({ outputPath });
        });

    solutionsCommand
        .command("prepare")
        .description("Prepare a solution for deployment")
        .argument("solutionPath", "Path to a solution folder")
        .argument("solutionKeyPath", "Path to a key file")
        .option("--metadata <pathToSave>", "Path to save metadata (hash and MrEnclave)", "./metadata.json")
        .option("--pack-solution <packSolution>", "Path to save the resulting tar.gz archive", "")
        .option("--base-image-path <pathToContainerImage>", "Path to a container image file (required if no --base-image-resource specified)", "")
        .option("--base-image-resource <containerImageResource>", "Path to a container image resource file (required if no --base-image-path specified)", "")
        .option("--write-default-manifest", "Write the default manifest for solutions with empty sgxMrEnclave", false)
        .option("--hash-algo <solutionHashAlgo>", "Hash calculation algorithm for solution", HashAlgorithm.SHA256)
        .option("--sgx-thread-num <threadNum>", "Number of enclave threads", "")
        .option(
            "--sgx-enclave-size <enclaveSize>",
            "Entire enclave size (#M or #G), must be a value to the power of 2",
            ""
        )
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
        command.option("--config <configPath>", "Path to the configuration file", "./config.json");
        command.addHelpCommand("help", "Display help for the command");
        command.helpOption("-h, --help", "Display help for the command");
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
        if (!isSilent) Printer.error("Error occurred during execution");

        const errorLogPath = path.join(process.cwd(), "error.log");
        const errorDetails = JSON.stringify(error, null, 2);
        fs.writeFileSync(
            errorLogPath,
            `${error.stack}\n\n` + (errorDetails != "{}" ? `Details:\n ${errorDetails}\n` : "")
        );

        if (!isSilent) {
            Printer.error(`Error log was saved to ${errorLogPath}`);
            if (message) Printer.error(message);
            process.exit(1);
        } else {
            process.exit(0);
        }
    });

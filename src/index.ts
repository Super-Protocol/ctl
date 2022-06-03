const packageJson = require("../package.json");

import { Command, Option } from "commander";
import fs from "fs";
import path from "path";

import ConfigLoader, { Config } from "./config";
import download from "./commands/filesDownload";
import upload from "./commands/filesUpload";
import providersList from "./commands/providersList";
import providersGet from "./commands/providersGet";
import ordersList from "./commands/ordersList";
import ordersGet from "./commands/ordersGet";
import ordersCancel from "./commands/ordersCancel";
import ordersReplenishDeposit from "./commands/ordersReplenishDeposit";
import Printer from "./printer";
import { commaSeparatedList, processSubCommands, validateFields } from "./utils";
import generateSolutionKey from "./commands/solutionsGenerateKey";
import prepareSolution from "./commands/solutionsPrepare";

async function main() {
    const program = new Command();
    program.name(packageJson.name).description(packageJson.description).version(packageJson.version);

    const providersCommand = program.command("providers");
    const ordersCommand = program.command("orders");
    const filesCommand = program.command("files");
    const solutionsCommand = program.command("solutions");

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
        .description("Cancel order with <address>")
        .argument("address", "Order address")
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
        .description("Replenish order deposit with <address> by <amount>")
        .argument("address", "Order address")
        .argument("amount", "Amount of tokens to replenish")
        .action(async (address: string, amount: string, options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const blockchainAccess = configLoader.loadSection("blockchain") as Config["blockchain"];
            const blockchainKeys = configLoader.loadSection("blockchainKeys") as Config["blockchainKeys"];

            await ordersReplenishDeposit({
                blockchainConfig: blockchainAccess,
                actionAccountKey: blockchainKeys.actionAccountKey,
                address,
                amount: +amount,
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
            new Option("--fields <fields>", `Order fields to fetch (available fields: ${ordersGetFields.join(", ")})`)
                .argParser(commaSeparatedList)
                .default(ordersGetDefaultFields, ordersGetDefaultFields.join(","))
        )
        .option("--suborders", "Show suborders", false)
        .addOption(
            new Option(
                "--suborders-fields <fields>",
                `Sub orders fields to fetch (available fields: ${subOrdersGetFields.join(", ")})`
            )
                .argParser(commaSeparatedList)
                .default(subOrdersGetDefaultFields, subOrdersGetDefaultFields.join(","))
        )
        .action(async (id: string, options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const backendAccess = configLoader.loadSection("backend") as Config["backend"];

            validateFields(options.fields, ordersGetFields);
            if (options.suborders) validateFields(options.subordersFields, subOrdersGetFields);

            await ordersGet({
                fields: options.fields,
                subOrdersFields: options.suborders ? options.subordersFields : [],
                backendUrl: backendAccess.url,
                id,
            });
        });

    filesCommand
        .command("upload")
        .description(
            "Uploads a file or a directory specified by the <localPath> argument to the <remotePath> on the remote storage"
        )
        .argument("localPath", "Path to a file for uploading")
        .argument("remotePath", "A place where it should be saved on a remote storage")
        .action(async (localPath: string, remotePath: string, options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const storageConfig = configLoader.loadSection("storage") as Config["storage"];

            localPath = localPath.replace(/\/$/, "");
            await upload(localPath, remotePath, storageConfig.encryption, storageConfig.access);
        });

    filesCommand
        .command("download")
        .description("Downloads and decrypts file from remote storage from the <remotePath> to the <localPath>")
        .argument("remotePath", "A path to file inside remote storage")
        .argument("localPath", "Path to a file for uploading")
        .option("--encryption-json <encryptionJson>", "A file with encryption info", "./encryption.json")
        .action(async (remotePath: string, localPath: string, options: any) => {
            const configLoader = new ConfigLoader(options.config);
            const storageConfig = configLoader.loadSection("storage") as Config["storage"];

            const encryption = JSON.parse(fs.readFileSync(options.encryptionJson).toString());
            await download(remotePath, localPath, encryption, storageConfig.access);
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
        .description("Prepares a solution in <solutionPath>, sign it with <solutionKeyPath>")
        .argument("solutionPath", "Path to a file for uploading")
        .argument("solutionKeyPath", "Path to a solution key")
        .option("--pack-solution <packSolution>", "Pack solution folder into tar gz", "")
        .option("--base-image-path <pathToContainerImage>", "A container image file", "")
        .option("--base-image-resource <containerImageResource>", "A container image resource name", "")
        .option("--hash-algo <solutionHashAlgo>", "Hash calculation algorithm for solution", "sha256")
        .option("--sgx-thread-num <threadNum>", "A number of enclave threads", "")
        .option("--sgx-enclave-size <enclaveSize>", "Whole enclave size (#M or #G), must be some of power of 2", "")
        .option("--sgx-loader-internal-size <internalSize>", "Size of the internal enclave structs (#M or #G)", "")
        .option("--sgx-stack-size <stackSize>", "Size of the enclave thread stack (#K, #M or #G)", "")
        .action(async (solutionPath: string, solutionKeyPath: string, options: any) => {
            await prepareSolution({
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
        if (isSilent) error = error.error;
        else Printer.error("Error happened during execution");

        const errorLogPath = path.join(process.cwd(), "error.log");
        const errorDetails = JSON.stringify(error, null, 2);
        fs.writeFileSync(
            errorLogPath,
            `${error.stack}\n\n` + (errorDetails != "{}" ? `Details:\n ${errorDetails}\n` : "")
        );

        if (!isSilent) {
            Printer.error(`Error log was written at ${errorLogPath}`);
            if (error.message) Printer.error(error.message);
            process.exit(1);
        } else {
            process.exit(0);
        }
    });

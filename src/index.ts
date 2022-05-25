const packageJson = require("../package.json");

import { Command, Option } from "commander";
import fs from "fs";
import path from "path";

import loadConfig from "./config";
import download from "./commands/files-download";
import upload from "./commands/files-upload";
import providersList from "./commands/providers-list";
import providersGet from "./commands/providers-get";
import Printer from "./printer";
import { commaSeparatedList, processSubCommands, validateFields } from "./utils";

async function main() {
    const program = new Command();
    program.name(packageJson.name).description(packageJson.description).version(packageJson.version);

    const providersCommand = program.command("providers");
    const filesCommand = program.command("files");

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
            const CONFIG = await loadConfig(options.config);
            if (!CONFIG.backend)
                throw Error(`Backend access not specified\nPlease configure backend section in ${options.config}`);

            validateFields(options.fields, providersGetFields);

            await providersList({
                fields: options.fields,
                backendUrl: CONFIG.backend.url,
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
            const CONFIG = await loadConfig(options.config);
            if (!CONFIG.backend)
                throw Error(`Backend access not specified\nPlease configure backend section in ${options.config}`);

            validateFields(options.fields, providersGetFields);

            await providersGet({
                fields: options.fields,
                backendUrl: CONFIG.backend.url,
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
            const CONFIG = await loadConfig(options.config);
            if (!CONFIG.storage)
                throw Error("Remote storage access not specified\nPlease configure storage section in config.json");

            localPath = localPath.replace(/\/$/, "");
            await upload(localPath, remotePath, CONFIG.storage.encryption, CONFIG.storage.access);
        });

    filesCommand
        .command("download")
        .description("Downloads and decrypts file from remote storage from the <remotePath> to the <localPath>")
        .argument("remotePath", "A path to file inside remote storage")
        .argument("localPath", "Path to a file for uploading")
        .option("--encryption-json <encryptionJson>", "A file with encryption info", "./encryption.json")
        .action(async (remotePath: string, localPath: string, options: any) => {
            const CONFIG = await loadConfig(options.config);
            if (!CONFIG.storage)
                throw Error("Remote storage access not specified\nPlease configure storage section in config.json");

            const encryption = JSON.parse(fs.readFileSync(options.encryptionJson).toString());
            await download(remotePath, localPath, encryption, CONFIG.storage.access);
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

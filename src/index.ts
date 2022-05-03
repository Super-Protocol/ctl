const packageJson = require("../package.json");

import { Command } from "commander";
import fs from "fs";
import path from "path";

import loadConfig from './config';
import download from "./commands/download";
import upload from "./commands/upload";
import Printer from "./printer";

async function main() {
    const program = new Command();
    program
        .name(packageJson.name)
        .description(packageJson.description)
        .version(packageJson.version);

    program.option("--config <configPath>", "Path to configuration file", "./config.json")
    program.parse();
    const globalOptions = program.opts();
    const CONFIG = await loadConfig(globalOptions.config);

    program
        .command("upload")
        .description(
            "Uploads a file or a directory specified by the <localPath> argument to the <remotePath> on the remote storage"
        )
        .argument("localPath", "Path to a file for uploading")
        .argument("remotePath", "A place where it should be saved on a remote storage")
        .action(async (localPath: string, remotePath: string, options: any) => {
            if (!CONFIG.storage) throw Error("Remote storage access not specified\nPlease configure storage section in config.json");

            localPath = localPath.replace(/\/$/, "");

            const data = await upload(localPath, remotePath, CONFIG.storage.encryption, CONFIG.storage.access);
            const outputpath = path.join(process.cwd(), `encryption.json`);
            fs.writeFileSync(outputpath, JSON.stringify(data, null, 2));
            Printer.print(`Encryption info was written into ${outputpath}\n`);
        });

    program
        .command("download")
        .description("Downloads and decrypts file from remote storage from the <remotePath> to the <localPath>")
        .argument("remotePath", "A path to file inside remote storage")
        .argument("localPath", "Path to a file for uploading")
        .option("--encryption-json <encryptionJson>", "A file with encryption info", "./encryption.json")
        .action(async (remotePath: string, localPath: string, options: any) => {
            const CONFIG = await loadConfig(options.configPath);
            if (!CONFIG.storage) throw Error("Remote storage access not specified\nPlease configure storage section in config.json");

            const encryption = JSON.parse(fs.readFileSync(options.encryptionJson).toString());
            await download(remotePath, localPath, encryption, CONFIG.storage.access);
        });

    await program.parseAsync(process.argv);
}

main()
    .then(() => {
        process.exit(0);
    })
    .catch((e) => {
        const errorLogPath = path.join(process.cwd(), "error.log");
        Printer.error(`Error happened during execution. Error log was written at ${errorLogPath}`);
        const errorDetails = JSON.stringify(e, null, 2);
        fs.writeFileSync(
            errorLogPath,
            `${e.stack}\n\n` + (errorDetails != "{}" ? `Details:\n ${JSON.stringify(e, null, 2)}\n` : "")
        );
        if (e.message) {
            Printer.error(`${e.message}\n`);
        }
        process.exit(1);
    });

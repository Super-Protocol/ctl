const packageJson = require("../package.json");

import { Command } from "commander";
import fs from "fs";
import path from "path";

import loadConfig from './config';
import downloadCommand from "./commands/download";
import uploadCommand from "./commands/upload";
import Printer from "./printer";

async function main() {
    const program = new Command();
    program.version(packageJson.version).description(packageJson.description);

    const CONFIG = await loadConfig();

    program
        .command("upload")
        .description(
            "Uploads a file or a directory specified by the <localPath> argument to the <remotePath> on the remote storage"
        )
        .argument("localPath", "Path to a file for uploading")
        .argument("remotePath", "A place where it should be saved on a remote storage")
        .action(async (localPath: string, remotePath: string, options: any) => {
            localPath = localPath.replace(/\/$/, "");

            const data = await uploadCommand(localPath, remotePath, CONFIG.storage!.encryption, CONFIG.storage!.access);
            const outputpath = path.join(process.cwd(), `encryption.json`);
            fs.writeFileSync(outputpath, JSON.stringify(data, null, 2));
            Printer.print(`Encryption info was written into ${outputpath}\n`);
        });

    program
        .command("download")
        .description("Downloads and decrypts file")
        .argument("remotePath", "A path to file inside remote storage")
        .argument("localPath", "Path to a file for uploading")
        .option("--encryption-json <encryptionJson>", "A file with encryption info", "./encryption.json")
        .action(async (remotePath: string, localPath: string, options: any) => {
            const encryption = JSON.parse(fs.readFileSync(options.encryptionJson).toString());
            await downloadCommand(remotePath, localPath, encryption, CONFIG.storage!.access);
        });

    await program.parseAsync(process.argv);
}

main()
    .then(() => {
        process.exit(0);
    })
    .catch((e) => {
        const errorLogPath = path.join(process.cwd(), "error.log");
        Printer.error(`Error happened during execution. Error log was written at ${errorLogPath}\n`);
        const errorDetails = JSON.stringify(e, null, 2);
        fs.writeFileSync(
            errorLogPath,
            `${e.stack}\n\n` + (errorDetails != "{}" ? `Details:\n ${JSON.stringify(e, null, 2)}\n` : "")
        );
        if (e.details) {
            Printer.error(`${e.details}\n`);
        }
        process.exit(1);
    });

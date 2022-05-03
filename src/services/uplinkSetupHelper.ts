import Printer from "../printer";
import fs from "fs";
import path from "path";
import os from "os";

const PROJECT_DIR = path.join(path.dirname(__dirname));
const LIBRARIES_SNAPSHOT_DIR = path.join(PROJECT_DIR, "libs");
const LIBRARIES_TMP_DIR = `${os.tmpdir()}/spctl`;

const uplinkSetupHelper = async () => {
    switch (process.platform) {
        case "darwin":
            loadDependencies();
            Printer.print(
                `Error: can't connect to remote storage, some dependencies may be missing\nCall command in shell to fix: export DYLD_LIBRARY_PATH=$DYLD_LIBRARY_PATH:${LIBRARIES_TMP_DIR}\n`
            );
            break;
        case "win32":
            Printer.print("upload and download commands are not supported on Windows, please use WSL");
            break;
        default:
            Printer.print(
                `Error: can't connect to remote storage, some dependencies may be missing\nCall command in shell to fix: export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:${LIBRARIES_TMP_DIR}\n`
            );
    }
};

const loadDependencies = () => {
    if (!fs.existsSync(LIBRARIES_TMP_DIR)) fs.mkdirSync(LIBRARIES_TMP_DIR);

    for (let filename of fs.readdirSync(LIBRARIES_SNAPSHOT_DIR)) {
        const tmpFilepath = path.join(LIBRARIES_TMP_DIR, filename);
        const libFilepath = path.join(LIBRARIES_SNAPSHOT_DIR, filename);
        if (!fs.existsSync(tmpFilepath)) {
            fs.writeFileSync(tmpFilepath, fs.readFileSync(libFilepath));
        }
    }
};

export default uplinkSetupHelper;
import fs from "fs";
import path from "path";
import os from "os";
import Printer from "../printer";
import { SilentError } from "../utils";

const PROJECT_DIR = path.join(path.dirname(__dirname), "../");
const LIBRARIES_SNAPSHOT_DIR = path.join(PROJECT_DIR, "libs");
const LIBRARIES_TMP_DIR = `${os.tmpdir()}/spctl`;
const SUPPORTED_PLATFORMS: NodeJS.Platform[] = ["darwin", "linux"];

export const isCommandSupported = () => {
    if (!SUPPORTED_PLATFORMS.includes(process.platform)) {
        Printer.print(`Command isn't supported on this platform. Supported platforms: ${SUPPORTED_PLATFORMS}`);
        return false;
    }
    return true;
};

export const troubleshootHelper = async (error: Error) => {
    if (!ifDependencyError(error)) throw error;

    switch (process.platform) {
        case "darwin":
            Printer.print(
                `Storj Uplink requires setup\nCall command in shell: export DYLD_LIBRARY_PATH=$DYLD_LIBRARY_PATH:${LIBRARIES_TMP_DIR}\n`
            );
            break;
        default:
            Printer.print(
                `Storj Uplink requires setup\nCall command in shell: export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:${LIBRARIES_TMP_DIR}\n`
            );
    }

    throw SilentError(error);
};

export const loadDependencies = () => {
    if (!fs.existsSync(LIBRARIES_TMP_DIR)) fs.mkdirSync(LIBRARIES_TMP_DIR);

    for (let filename of fs.readdirSync(LIBRARIES_SNAPSHOT_DIR)) {
        const tmpFilepath = path.join(LIBRARIES_TMP_DIR, filename);
        const libFilepath = path.join(LIBRARIES_SNAPSHOT_DIR, filename);
        if (!fs.existsSync(tmpFilepath)) {
            fs.writeFileSync(tmpFilepath, fs.readFileSync(libFilepath));
        }
    }
};

const ifDependencyError = (error: Error) => {
    if (!error.message) return false;
    const message = error.message;

    switch (process.platform) {
        case "darwin":
            if (message.match(/Library not loaded: libuplinkcv.*\.dylib/)) return true;
            break;
        default:
            if (message.match(/libuplinkcv.*\.so: cannot open shared object file/)) return true;
    }

    const position = error.message?.indexOf("Could not locate the bindings file. Tried:");
    if (position !== -1 && position < error.message?.indexOf("uplink.node")) return true;

    return false;
};

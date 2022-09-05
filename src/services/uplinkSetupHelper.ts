import Printer from "../printer";

const SUPPORTED_PLATFORMS: NodeJS.Platform[] = ["darwin", "linux"];

export const isCommandSupported = () => {
    if (!SUPPORTED_PLATFORMS.includes(process.platform)) {
        Printer.print(`Command is not supported on this platform, list of supported platforms: ${SUPPORTED_PLATFORMS}`);
        return false;
    }
    return true;
};

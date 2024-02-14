import Printer from '../printer';

const SUPPORTED_PLATFORMS: NodeJS.Platform[] = ['darwin', 'linux', 'win32'];

export const isCommandSupported = (): boolean => {
  if (!SUPPORTED_PLATFORMS.includes(process.platform)) {
    Printer.print(
      `Command is not supported on this platform, list of supported platforms: ${SUPPORTED_PLATFORMS}`,
    );
    return false;
  }
  return true;
};

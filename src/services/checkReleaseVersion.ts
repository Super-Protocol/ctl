import axios from 'axios';
import semver from 'semver';
import Printer from '../printer';
import ConfigLoader from '../config';
import { MILLISECONDS_IN_DAY } from '../constants';

const packageJson = require('../../package.json');

export const checkForUpdates = async (configPath: string): Promise<void> => {
  const currentVersion = packageJson.version;
  const latestReleaseUrl = `https://api.github.com/repos/Super-Protocol/ctl/releases/latest`;

  const configLoader = new ConfigLoader(configPath);
  const metadata = await configLoader.loadSection('metadata');

  if (!metadata?.lastCheckForUpdates || !Number.isSafeInteger(metadata.lastCheckForUpdates)) {
    configLoader.updateSection('metadata', {
      lastCheckForUpdates: new Date().getTime(),
    });
  } else if (metadata.lastCheckForUpdates + MILLISECONDS_IN_DAY > Date.now()) {
    return;
  }

  try {
    // Fetch the latest release data
    const response = await axios.get(latestReleaseUrl);
    const latestVersion = semver.clean(response.data.tag_name);

    if (!latestVersion) return;

    // Compare versions
    const isOutdated = semver.gt(latestVersion, currentVersion);

    if (isOutdated) {
      Printer.printNotice([
        `New spctl version available! ${currentVersion} -> ${latestVersion}.`,
        'To download the latest release use commands:',
        `curl -L https://github.com/Super-Protocol/ctl/releases/latest/download/${getReleaseFileForPlatform()} -o spctl`,
        'chmod +x ./spctl',
      ]);
    }
  } catch (error) {
    return;
  }
};

const getReleaseFileForPlatform = (): string => {
  switch (process.platform) {
    case 'darwin':
      return 'spctl-macos-x64';
    case 'linux':
    default:
      return 'spctl-linux-x64';
  }
};

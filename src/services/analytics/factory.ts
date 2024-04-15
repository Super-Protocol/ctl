import { Analytics, NodeEventProvider } from '@super-protocol/sdk-js';
import { AnalyticsEvent, AnalyticsConfig } from '@super-protocol/sdk-js';
import ConfigLoader from '../../config';
import { Wallet } from 'ethers';
import { Platform } from './types';

let instance: Analytics<AnalyticsEvent> | null = null;

export const createAnalyticsService = (
  configLoader: ConfigLoader,
): Analytics<AnalyticsEvent> | null => {
  const analyticsConfig = {
    ...configLoader.loadSection('analytics'),
  };
  if (!analyticsConfig.enabled) {
    instance = null;
  } else if (!instance) {
    const blockchainConfig = configLoader.loadSection('blockchain');
    const config: AnalyticsConfig<AnalyticsEvent> = {
      apiUrl: analyticsConfig.spaUrl,
      apiKey: analyticsConfig.spaAuthKey,
      eventProvider: new NodeEventProvider({
        userId: new Wallet(blockchainConfig.accountPrivateKey).address,
        platform: Platform.cli,
      }),
      showLogs: Boolean(analyticsConfig.logEnabled),
    };

    instance = new Analytics(config);
  }

  return instance;
};

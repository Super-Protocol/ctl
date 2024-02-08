import { Analytics, NodeEventProvider } from '@super-protocol/sdk-js';
import { AnalyticsEvent, Config } from '@super-protocol/sdk-js/build/analytics/types';
import ConfigLoader from '../../config';
import { Wallet } from 'ethers';
import { IAnalyticsOption, Platform } from './types';

let instance: Analytics<AnalyticsEvent> | null = null;

export const createAnalyticsService = (
  configLoader: ConfigLoader,
  options: Partial<IAnalyticsOption> = {},
): Analytics<AnalyticsEvent> | null => {
  const analyticsConfig = {
    ...configLoader.loadSection('analytics'),
    ...options,
  };
  if (!analyticsConfig.enabled) {
    instance = null;
  } else if (!instance) {
    const blockchainConfig = configLoader.loadSection('blockchain');
    const config: Config<AnalyticsEvent> = {
      apiUrl: analyticsConfig.spaUrl,
      apiKey: analyticsConfig.spaAuthKey,
      eventProvider: new NodeEventProvider({
        userId: options.userId || new Wallet(blockchainConfig.accountPrivateKey).address,
        platform: Platform.cli,
      }),
      showLogs: Boolean(analyticsConfig.logEnabled),
    };

    instance = new Analytics(config);
  }

  return instance;
};

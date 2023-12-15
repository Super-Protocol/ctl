import axios, { AxiosRequestConfig } from 'axios';
import { v5 as uuidv5 } from 'uuid';
const packageJson = require('../../package.json');

const UUID_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

export interface Config {
  apiUrl: string;
  apiKey: string;
  userId?: string | null;
  deviceId?: string | null;
}

export interface IEvent {
  userId: string;
  eventName: string;
  deviceId?: string;
  date?: string;
  platform?: string;
  osName?: string;
  osVersion?: string;
  deviceModel?: string;
  language?: string;
  eventProperties?: string;
}

export interface AnalyticsEvent {
  events: IEvent[];
  apiKey: string;
}

export class Analytics {
  private userId: string;
  private apiUrl: string;
  private apiKey: string;
  private deviceId: string;
  private language = Intl.DateTimeFormat().resolvedOptions().locale;
  private deviceModel = this.getPlatform();
  private platform = 'cli';
  private osName = 'Spctl';
  private osVersion = packageJson.version;

  constructor(config: Config) {
    const { userId, apiUrl, apiKey } = config || {};
    this.userId = userId || '';
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    this.deviceId = uuidv5(this.osVersion + process.version + process.platform, UUID_NAMESPACE); // generate same deviceId for the same metadata
  }

  public async trackEvent(eventName: string, eventProperties?: object): Promise<Analytics> {
    if (!this.userId) {
      return this;
    }
    if (!this.apiUrl) {
      return this;
    }
    if (!this.apiKey) {
      return this;
    }
    if (!this.deviceId) {
      return this;
    }
    const event = this.composeEvent(eventName, eventProperties);
    await this.sendAnalytics({ events: [event], apiKey: this.apiKey });

    return this;
  }

  private async sendAnalytics(payload: AnalyticsEvent): Promise<void> {
    const config: AxiosRequestConfig = {
      url: this.apiUrl,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
      data: payload,
    };

    const response = await axios(config);

    if (response.status > 299) {
      throw new Error(response.statusText);
    }
    return response.data;
  }

  private composeEvent(eventName: string, eventProperties?: object): IEvent {
    return {
      userId: this.userId,
      eventName: eventName,
      language: this.language,
      eventProperties: JSON.stringify(eventProperties),
      date: new Date().toISOString(),
      platform: this.platform,
      osName: this.osName,
      osVersion: this.osVersion,
      deviceModel: this.deviceModel,
      deviceId: this.deviceId,
    };
  }

  private getPlatform(): string {
    switch (process.platform) {
      case 'darwin':
        return 'Mac OS';
      case 'linux':
        return 'Linux';
      case 'win32':
        return 'Windows';
      default:
        return process.platform;
    }
  }
}

// @ts-ignore
import packageJson from '../../package.json' assert { type: 'json' };

export default (accessToken: string): { [header: string]: string } => {
  return {
    Authorization: `Bearer ${accessToken}`,
    'X-Sdk-Version': packageJson.dependencies['@super-protocol/sdk-js'],
  };
};

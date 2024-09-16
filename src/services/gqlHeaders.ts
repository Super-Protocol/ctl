// @ts-ignore

export default (accessToken: string): { [header: string]: string } => {
  return {
    Authorization: `Bearer ${accessToken}`,
    // 'X-Sdk-Version': packageJson.dependencies['@super-protocol/sdk-js'],
    'X-Sdk-Version': '2.2.0-beta.79',
  };
};

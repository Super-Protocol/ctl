const packageJson = require('./package.json');

const config = {
  overwrite: true,
  schema: [
    {
      'http://localhost:3003/graphql': {
        headers: {
          'X-Sdk-Version': packageJson.dependencies['@super-protocol/sdk-js'],
        },
      },
    },
  ],
  documents: ['src/gql/schemas/*.graphql'],
  generates: {
    'src/gql/index.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request'],
    },
  },
};

module.exports = config;

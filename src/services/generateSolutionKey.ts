import { assertCommand, exec } from '../utils';

const generateSolutionKey = async (): Promise<string> => {
  await assertCommand(
    'openssl version',
    'OpenSSL is not found in PATH. Is OpenSSL installed here?',
  );

  const result = await exec('openssl genrsa -3 3072');

  return result.stdout;
};

export default generateSolutionKey;

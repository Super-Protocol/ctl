import { join } from 'path';
import { writeFile, readFile, mkdir, copyFile, realpath, rm } from 'fs/promises';
import { existsSync } from 'fs';
import { assertCommand, exec } from '../utils';

const assertDockerCommand = () =>
  assertCommand(
    'docker version',
    'Docker was not found in PATH, please verify that Docker is installed',
  );

const solutionMetadataFolder = '.solution-metadata';

export const extractManifest = async (opts: {
  baseImagePath?: string;
  baseImageResource?: string;
  workingPath: string;
}): Promise<{ manifest: string; dockerImage: string }> => {
  await assertDockerCommand();

  let dockerImage = '';

  if (opts.baseImagePath) {
    const { stdout } = await exec(`docker image load -i "${opts.baseImagePath}"`);

    dockerImage = stdout.match(/Loaded image: ([^$\n]+)/)?.[1] ?? '';
  } else if (opts.baseImageResource) {
    const { stdout } = await exec(`docker image pull "${opts.baseImageResource}"`);

    dockerImage = stdout.split('\n').filter(Boolean).pop() ?? '';
  } else {
    throw new Error('Base image and resource were not provided');
  }

  const destManifestName = 'baseSolution.manifest';
  await exec(
    `docker run --rm -i -v ${opts.workingPath}:/mnt/host --entrypoint /bin/sh "${dockerImage}" -exc "cp -f /gramine/app_files/entrypoint.manifest /mnt/host/${destManifestName}"`,
  );

  const baseSolutionManifestPath = join(opts.workingPath, destManifestName);
  if (!existsSync(baseSolutionManifestPath)) {
    throw new Error(`An error occurred while extract the manifest`);
  }
  const content = await readFile(baseSolutionManifestPath, 'utf8');

  return {
    dockerImage,
    manifest: content,
  };
};

export const signManifest = async (opts: {
  dockerImage: string;
  manifest: string;
  keyPath: string;
  solutionPath: string;
  writeDefaultManifest: boolean;
  workingPath: string;
}): Promise<{
  solutionMetadataPath: string;
  mrenclave: string;
  mrsigner: string;
}> => {
  await assertDockerCommand();

  const keyPath = await realpath(opts.keyPath);
  const scriptPath = join(opts.workingPath, 'entrypoint.script');
  const entrypointManifestPath = join(opts.workingPath, 'entrypoint.manifest');
  const entrypointSigPath = join(opts.workingPath, 'entrypoint.sig.tmp');
  const entrypointSgxPath = join(opts.workingPath, 'entrypoint.manifest.sgx.tmp');

  const splitter = '============= gramine-sgx-get-token ================';
  const script = `#!/usr/bin/env bash
set -e
export PYTHONPATH="\${PYTHONPATH}:$(find /gramine/meson_build_output/lib -type d -path '*/site-packages')"
export PKG_CONFIG_PATH="\${PKG_CONFIG_PATH}:$(find /gramine/meson_build_output/lib -type d -path '*/pkgconfig')"
gramine-sgx-sign -k "/sign.key" -m "/entrypoint.manifest" -o "/entrypoint.manifest.sgx" -s "/entrypoint.sig"
echo "${splitter}"
echo "from graminelibos import Sigstruct
import hashlib
f = open(\\"/entrypoint.sig\\", \\"rb\\")
sig = Sigstruct.from_bytes(f.read())
mrsigner = hashlib.sha256()
mrsigner.update(sig['modulus'])
mrsigner = mrsigner.hexdigest()
print(f'    mr_enclave:  {sig[\\"enclave_hash\\"].hex()}')
print(f'    mr_signer:   {mrsigner}')" > /parse_sigstruct.py
python3 /parse_sigstruct.py
`;

  await mkdir(opts.solutionPath, { recursive: true });

  await writeFile(scriptPath, script);
  await writeFile(entrypointManifestPath, opts.manifest);

  // preparing files to be filled
  await writeFile(entrypointSigPath, '');
  await writeFile(entrypointSgxPath, '');

  //remove solution metadata path if exist
  const solutionMetadataRootPath = join(await realpath(opts.solutionPath), solutionMetadataFolder);

  await rm(solutionMetadataRootPath, { recursive: true, force: true });

  const { stdout } = await exec(
    `docker run --hostname localhost --rm -i --entrypoint /bin/sh -v "${keyPath}:/sign.key" -v "${scriptPath}:/script.sh" -v "${entrypointManifestPath}:/entrypoint.manifest" -v "${entrypointSgxPath}:/entrypoint.manifest.sgx" -v "${entrypointSigPath}:/entrypoint.sig" -v "${opts.solutionPath}:/sp/run" "${opts.dockerImage}" /script.sh`,
  );

  const mrenclave = (stdout.match(/mr_enclave:\s+([0-9a-fA-F]+)/)?.[1] || '').toLowerCase();
  const mrsigner = (stdout.match(/mr_signer:\s+([0-9a-fA-F]+)/)?.[1] || '').toLowerCase();

  if (!mrenclave || !mrsigner) {
    throw new Error('Could not parse MRENCLAVE and MRSIGNER');
  }

  const writeManifest = async (mrenclave: string) => {
    const solutionMetadataPath = join(
      await realpath(opts.solutionPath),
      solutionMetadataFolder,
      'sgx-gramine',
      'manifests',
      'mrenclave',
      mrenclave,
    );

    await mkdir(solutionMetadataPath, { recursive: true });

    await copyFile(entrypointSgxPath, join(solutionMetadataPath, 'entrypoint.manifest.sgx'));
    await copyFile(entrypointSigPath, join(solutionMetadataPath, 'entrypoint.sig'));

    return solutionMetadataPath;
  };

  const solutionMetadataPath = await writeManifest(mrenclave);

  if (opts.writeDefaultManifest) {
    await writeManifest('_');
  }

  return {
    solutionMetadataPath,
    mrenclave,
    mrsigner,
  };
};

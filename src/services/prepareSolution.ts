import { tmpdir } from "os";
import { join } from "path";
import { writeFile, rm, mkdir, copyFile, realpath } from "fs/promises";
import { assertCommand, exec } from "../utils";

const assertDockerCommand = () =>
    assertCommand("docker version", "Docker is not found in PATH. Is Docker installed here?");

export const extractManifest = async (opts: {
    baseImagePath?: string;
    baseImageResource?: string;
}): Promise<{ manifest: string; dockerImage: string }> => {
    await assertDockerCommand();

    let dockerImage = "";

    if (opts.baseImagePath) {
        const { stdout } = await exec(`docker image load -i "${opts.baseImagePath}"`);

        dockerImage = stdout.match(/Loaded image: ([^$\n]+)/)?.[1] ?? "";
    } else if (opts.baseImageResource) {
        const { stdout } = await exec(`docker image pull "${opts.baseImageResource}"`);

        dockerImage = stdout.split("\n").filter(Boolean).pop() ?? "";
    } else {
        throw new Error("No base image and resource were provided");
    }

    const { stdout } = await exec(
        `docker run --rm -i --entrypoint /bin/sh "${dockerImage}" -exc "cat /entrypoint.manifest"`,
    );

    return {
        dockerImage,
        manifest: stdout,
    };
};

export const signManifest = async (opts: {
    dockerImage: string;
    manifest: string;
    keyPath: string;
    solutionPath: string;
}): Promise<{
    solutionMetadataPath: string;
    mrenclave: string;
    mrsigner: string;
}> => {
    await assertDockerCommand();

    const keyPath = await realpath(opts.keyPath);
    const workingPath = join(tmpdir(), "spctl" + String(Date.now()));
    const scriptPath = join(workingPath, "entrypoint.script");
    const entrypointManifestPath = join(workingPath, "entrypoint.manifest");
    const entrypointSigPath = join(workingPath, "entrypoint.sig.tmp");
    const entrypointSgxPath = join(workingPath, "entrypoint.manifest.sgx.tmp");

    const splitter = "============= gramine-sgx-get-token ================";
    const script = `#!/usr/bin/env bash
set -e
export PYTHONPATH="\${PYTHONPATH}:$(find /gramine/meson_build_output/lib -type d -path '*/site-packages')"
export PKG_CONFIG_PATH="\${PKG_CONFIG_PATH}:$(find /gramine/meson_build_output/lib -type d -path '*/pkgconfig')"
gramine-sgx-sign -k "/sign.key" -m "/entrypoint.manifest" -o "/entrypoint.manifest.sgx" -s "/entrypoint.sig"
echo "${splitter}"
gramine-sgx-get-token --sig /entrypoint.sig --output /entrypoint.token
`;

    try {
        await mkdir(opts.solutionPath, { recursive: true });
        await mkdir(workingPath, { recursive: true });

        await writeFile(scriptPath, script);
        await writeFile(entrypointManifestPath, opts.manifest);

        // preparing files to be filled
        await writeFile(entrypointSigPath, "");
        await writeFile(entrypointSgxPath, "");

        const { stdout } = await exec(
            `docker run --hostname localhost --rm -i --entrypoint /bin/sh -v "${keyPath}:/sign.key" -v "${scriptPath}:/script.sh" -v "${entrypointManifestPath}:/entrypoint.manifest" -v "${entrypointSgxPath}:/entrypoint.manifest.sgx" -v "${entrypointSigPath}:/entrypoint.sig" "${opts.dockerImage}" /script.sh`,
        );

        const mrenclave = (stdout.match(/mr_enclave:\s+([0-9a-fA-F]+)/)?.[1] || "").toLowerCase();
        const mrsigner = (stdout.match(/mr_signer:\s+([0-9a-fA-F]+)/)?.[1] || "").toLowerCase();

        if (!mrenclave || !mrsigner) {
            throw new Error("Fail to parse MRENCLAVE and MRSIGNER");
        }

        const solutionMetadataPath = join(
            await realpath(opts.solutionPath),
            ".solution-metadata",
            "sgx-gramine",
            "manifests",
            "mrenclave",
            mrenclave,
        );

        await mkdir(solutionMetadataPath, { recursive: true });

        await copyFile(entrypointSgxPath, join(solutionMetadataPath, "entrypoint.manifest.sgx"));
        await copyFile(entrypointSigPath, join(solutionMetadataPath, "entrypoint.sig"));

        return {
            solutionMetadataPath,
            mrenclave,
            mrsigner,
        };
    } finally {
        await rm(workingPath, { force: true, recursive: true });
    }
};

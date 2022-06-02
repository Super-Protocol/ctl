import { createHash } from "crypto";
import { Transform } from "stream";
import { mkdir } from "fs/promises";
import toml from "@iarna/toml";
import Printer from "../printer";
import { extractManifest, signManifest } from "../services/prepareSolution";
import packFolder from "../services/packFolder";
import { assertNumber, assertSize } from "../utils";

export type PrepareSolutionParams = {
    solutionHashAlgo: string;
    solutionPath: string;
    solutionOutputPath: string;
    baseImagePath?: string;
    baseImageResource?: string;
    keyPath: string;
    sgxThreadNum?: string;
    sgxEnclaveSize?: string;
    loaderPalInternalMemSize?: string;
    sysStackSize?: string;
};

const setValue = (obj: any, value: any, ...path: string[]) => {
    for (let i = 0; i < path.length; i++) {
        if (i < path.length - 1) {
            if (obj[path[i]] === undefined) {
                obj[path[i]] = {};
            }
            obj = obj[path[i]];
        } else {
            obj[path[i]] = value;
        }
    }
};

export default async (params: PrepareSolutionParams) => {
    assertNumber(params.sgxThreadNum, "Invalid threads number");
    assertSize(params.loaderPalInternalMemSize, "Invalid sgx pal internal size");
    assertSize(params.sysStackSize, "Invalid stack size");
    assertSize(params.sgxEnclaveSize, "Invalid enclave size");

    await mkdir(params.solutionPath, { recursive: true });

    Printer.print("Getting manifest...");

    const { dockerImage, manifest } = await extractManifest({
        baseImagePath: params.baseImagePath,
        baseImageResource: params.baseImageResource,
    });

    Printer.print("Patching manifest...");

    const manifestObject = <any>toml.parse(manifest);

    if (params.sgxEnclaveSize) {
        setValue(manifestObject, params.sgxEnclaveSize, "sgx", "enclave_size");
    }
    if (params.sgxThreadNum) {
        if (parseInt(params.sgxThreadNum, 10) < 4) {
            throw new Error("Too low value for threads number, minimal is 4");
        }
        setValue(manifestObject, params.sgxThreadNum, "sgx", "thread_num");
    }
    if (params.loaderPalInternalMemSize) {
        setValue(manifestObject, params.loaderPalInternalMemSize, "loader", "pal_internal_mem_size");
    }
    if (params.sysStackSize) {
        setValue(manifestObject, params.sysStackSize, "sys", "stack", "size");
    }

    Printer.print("Signing manifest...");

    const result = await signManifest({
        dockerImage,
        keyPath: params.keyPath,
        manifest: toml.stringify(manifestObject),
        solutionPath: params.solutionPath,
    });

    let solutionHash = "";
    let { solutionHashAlgo } = params;

    solutionHashAlgo = solutionHashAlgo || 'sha-256';

    if (params.solutionOutputPath) {
        Printer.print("Pack solution folder...");

        const tarGzExt = ".tar.gz";
        const tgzExt = ".tgz";
        const ext = params.solutionOutputPath.toLowerCase();

        // fix ext
        if (ext.slice(-tarGzExt.length) !== tarGzExt && ext.slice(-tgzExt.length) !== tgzExt) {
            params.solutionOutputPath += tarGzExt;
        }

        const hashStream = createHash(solutionHashAlgo);

        await packFolder(
            params.solutionPath,
            params.solutionOutputPath,
            (total: number, current: number) => {
                Printer.progress("Packing", total, current);
            },
            {
                withoutUpFolder: true,
                transform: new Transform({
                    transform: (chunk, encoding, done) => {
                        hashStream.write(chunk);

                        done(null, chunk);
                    }
                })
            },
        );

        Printer.stopProgress();

        solutionHash = hashStream.digest().toString('hex');
    }

    Printer.print("Solution and manifest successfully created.");
    if (solutionHash) {
        Printer.print(`Solution hash [${solutionHashAlgo}]: ${solutionHash}`)
    }
    Printer.print("MRENCLAVE: " + result.mrenclave);
    Printer.print("MRSIGNER: " + result.mrsigner);
};

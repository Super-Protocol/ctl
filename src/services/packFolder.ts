import stream from "stream";
import path from "path";
import fs from "fs";
import tar from "tar";
import util from "util";
import { once } from "events";
import _getFolderSize from "get-folder-size";
const getFolderSize: (path: string) => Promise<number> = util.promisify(_getFolderSize);

export default async (
    folderPath: string,
    output?: string,
    progressListener?: (total: number, current: number) => void,
    opts: { withoutUpFolder?: boolean; transform?: stream.Transform } = {},
): Promise<string> => {
    output = output ?? path.join(path.dirname(folderPath), `${path.basename(folderPath)}.tgz`);

    let totalSize = await getFolderSize(folderPath);
    let bytesWritten = 0;

    let outputStream = fs.createWriteStream(output);
    const stream = tar
        .c(
            {
                gzip: true,
                cwd: opts.withoutUpFolder ? folderPath : path.dirname(folderPath),
            },
            [opts.withoutUpFolder ? "." : path.basename(folderPath)],
        )
        .on("data", (chunk) => {
            bytesWritten += chunk.length;
            if (typeof progressListener != "undefined") {
                progressListener(totalSize, bytesWritten);
            }
        });

    if (opts.transform) {
        stream.pipe(opts.transform).pipe(outputStream);
    } else {
        stream.pipe(outputStream);
    }

    await once(outputStream, "close");
    if (typeof progressListener != "undefined") {
        progressListener(totalSize, totalSize);
    }

    return output;
};

import { MultiBar, SingleBar } from "cli-progress";
import { printTable } from "console-table-printer";
import colors from "colors";

class Printer {
    private static multibar = new MultiBar({
        format: "{title} |" + colors.white("{bar}") + "| {percentage}%",
        barCompleteChar: "\u2588",
        barIncompleteChar: "\u2591",
        hideCursor: true,
    });
    private static progressBarMap: Map<string, SingleBar> = new Map();

    static print(text: string) {
        process.stdout.write(text + "\n");
    }

    static error(message: string) {
        process.stderr.write(message + "\n");
    }

    static table(rows: { [key: string]: unknown }[]) {
        printTable(rows);
    }

    static progress(title: string, total: number, current: number) {
        this.getProgressBar(title, total).update(current, {
            title: title,
        });
    }

    static stopProgress() {
        this.multibar.stop();
        this.progressBarMap = new Map();
    }

    private static getProgressBar(title: string, total: number) {
        let progressBar = this.progressBarMap.get(title);
        if (typeof progressBar == "undefined") {
            progressBar = this.multibar.create(total, 0);
            progressBar?.start(total, 0);
            this.progressBarMap.set(title, progressBar);
        }

        return progressBar;
    }
}

export default Printer;

import { MultiBar, SingleBar } from 'cli-progress';
import { printTable } from 'console-table-printer';
import colors from 'colors';

class Printer {
  private static multibar = new MultiBar({
    format: '{title} |' + colors.white('{bar}') + '| {percentage}%',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  });
  private static progressBarMap: Map<string, SingleBar> = new Map();

  static print(text: string): void {
    process.stdout.write(text + '\n');
  }

  static printNotice(texts: string[]): void {
    ['', ...texts, ''].forEach((text) => {
      process.stdout.write('spctl notice ' + text + '\n');
    });
  }

  static error(message: string): void {
    process.stderr.write(message + '\n');
  }

  static table(rows: { [key: string]: unknown }[]): void {
    printTable(rows);
  }

  static printObject(object: { [key: string]: unknown }): void {
    Object.keys(object).forEach((key) => {
      if (object[key] && typeof object[key] === 'object' && !Array.isArray(object[key])) {
        Printer.print(`${key}: {`);
        Printer.printObject(object[key] as Record<string, unknown>);
        Printer.print(`}`);
      } else {
        Printer.print(`${key}: ${object[key]}`);
      }
    });
  }

  static progress(title: string, total: number, current: number): void {
    this.getProgressBar(title, total).update(current, {
      title: title,
    });
  }

  static stopProgress(): void {
    this.multibar.stop();
    this.progressBarMap = new Map();
  }

  private static getProgressBar(title: string, total: number): SingleBar {
    let progressBar = this.progressBarMap.get(title);
    if (typeof progressBar == 'undefined') {
      progressBar = this.multibar.create(total, 0);
      progressBar?.start(total, 0);
      this.progressBarMap.set(title, progressBar);
    }

    return progressBar;
  }
}

export default Printer;

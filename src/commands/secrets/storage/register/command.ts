import { Command, Option } from 'commander';
import { REGISTER_COMMAND } from '../../constants';
import { registerAction } from './action';

export const registerCommand = new Command(REGISTER_COMMAND)
  .description('Register secrets storage')
  .argument('offer-id', 'Solution offer id')
  .option('--offer-version <number>', 'Solution offer version')
  .requiredOption('--storage-offer <id>', 'Storage offer id')
  .requiredOption('--storage-slot <id>', 'Storage slot id')
  .requiredOption('--min-rent <hours>', 'Min rent time in hours')
  .requiredOption('--replication-factor <number>', 'Number of replicas')
  .option('--force', 'Force storage registration if it has already been registered')
  .addOption(
    new Option('--retry-count <number>')
      .default(25)
      .hideHelp(true)
      .argParser((v) => Number(v)),
  )
  .addOption(
    new Option('--retry-interval <number>')
      .default(5000)
      .hideHelp(true)
      .argParser((v) => Number(v)),
  )
  .action(registerAction);

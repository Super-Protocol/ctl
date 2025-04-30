import { Command, Option } from 'commander';
import { UPDATE_COMMAND } from '../../constants';
import { updateAction } from './action';

export const updateCommand = new Command(UPDATE_COMMAND)
  .description('Update secrets storage')
  .argument('offer-id', 'Solution offer id')
  .option('--offer-version <number>', 'Solution offer version')
  .requiredOption('--storage-offer <id>', 'Storage offer id')
  .requiredOption('--storage-slot <id>', 'Storage slot id')
  .requiredOption('--min-rent <hours>', 'Min rent time in hours')
  .requiredOption('--replication-factor <number>', 'Number of replicas')
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
  .action(updateAction);

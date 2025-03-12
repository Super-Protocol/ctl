import { Command } from 'commander';
import { STATUS_COMMAND } from '../../constants';
import { statusAction } from './action';

export const statusCommand = new Command(STATUS_COMMAND)
  .description('Show storage registration status')
  .argument('offer-id', 'Solution offer id')
  .option('--offer-version <number>', 'Solution offer version')
  .action(statusAction);

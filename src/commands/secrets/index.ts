import { Command } from 'commander';
import { SECRETS_COMMAND } from './constants';
import { storageCommand } from './storage/command';

export const secretsCommand = new Command(SECRETS_COMMAND).addCommand(storageCommand);

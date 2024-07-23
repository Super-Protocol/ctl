import { Command } from 'commander';
import { SECRET_COMMAND } from './constants';
import { storageCommand } from './storage/command';

export const secretsCommand = new Command(SECRET_COMMAND).addCommand(storageCommand);

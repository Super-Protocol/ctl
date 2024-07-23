import { Command } from 'commander';
import { STORAGE_COMMAND } from '../constants';
import { registerCommand } from './register/command';
import { statusCommand } from './status/command';

export const storageCommand = new Command(STORAGE_COMMAND)
  .addCommand(registerCommand)
  .addCommand(statusCommand);

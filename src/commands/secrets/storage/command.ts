import { Command } from 'commander';
import { STORAGE_COMMAND } from '../constants';
import { registerCommand } from './register/command';
import { statusCommand } from './status/command';
import { updateCommand } from './update/command';

export const storageCommand = new Command(STORAGE_COMMAND)
  .addCommand(registerCommand)
  .addCommand(updateCommand)
  .addCommand(statusCommand);

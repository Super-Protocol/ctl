import {
  REGISTER_COMMAND,
  SECRETS_COMMAND,
  SPCTL_COMMAND,
  STATUS_COMMAND,
  STORAGE_COMMAND,
  UPDATE_COMMAND,
} from '../constants';
import { RegisterActionOptions } from './register/action';
import { UpdateActionOptions } from './update/action';

export const buildRegisterStorageCommand = (
  offerId: string,
  options: RegisterActionOptions,
): string => {
  return [
    SPCTL_COMMAND,
    SECRETS_COMMAND,
    STORAGE_COMMAND,
    REGISTER_COMMAND,
    offerId,
    options.version ? `--version ${options.version}` : '',
    `--storage-offer ${options.storageOffer}`,
    `--storage-slot ${options.storageSlot}`,
    `--min-rent ${options.minRent}`,
    `--replication-factor ${options.replicationFactor}`,
    options.config ? `--config ${options.config}` : '',
  ]
    .filter(Boolean)
    .join(' ');
};

export const buildUpdateStorageCommand = (
  offerId: string,
  options: UpdateActionOptions,
): string => {
  return [
    SPCTL_COMMAND,
    SECRETS_COMMAND,
    STORAGE_COMMAND,
    UPDATE_COMMAND,
    offerId,
    options.version ? `--version ${options.version}` : '',
    `--storage-offer ${options.storageOffer}`,
    `--storage-slot ${options.storageSlot}`,
    `--min-rent ${options.minRent}`,
    `--replication-factor ${options.replicationFactor}`,
    options.config ? `--config ${options.config}` : '',
  ]
    .filter(Boolean)
    .join(' ');
};

export const buildStatusCommand = (
  offerId: string,
  options: { version?: number; config: string },
): string => {
  return [
    SPCTL_COMMAND,
    SECRETS_COMMAND,
    STORAGE_COMMAND,
    STATUS_COMMAND,
    offerId,
    options.version ? `--version ${options.version}` : '',
    options.config ? `--config ${options.config}` : '',
  ]
    .filter(Boolean)
    .join(' ');
};

export const CPU_CORES_FOR_CUSTOM_SOLUTION = 2;
export const MAX_ATTEMPT_WAITING_OLD_TXS = 20;
export const MAX_ATTEMPT_WAITING_NEW_TX = 3;
export const ATTEMPT_PERIOD_MS = 3000;
export const MAX_ORDERS_RUNNING = 2;
export const MINUTES_IN_HOUR = 60;
export const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;
export const TX_REVERTED_BY_EVM_ERROR = 'Transaction has been reverted by the EVM';
export const DEFAULT_PCCS_SERVICE = 'https://pccs.superprotocol.io';
export const BACKEND_URL_DEFAULT = 'https://bff.testnet.superprotocol.com/graphql';
export const BLOCKCHAIN_RPC_URL_DEFAULT = 'https://mumbai.polygon.superprotocol.com/hesoyam';
export const SMART_CONTRACT_ADDRESS_DEFAULT = '0xA7Ff565f26b93926e4e6465Eb81d48EfF456848b';
export const BASE64_CHECK_REGEX =
  /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}(?:==)?|[A-Za-z0-9+/]{3}=?|[A-Za-z0-9+/]{4})$/;
export const JWT_CHECK_REGEX = /(^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$)/;
export const CONFIG_DEFAULT_FILENAME = './config.json';

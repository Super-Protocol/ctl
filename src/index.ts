import { Encoding, HashAlgorithm } from '@super-protocol/dto-js';
import { OfferType, OrderStatus } from '@super-protocol/sdk-js';
import { Wallet } from 'ethers';
import * as bip39 from 'bip39';
import { Argument, Command, Option } from 'commander';
import fs from 'fs';
import path from 'path';

import ConfigLoader, { Config } from './config';
import download from './commands/filesDownload';
import upload from './commands/filesUpload';
import filesDelete from './commands/filesDelete';
import providersList from './commands/providersList';
import providersGet from './commands/providersGet';
import ordersList from './commands/ordersList';
import ordersGet from './commands/ordersGet';
import ordersCancel from './commands/ordersCancel';
import ordersReplenishDeposit from './commands/ordersReplenishDeposit';
import workflowsCreate, { WorkflowCreateParams } from './commands/workflowsCreate';
import Printer from './printer';
import { collectOptions, commaSeparatedList, processSubCommands, validateFields } from './utils';
import generateSolutionKey from './commands/solutionsGenerateKey';
import prepareSolution from './commands/solutionsPrepare';
import ordersDownloadResult from './commands/ordersDownloadResult';
import tokensRequest from './commands/tokensRequest';
import tokensBalance from './commands/tokensBalance';
import offersListTee from './commands/offersListTee';
import offersListValue from './commands/offersListValue';
import offersDownloadContent from './commands/offersDownloadContent';
import { CONFIG_DEFAULT_FILENAME, MAX_ORDERS_RUNNING } from './constants';
import offersGet from './commands/offersGet';
import offersCreate from './commands/offersCreate';
import offersUpdate from './commands/offersUpdate';
import offersGetInfo from './commands/offersGetInfo';
import offersEnable from './commands/offersEnable';
import offersEnableAll from './commands/offersEnableAll';
import offersDisable from './commands/offersDisable';
import offersDisableAll from './commands/offersDisableAll';
import generateTii from './commands/generateTii';
import offersUpdateSlot from './commands/offersUpdateSlot';
import offersAddSlot from './commands/offersAddSlot';
import offersDeleteSlot from './commands/offersDeleteSlot';
import offersAddOption from './commands/offersAddOption';
import offersUpdateOption from './commands/offersUpdateOption';
import offersDeleteOption from './commands/offersDeleteOption';
import offersGetSlot from './commands/offersGetSlot';
import offersGetOption from './commands/offersGetOption';
import { Analytics } from './services/analytics';
import { checkForUpdates } from './services/checkReleaseVersion';
import setup from './commands/setup';
import { workflowGenerateKey } from './commands/workflowsGenerateKey';
import quotesValidate from './commands/quotesValidate';

const packageJson = require('../package.json');

const ORDER_STATUS_KEYS = Object.keys(OrderStatus) as Array<keyof typeof OrderStatus>;
const ORDER_STATUS_MAP: { [Key: string]: OrderStatus } = ORDER_STATUS_KEYS.reduce((acc, key) => {
  acc[key.toLowerCase()] = OrderStatus[key];
  return acc;
}, {} as { [Key: string]: OrderStatus });

async function trackEvent(
  config: Config['analytics'],
  eventType: string,
  userId: string,
  eventProperties?: object,
): Promise<void> {
  const shouldSendAnalytics = config.spaUrl !== '';

  if (shouldSendAnalytics) {
    try {
      const client = new Analytics({
        userId,
        apiUrl: config.spaUrl,
        apiKey: config.spaAuthKey,
      });

      await client.trackEvent(eventType, eventProperties);
    } catch {
      return;
    }
  }
}

async function main(): Promise<void> {
  await ConfigLoader.init();

  const program = new Command();
  program.name(packageJson.name).description(packageJson.description).version(packageJson.version);

  program.hook('preAction', async (_thisCommand, actionCommand) => {
    if (actionCommand.name() === 'setup') {
      return;
    }

    const configPath = actionCommand.opts().config;

    await checkForUpdates(configPath).catch(() => undefined);
  });

  const setupCommand = program.command('setup');
  const providersCommand = program.command('providers');
  const ordersCommand = program.command('orders');
  const workflowsCommand = program.command('workflows');
  const filesCommand = program.command('files');
  const solutionsCommand = program.command('solutions');
  const tiiCommand = program.command('tii');
  const tokensCommand = program.command('tokens');
  const offersCommand = program.command('offers');
  const offersListCommand = offersCommand.command('list');
  const offersGetCommand = offersCommand.command('get');
  const quotesCommand = program.command('quotes');

  setupCommand.description('Setup config.json').action(async (options: any) => {
    const { config } = ConfigLoader.getRawConfig(options.config);

    const defaultConfig = await setup(config);

    ConfigLoader.upsertConfig(options.config, defaultConfig);
  });

  const providersListFields = [
      'address',
      'name',
      'description',
      'authority_account',
      'action_account',
      'modified_date',
    ],
    providersListDefaultFields = ['address', 'name'];
  providersCommand
    .command('list')
    .description('List providers')
    .addOption(
      new Option('--fields <fields>', `Available fields: ${providersListFields.join(', ')}`)
        .argParser(commaSeparatedList)
        .default(providersListDefaultFields, providersListDefaultFields.join(',')),
    )
    .option('--limit <number>', 'Number of records to display', '10')
    .option('--cursor <cursorString>', 'Cursor for pagination')
    .action(async (options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const backend = await configLoader.loadSection('backend');

      validateFields(options.fields, providersGetFields);

      await providersList({
        fields: options.fields,
        backendUrl: backend.url,
        accessToken: backend.accessToken,
        limit: +options.limit,
        cursor: options.cursor,
      });
    });

  const providersGetFields = [
      'address',
      'name',
      'description',
      'authority_account',
      'action_account',
      'modified_date',
    ],
    providersGetDefaultFields = ['name', 'description', 'authority_account', 'action_account'];
  providersCommand
    .command('get')
    .description('Display detailed information on provider with <address>')
    .argument('address', 'Provider address')
    .addOption(
      new Option('--fields <fields>', `Available fields: ${providersListFields.join(', ')}`)
        .argParser(commaSeparatedList)
        .default(providersGetDefaultFields, providersGetDefaultFields.join(',')),
    )
    .action(async (address: string, options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const backend = await configLoader.loadSection('backend');

      validateFields(options.fields, providersGetFields);

      await providersGet({
        fields: options.fields,
        backendUrl: backend.url,
        accessToken: backend.accessToken,
        address,
      });
    });

  ordersCommand
    .command('cancel')
    .description('Cancel order with <id>')
    .argument('<ids...>', 'Order <ids>')
    .option('--debug', 'Display debug information', false)
    .action(async (ids: string[], options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const blockchain = await configLoader.loadSection('blockchain');
      const blockchainConfig = {
        contractAddress: blockchain.smartContractAddress,
        blockchainUrl: blockchain.rpcUrl,
      };
      const wallet = new Wallet(blockchain.accountPrivateKey);
      const userId = wallet.address;
      const requestParams = {
        blockchainConfig,
        actionAccountKey: blockchain.accountPrivateKey,
        ids,
      };
      const analytics = await configLoader.loadSection('analytics');

      try {
        await ordersCancel(requestParams);
        await trackEvent(analytics, 'order_cancel', userId, {
          result: 'success',
          ...requestParams,
        });
      } catch (error) {
        await trackEvent(analytics, 'order_cancel', userId, {
          result: 'error',
          error: (error as Error)?.message || '',
          ...requestParams,
        });
        throw error;
      }
    });

  ordersCommand
    .command('replenish-deposit')
    .description('Replenish order deposit with <id> by <amount>')
    .argument('id', 'Order <id>')
    .argument('amount', 'Amount of tokens')
    .option('--debug', 'Display debug information', false)
    .action(async (id: string, amount: string, options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const blockchain = await configLoader.loadSection('blockchain');
      const blockchainConfig = {
        contractAddress: blockchain.smartContractAddress,
        blockchainUrl: blockchain.rpcUrl,
      };
      const wallet = new Wallet(blockchain.accountPrivateKey);
      const userId = wallet.address;
      const requestParams = {
        blockchainConfig,
        actionAccountKey: blockchain.accountPrivateKey,
        id,
        amount,
      };
      const analytics = await configLoader.loadSection('analytics');

      try {
        await ordersReplenishDeposit(requestParams);
        await trackEvent(analytics, 'replenish_deposit', userId, {
          result: 'success',
          ...requestParams,
        });
      } catch (error) {
        await trackEvent(analytics, 'replenish_deposit', userId, {
          result: 'error',
          error: (error as Error)?.message || '',
          ...requestParams,
        });
        throw error;
      }
    });

  workflowsCommand
    .command('generate-key')
    .description('Generate private key to encrypt order results')
    .action(() => {
      const privateKey = workflowGenerateKey();

      Printer.print(privateKey);
    });

  workflowsCommand
    .command('phrase-to-key')
    .argument('mnemonicPhrase', 'Mnemonic phrase <mnemonicPhrase>')
    .description('Create workflow private key from mnemonic phrase')
    .action((mnemonicPhrase: string) => {
      const entropy = bip39.mnemonicToEntropy(mnemonicPhrase);

      Printer.print(Buffer.from(entropy, 'hex').toString('base64'));
    });

  workflowsCommand
    .command('key-to-phrase')
    .description('Show your workflows private key as mnemonic phrase to use on Marketplace')
    .option('--key <key>', 'Key in base64 format <key>')
    .action(async (options: any) => {
      let keyToPhrase: string;
      if (options.key) {
        keyToPhrase = options.key;
      } else {
        const configLoader = new ConfigLoader(options.config);
        const workflowConfig = await configLoader.loadSection('workflow');
        keyToPhrase = workflowConfig.resultEncryption.key!;
      }

      const privateKey = Buffer.from(keyToPhrase, Encoding.base64);
      const mnemonic = bip39.entropyToMnemonic(privateKey);

      Printer.print(mnemonic);
    });

  workflowsCommand
    .command('create')
    .description('Create workflow')
    .option('--tee <id,slot>', 'TEE offer <id,slot> (required)')
    .option('--tee-slot-count <id>', 'TEE slot count')
    .option(
      '--tee-options <id...>',
      'TEE options <id> (accepts multiple values)',
      collectOptions,
      [],
    )
    .option(
      '--tee-options-count <value...>',
      'TEE options count <id> (accepts multiple values)',
      collectOptions,
      [],
    )
    .requiredOption('--storage <id,slot>', 'Storage offer <id> (required)')
    .requiredOption(
      '--solution <id,slot> --solution <filepath>',
      'Solution offer <id,slot> or resource file path (required and accepts multiple values)',
      collectOptions,
      [],
    )
    .option(
      '--data <id,slot> --data <filepath>',
      'Data offer <id,slot> or resource file path (accepts multiple values)',
      collectOptions,
      [],
    )
    .option(
      '--deposit <TEE>',
      'Amount of the payment deposit in TEE tokens (if not specified, the minimum deposit required is used)',
    )
    .option('--min-rent-minutes <number>', 'Minutes of TEE processing that will be paid in advance')
    .option('--debug', 'Display debug information', false)
    .addOption(
      new Option('--workflow-number <number>', 'Number of workflows to create')
        .default(1)
        .hideHelp(),
    )
    .addOption(
      new Option('--orders-limit <number>', 'Override default orders limit per user')
        .default(MAX_ORDERS_RUNNING)
        .hideHelp(),
    )
    .action(async (options: any) => {
      if (!options.solution.length) {
        Printer.error(
          "error: required option '--solution <id> --solution <filepath>' not specified",
        );
        return;
      }

      const configLoader = new ConfigLoader(options.config);
      const backend = await configLoader.loadSection('backend');
      const blockchain = await configLoader.loadSection('blockchain');
      const blockchainConfig = {
        contractAddress: blockchain.smartContractAddress,
        blockchainUrl: blockchain.rpcUrl,
      };
      const { pccsServiceApiUrl } = await configLoader.loadSection('tii');
      const workflowConfig = await configLoader.loadSection('workflow');
      const wallet = new Wallet(blockchain.accountPrivateKey);
      const userId = wallet.address;
      const requestParams: WorkflowCreateParams = {
        backendUrl: backend.url,
        accessToken: backend.accessToken,
        blockchainConfig,
        actionAccountKey: blockchain.accountPrivateKey,
        tee: options.tee,
        teeSlotCount: Number(options.teeSlotCount || 0),
        teeOptionsIds: options.teeOptions,
        teeOptionsCount: options.teeOptionsCount?.map((count: string) => Number(count)),
        storage: options.storage,
        solution: options.solution,
        data: options.data,
        resultEncryption: workflowConfig.resultEncryption,
        userDepositAmount: options.deposit,
        minRentMinutes: Number(options.minRentMinutes || 0),
        workflowNumber: Number(options.workflowNumber),
        ordersLimit: Number(options.ordersLimit),
        pccsServiceApiUrl,
      };
      const analytics = await configLoader.loadSection('analytics');

      try {
        const id = await workflowsCreate(requestParams);
        await trackEvent(analytics, 'order_created', userId, {
          id,
          ...requestParams,
        });
      } catch (error) {
        await trackEvent(analytics, 'order_create', userId, {
          result: 'error',
          error: (error as Error)?.message || '',
          ...requestParams,
        });
        throw error;
      }
    });

  const ordersListFields = [
      'id',
      'offer_name',
      'offer_description',
      'type',
      'status',
      'offer_id',
      'consumer_address',
      'parent_order_id',
      'total_deposit',
      'total_unspent_deposit',
      'deposit',
      'unspent_deposit',
      'cancelable',
      'sub_orders_count',
      'modified_date',
    ],
    ordersListDefaultFields = ['id', 'offer_name', 'status'],
    ordersListOfferTypes = {
      tee: OfferType.TeeOffer,
      storage: OfferType.Storage,
      solution: OfferType.Solution,
      data: OfferType.Data,
    };
  ordersCommand
    .command('list')
    .description('List orders')
    .addOption(
      new Option('--fields <fields>', `Available fields: ${ordersListFields.join(', ')}`)
        .argParser(commaSeparatedList)
        .default(ordersListDefaultFields, ordersListDefaultFields.join(',')),
    )
    .option(
      '--my-account',
      'Only show orders that were created by the action account specified in the config file',
      false,
    )
    .addOption(
      new Option('--type <type>', 'Only show orders of the specified type').choices(
        Object.keys(ordersListOfferTypes),
      ),
    )
    .option('--limit <number>', 'Number of records to display', '10')
    .option('--cursor <cursorString>', 'Cursor for pagination')
    .addOption(
      new Option('--offers <string>', "Offer's ids separated by comma").argParser(
        commaSeparatedList,
      ),
    )
    .addOption(
      new Option(
        '--status <string>',
        `Order's status. Supported statuses: ${Object.keys(ORDER_STATUS_MAP).join()}`,
      ).argParser((value) => {
        const val = value.toLowerCase().trim();
        return Object.keys(ORDER_STATUS_MAP).includes(val) ? [val] : [];
      }),
    )
    .action(async (options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const backend = await configLoader.loadSection('backend');

      let actionAccountKey;
      if (options.myAccount) {
        actionAccountKey = (await configLoader.loadSection('blockchain')).accountPrivateKey;
      }

      validateFields(options.fields, ordersListFields);

      await ordersList({
        fields: options.fields,
        backendUrl: backend.url,
        accessToken: backend.accessToken,
        limit: +options.limit,
        cursor: options.cursor,
        actionAccountKey,
        offerType: ordersListOfferTypes[options.type as keyof typeof ordersListOfferTypes],
        ...(options.offers && { offerIds: options.offers }),
        ...(options.status && { status: ORDER_STATUS_MAP[options.status] }),
      });
    });

  const ordersGetFields = [
      'id',
      'offer_name',
      'offer_description',
      'type',
      'status',
      'offer_id',
      'consumer_address',
      'parent_order_id',
      'total_deposit',
      'total_unspent_deposit',
      'deposit',
      'unspent_deposit',
      'cancelable',
      'modified_date',
    ],
    ordersGetDefaultFields = [
      'offer_name',
      'offer_description',
      'type',
      'status',
      'total_deposit',
      'total_unspent_deposit',
      'modified_date',
    ],
    subOrdersGetFields = [
      'id',
      'offer_name',
      'offer_description',
      'type',
      'status',
      'cancelable',
      'actual_cost',
      'modified_date',
    ],
    subOrdersGetDefaultFields = [
      'id',
      'offer_name',
      'offer_description',
      'type',
      'status',
      'modified_date',
    ];
  ordersCommand
    .command('get')
    .description('Display detailed information on order with <id>')
    .argument('id', 'Order <id>')
    .addOption(
      new Option('--fields <fields>', `Available fields: ${ordersGetFields.join(', ')}`)
        .argParser(commaSeparatedList)
        .default(ordersGetDefaultFields, ordersGetDefaultFields.join(',')),
    )
    .option('--suborders', 'Show sub-orders', false)
    .addOption(
      new Option(
        '--suborders_fields <fields>',
        `Sub-order available fields: ${subOrdersGetFields.join(', ')}`,
      )
        .argParser(commaSeparatedList)
        .default(subOrdersGetDefaultFields, subOrdersGetDefaultFields.join(',')),
    )
    .action(async (id: string, options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const backend = await configLoader.loadSection('backend');

      validateFields(options.fields, ordersGetFields);
      if (options.suborders) validateFields(options.suborders_fields, subOrdersGetFields);

      await ordersGet({
        fields: options.fields,
        subOrdersFields: options.suborders ? options.suborders_fields : [],
        backendUrl: backend.url,
        accessToken: backend.accessToken,
        id,
      });
    });

  ordersCommand
    .command('download-result')
    .description('Download result of order with <id>')
    .argument('id', 'Order <id>')
    .option('--save-to <path>', 'Path to save the result')
    .option('--debug', 'Display debug information', false)
    .action(async (orderId: string, options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const workflowConfig = await configLoader.loadSection('workflow');
      const blockchain = await configLoader.loadSection('blockchain');
      const blockchainConfig = {
        contractAddress: blockchain.smartContractAddress,
        blockchainUrl: blockchain.rpcUrl,
      };
      const wallet = new Wallet(blockchain.accountPrivateKey);
      const userId = wallet.address;
      const requestParams = {
        blockchainConfig,
        orderId,
        localPath: options.saveTo,
        resultDecryptionKey: workflowConfig.resultEncryption.key!,
      };
      const analytics = await configLoader.loadSection('analytics');

      try {
        await ordersDownloadResult(requestParams);
        await trackEvent(analytics, 'order_result_download', userId, {
          result: 'success',
          ...requestParams,
        });
      } catch (error) {
        await trackEvent(analytics, 'order_result_download', userId, {
          result: 'error',
          error: (error as Error)?.message || '',
          ...requestParams,
        });
        throw error;
      }
    });

  tokensCommand
    .command('request')
    .description('Request tokens for the account')
    .option('--matic', 'Request Polygon Mumbai MATIC tokens', false)
    .option('--tee', 'Request Super Protocol TEE tokens', false)
    .option('--debug', 'Display debug information', false)
    .action(async (options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const blockchain = await configLoader.loadSection('blockchain');
      const backend = await configLoader.loadSection('backend');
      const wallet = new Wallet(blockchain.accountPrivateKey);
      const userId = wallet.address;
      const requestParams = {
        backendUrl: backend.url,
        accessToken: backend.accessToken,
        actionAccountPrivateKey: blockchain.accountPrivateKey,
        requestMatic: options.matic,
        requestTee: options.tee,
      };
      const analytics = await configLoader.loadSection('analytics');

      try {
        await tokensRequest(requestParams);
        if (options.tee) {
          await trackEvent(analytics, 'get_tee', userId, {
            result: 'success',
            ...requestParams,
          });
        }
        if (options.matic) {
          await trackEvent(analytics, 'get_matic', userId, {
            result: 'success',
            ...requestParams,
          });
        }
      } catch (error) {
        if (options.tee) {
          await trackEvent(analytics, 'get_tee', userId, {
            result: 'error',
            error: (error as Error)?.message || '',
            ...requestParams,
          });
        }
        if (options.matic) {
          await trackEvent(analytics, 'get_matic', userId, {
            result: 'error',
            error: (error as Error)?.message || '',
            ...requestParams,
          });
        }
        throw error;
      }
    });

  tokensCommand
    .command('balance')
    .description('Display the token balance of the account')
    .action(async (options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const blockchain = await configLoader.loadSection('blockchain');
      const blockchainConfig = {
        contractAddress: blockchain.smartContractAddress,
        blockchainUrl: blockchain.rpcUrl,
      };

      await tokensBalance({
        blockchainConfig,
        actionAccountPrivateKey: blockchain.accountPrivateKey,
      });
    });

  const offersListTeeFields = [
      'id',
      'name',
      'description',
      'provider_address',
      'provider_name',
      'total_cores',
      'free_cores',
      'orders_in_queue',
      'cancelable',
      'modified_date',
      'enabled',
    ],
    offersListTeeDefaultFields = ['id', 'name', 'orders_in_queue'];
  offersListCommand
    .command('tee')
    .description('List TEE offers')
    .addOption(
      new Option('--fields <fields>', `Available fields: ${offersListTeeFields.join(', ')}`)
        .argParser(commaSeparatedList)
        .default(offersListTeeDefaultFields, offersListTeeDefaultFields.join(',')),
    )
    .option('--limit <number>', 'Number of records to display', '10')
    .option('--cursor <cursorString>', 'Cursor for pagination')
    .action(async (options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const backend = await configLoader.loadSection('backend');

      validateFields(options.fields, offersListTeeFields);

      await offersListTee({
        fields: options.fields,
        backendUrl: backend.url,
        accessToken: backend.accessToken,
        limit: +options.limit,
        cursor: options.cursor,
      });
    });

  const offersListValueFields = [
      'id',
      'name',
      'description',
      'type',
      'provider_address',
      'provider_name',
      'cancelable',
      'depends_on_offers',
      'modified_date',
      'enabled',
    ],
    offersListValueDefaultFields = ['id', 'name', 'type'];
  offersListCommand
    .command('value')
    .description('List value offers')
    .addOption(
      new Option('--fields <fields>', `Available fields: ${offersListValueFields.join(', ')}`)
        .argParser(commaSeparatedList)
        .default(offersListValueDefaultFields, offersListValueDefaultFields.join(',')),
    )
    .option('--limit <number>', 'Number of records to display', '10')
    .option('--cursor <cursorString>', 'Cursor for pagination')
    .action(async (options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const backend = await configLoader.loadSection('backend');

      validateFields(options.fields, offersListValueFields);

      await offersListValue({
        fields: options.fields,
        backendUrl: backend.url,
        accessToken: backend.accessToken,
        limit: +options.limit,
        cursor: options.cursor,
      });
    });

  const teeOffersGetFields = [
    'name',
    'description',
    'provider_address',
    'provider_name',
    'total_cores',
    'free_cores',
    'orders_in_queue',
    'cancelable',
    'modified_date',
    'slots',
    'enabled',
  ];
  offersGetCommand
    .command('tee')
    .description('Display detailed information on TEE offer with <id>')
    .argument('id', 'Offer id')
    .addOption(
      new Option('--fields <fields>', `Available fields: ${teeOffersGetFields.join(', ')}`)
        .argParser(commaSeparatedList)
        .default(teeOffersGetFields, teeOffersGetFields.join(',')),
    )
    .action(async (id: string, options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const backend = await configLoader.loadSection('backend');

      validateFields(options.fields, teeOffersGetFields);

      await offersGet({
        fields: options.fields,
        backendUrl: backend.url,
        type: 'tee',
        accessToken: backend.accessToken,
        id,
      });
    });

  const offersGetFields = [
    'provider_address',
    'name',
    'description',
    'type',
    'cancelable',
    'provider_name',
    'depends_on_offers',
    'modified_date',
    'slots',
    'enabled',
  ];
  offersGetCommand
    .command('value')
    .description('Display detailed information on value offer with <id>')
    .argument('id', 'Offer id')
    .addOption(
      new Option('--fields <fields>', `Available fields: ${offersGetFields.join(', ')}`)
        .argParser(commaSeparatedList)
        .default(offersGetFields, offersGetFields.join(',')),
    )
    .action(async (id: string, options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const backend = await configLoader.loadSection('backend');

      validateFields(options.fields, offersGetFields);

      await offersGet({
        fields: options.fields,
        backendUrl: backend.url,
        type: 'value',
        accessToken: backend.accessToken,
        id,
      });
    });

  offersCommand
    .command('get-info')
    .description('Get offer info property')
    .addArgument(new Argument('type', 'Offer <type>').choices(['tee', 'value']))
    .argument('id', 'Offer id')
    .option('--save-to <filepath>', 'Save result to a file')
    .action(async (type: 'tee' | 'value', id: string, options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const backend = await configLoader.loadSection('backend');

      await offersGetInfo({
        backendUrl: backend.url,
        accessToken: backend.accessToken,
        type,
        saveTo: options.saveTo,
        id,
      });
    });

  offersCommand
    .command('download-content')
    .description(
      'Download the content of an offer with <id> (only for offers that allows this operation)',
    )
    .argument('id', 'Offer id')
    .option('--save-to <path>', 'Directory to save the content to', './')
    .action(async (offerId: string, options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const blockchain = await configLoader.loadSection('blockchain');
      const blockchainConfig = {
        contractAddress: blockchain.smartContractAddress,
        blockchainUrl: blockchain.rpcUrl,
      };

      await offersDownloadContent({
        blockchainConfig,
        offerId,
        localDir: options.saveTo,
      });
    });

  offersCommand
    .command('create')
    .description('Create offer')
    .addArgument(new Argument('type', 'Offer <type>').choices(['tee', 'value']))
    .option('--path <filepath>', 'path to offer info json file', './offerInfo.json')
    .action(async (type: 'tee' | 'value', options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const blockchain = await configLoader.loadSection('blockchain');
      const blockchainConfig = {
        contractAddress: blockchain.smartContractAddress,
        blockchainUrl: blockchain.rpcUrl,
      };
      const authorityAccountKey = blockchain.authorityAccountPrivateKey;
      const actionAccountKey = blockchain.accountPrivateKey;

      await offersCreate({
        type,
        blockchainConfig,
        authorityAccountKey,
        actionAccountKey,
        offerInfoPath: options.path,
      });
    });

  offersCommand
    .command('update')
    .description('Update offer info')
    .addArgument(new Argument('type', 'Offer <type>').choices(['tee', 'value']))
    .argument('id', 'Offer <id>')
    .requiredOption('--path <filepath>', 'path to offer info', './offerInfo.json')
    .action(async (type: 'tee' | 'value', id: string, options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const blockchain = await configLoader.loadSection('blockchain');
      const blockchainConfig = {
        contractAddress: blockchain.smartContractAddress,
        blockchainUrl: blockchain.rpcUrl,
      };
      const actionAccountKey = blockchain.accountPrivateKey;

      await offersUpdate({
        id,
        type,
        actionAccountKey,
        blockchainConfig,
        offerInfoPath: options.path,
      });
    });

  offersCommand
    .command('enable')
    .description('Enable offer')
    .argument('id', 'Offer <id>')
    .action(async (id: string, options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const blockchain = await configLoader.loadSection('blockchain');
      const blockchainConfig = {
        contractAddress: blockchain.smartContractAddress,
        blockchainUrl: blockchain.rpcUrl,
      };
      const actionAccountKey = blockchain.accountPrivateKey;

      await offersEnable({
        id,
        blockchainConfig,
        actionAccountKey,
      });
    });

  offersCommand
    .command('disable')
    .description('Disable offer')
    .argument('id', 'Offer <id>')
    .action(async (id: string, options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const blockchain = await configLoader.loadSection('blockchain');
      const blockchainConfig = {
        contractAddress: blockchain.smartContractAddress,
        blockchainUrl: blockchain.rpcUrl,
      };
      const actionAccountKey = blockchain.accountPrivateKey;

      await offersDisable({
        id,
        blockchainConfig,
        actionAccountKey,
      });
    });

  offersCommand
    .command('enable-all', { hidden: true })
    .description("Enable all providers' offers")
    .requiredOption('--by-providers <filepath>', 'path to providers list', './providers.json')
    .action(async (options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const blockchain = await configLoader.loadSection('blockchain');
      const blockchainConfig = {
        contractAddress: blockchain.smartContractAddress,
        blockchainUrl: blockchain.rpcUrl,
      };

      await offersEnableAll({
        blockchainConfig,
        providersPath: options.byProviders,
      });
    });

  offersCommand
    .command('disable-all', { hidden: true })
    .description("Disables all providers' offers")
    .requiredOption('--by-providers <filepath>', 'path to providers list', './providers.json')
    .action(async (options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const blockchain = await configLoader.loadSection('blockchain');
      const blockchainConfig = {
        contractAddress: blockchain.smartContractAddress,
        blockchainUrl: blockchain.rpcUrl,
      };

      await offersDisableAll({
        blockchainConfig,
        providersPath: options.byProviders,
      });
    });

  offersCommand
    .command('get-slot')
    .description('Get slot by id')
    .addArgument(new Argument('type', 'Offer <type>').choices(['tee', 'value']))
    .requiredOption('--offer <id>', 'Offer <id>')
    .requiredOption('--slot <id>', 'Slot <id>')
    .option('--save-to <filepath>', 'Save result to a file')
    .action(async (type: 'tee' | 'value', options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const backend = await configLoader.loadSection('backend');

      await offersGetSlot({
        backendUrl: backend.url,
        accessToken: backend.accessToken,
        type,
        offerId: options.offer,
        slotId: options.slot,
        saveTo: options.saveTo,
      });
    });

  offersCommand
    .command('add-slot')
    .description('Add slot to offer')
    .addArgument(new Argument('type', 'Offer <type>').choices(['tee', 'value']))
    .requiredOption('--offer <id>', 'Offer <id>')
    .requiredOption('--path <filepath>', 'path to offer info', './offerSlot.json')
    .action(async (type: 'tee' | 'value', options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const blockchain = await configLoader.loadSection('blockchain');
      const blockchainConfig = {
        contractAddress: blockchain.smartContractAddress,
        blockchainUrl: blockchain.rpcUrl,
      };
      const actionAccountKey = blockchain.accountPrivateKey;

      await offersAddSlot({
        blockchainConfig,
        actionAccountKey,
        type,
        offerId: options.offer,
        slotPath: options.path,
      });
    });

  offersCommand
    .command('update-slot')
    .description('Add slot to offer')
    .addArgument(new Argument('type', 'Offer <type>').choices(['tee', 'value']))
    .requiredOption('--offer <id>', 'Offer <id>')
    .requiredOption('--slot <id>', 'Slot <id>')
    .requiredOption('--path <filepath>', 'path to offer info', './slotInfo.json')
    .action(async (type: 'tee' | 'value', options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const blockchain = await configLoader.loadSection('blockchain');
      const blockchainConfig = {
        contractAddress: blockchain.smartContractAddress,
        blockchainUrl: blockchain.rpcUrl,
      };
      const actionAccountKey = blockchain.accountPrivateKey;

      await offersUpdateSlot({
        blockchainConfig,
        actionAccountKey,
        type,
        offerId: options.offer,
        slotId: options.slot,
        slotPath: options.path,
      });
    });

  offersCommand
    .command('delete-slot')
    .description('Delete slot by id')
    .addArgument(new Argument('type', 'Offer <type>').choices(['tee', 'value']))
    .requiredOption('--offer <id>', 'Offer <id>')
    .requiredOption('--slot <id>', 'Slot <id>')
    .action(async (type: 'tee' | 'value', options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const blockchain = await configLoader.loadSection('blockchain');
      const blockchainConfig = {
        contractAddress: blockchain.smartContractAddress,
        blockchainUrl: blockchain.rpcUrl,
      };
      const actionAccountKey = blockchain.accountPrivateKey;

      await offersDeleteSlot({
        blockchainConfig,
        actionAccountKey,
        type,
        offerId: options.offer,
        slotId: options.slot,
      });
    });

  offersCommand
    .command('get-option')
    .description('Get option by id (TEE offers only)')
    .requiredOption('--offer <id>', 'Offer <id>')
    .requiredOption('--option <id>', 'Option <id>')
    .option('--save-to <filepath>', 'Save result to a file')
    .action(async (options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const backend = await configLoader.loadSection('backend');

      await offersGetOption({
        backendUrl: backend.url,
        accessToken: backend.accessToken,
        offerId: options.offer,
        optionId: options.option,
        saveTo: options.saveTo,
      });
    });

  offersCommand
    .command('add-option')
    .description('Add option to offer (TEE offers only)')
    .requiredOption('--offer <id>', 'Offer <id>')
    .requiredOption('--path <filepath>', 'path to option info', './offerOption.json')
    .action(async (options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const blockchain = await configLoader.loadSection('blockchain');
      const blockchainConfig = {
        contractAddress: blockchain.smartContractAddress,
        blockchainUrl: blockchain.rpcUrl,
      };
      const actionAccountKey = blockchain.accountPrivateKey;

      await offersAddOption({
        blockchainConfig,
        actionAccountKey,
        offerId: options.offer,
        optionPath: options.path,
      });
    });

  offersCommand
    .command('update-option')
    .description('Update option by id (TEE offers only)')
    .requiredOption('--offer <id>', 'Offer <id>')
    .requiredOption('--option <id>', 'Offer <id>')
    .requiredOption('--path <filepath>', 'path to option info', './offerOption.json')
    .action(async (options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const blockchain = await configLoader.loadSection('blockchain');
      const blockchainConfig = {
        contractAddress: blockchain.smartContractAddress,
        blockchainUrl: blockchain.rpcUrl,
      };
      const actionAccountKey = blockchain.accountPrivateKey;

      await offersUpdateOption({
        blockchainConfig,
        actionAccountKey,
        offerId: options.offer,
        optionId: options.option,
        optionPath: options.path,
      });
    });

  offersCommand
    .command('delete-option')
    .description('Delete option to id (TEE offers only)')
    .requiredOption('--offer <id>', 'Offer <id>')
    .requiredOption('--path <filepath>', 'path to option info', './offerOption.json')
    .action(async (options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const blockchain = await configLoader.loadSection('blockchain');
      const blockchainConfig = {
        contractAddress: blockchain.smartContractAddress,
        blockchainUrl: blockchain.rpcUrl,
      };
      const actionAccountKey = blockchain.accountPrivateKey;

      await offersDeleteOption({
        blockchainConfig,
        actionAccountKey,
        offerId: options.offer,
        optionId: options.option,
      });
    });

  filesCommand
    .command('upload')
    .description('Upload a file specified by the <localPath> argument to the remote storage')
    .argument('localPath', 'Path to a file for uploading')
    .option('--filename <string>', 'The name of the resulting file in the storage')
    .option(
      '--output <path>',
      'Path to save resource file that is used to access the uploaded file',
      './resource.json',
    )
    .option('--skip-encryption', 'Skip file encryption before upload')
    .option('--metadata <path>', 'Path to a metadata file for adding fields to the resource file')
    .option(
      '--maximum-concurrent <number>',
      'Maximum concurrent pieces to upload at once per transfer',
    )
    .action(async (localPath: string, options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const storage = await configLoader.loadSection('storage');

      await upload({
        localPath,
        storageType: storage.type,
        writeAccessToken: storage.writeAccessToken,
        readAccessToken: storage.readAccessToken,
        bucket: storage.bucket,
        prefix: storage.prefix,
        remotePath: options.filename,
        outputPath: options.output,
        metadataPath: options.metadata,
        withEncryption: !options.skipEncryption,
        maximumConcurrent: options.maximumConcurrent,
      });
    });

  filesCommand
    .command('download')
    .description(
      'Download and decrypt a file from the remote storage to <localPath> using resource file <resourcePath>',
    )
    .argument('resourcePath', 'Path to a resource file')
    .argument('localDirectory', 'Path to save downloaded file')
    .action(async (resourcePath: string, localDirectory: string) => {
      await download({
        resourcePath,
        localDirectory,
      });
    });

  filesCommand
    .command('delete')
    .description('Delete a file in the remote storage using resource file <resourcePath>')
    .argument('resourcePath', 'Path to a resource file')
    .action(async (resourcePath: string, options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const storage = await configLoader.loadSection('storage');

      await filesDelete({
        resourcePath,
        writeAccessToken: storage.writeAccessToken,
      });
    });

  solutionsCommand
    .command('generate-key')
    .description('Generate a solution signing key')
    .argument('outputPath', 'Path to save a key file')
    .action(async (outputPath: string) => {
      await generateSolutionKey({ outputPath });
    });

  solutionsCommand
    .command('prepare')
    .description('Prepare a solution for deployment')
    .argument('solutionPath', 'Path to a solution folder')
    .argument('solutionKeyPath', 'Path to a key file')
    .option(
      '--metadata <pathToSave>',
      'Path to save json metadata (hash and MrEnclave)',
      './metadata.json',
    )
    .option('--pack-solution <packSolution>', 'Path to save the resulting tar.gz archive', '')
    .option(
      '--base-image-path <pathToContainerImage>',
      'Path to a container image file (required if no --base-image-resource specified)',
      '',
    )
    .option(
      '--base-image-resource <containerImageResource>',
      'Path to a container image resource file (required if no --base-image-path specified)',
      '',
    )
    .option(
      '--write-default-manifest',
      'Write the default manifest for solutions with empty sgxMrEnclave',
      false,
    )
    .option('--env <envs...>', 'List of env variabeles to set into solution manifest')
    .option(
      '--hash-algo <solutionHashAlgo>',
      'Hash calculation algorithm for solution',
      HashAlgorithm.SHA256,
    )
    .option('--sgx-max-threads <maxThreads>', 'Number of maximum threads. Gramine 1.4 option', '')
    .option(
      '--sgx-enclave-size <enclaveSize>',
      'Entire enclave size (#M or #G), must be a value to the power of 2',
      '',
    )
    .option(
      '--sgx-loader-internal-size <internalSize>',
      'Size of the internal enclave structs (#M or #G)',
      '',
    )
    .option('--sgx-stack-size <stackSize>', 'Size of the enclave thread stack (#K, #M or #G)', '')
    .action(async (solutionPath: string, solutionKeyPath: string, options: any) => {
      await prepareSolution({
        metadataPath: options.metadata,
        solutionHashAlgo: options.hashAlgo,
        solutionPath,
        solutionOutputPath: options.packSolution,
        keyPath: solutionKeyPath,
        baseImagePath: options.baseImagePath,
        baseImageResource: options.baseImageResource,
        loaderPalInternalMemSize: options.sgxLoaderInternalSize,
        sgxEnclaveSize: options.sgxEnclaveSize,
        sgxMaxThreads: options.sgxMaxThreads,
        sysStackSize: options.sgxStackSize,
        writeDefaultManifest: options.writeDefaultManifest,
        envs: options.env || [],
      });
    });

  tiiCommand
    .command('generate')
    .description('Generate TII')
    .argument('resourcePath', 'Path to a resource of an uploaded file')
    .requiredOption('--offer <id>', 'TEE offer id')
    .option('--output <path>', 'Path to write the result into', 'tii.json')
    .action(async (resourcePath: string, options: any) => {
      const configLoader = new ConfigLoader(options.config);
      const blockchain = await configLoader.loadSection('blockchain');
      const blockchainConfig = {
        contractAddress: blockchain.smartContractAddress,
        blockchainUrl: blockchain.rpcUrl,
      };
      const { pccsServiceApiUrl } = await configLoader.loadSection('tii');

      await generateTii({
        blockchainConfig,
        teeOfferId: options.offer,
        resourcePath: resourcePath,
        outputPath: options.output,
        pccsServiceApiUrl,
      });
    });

  quotesCommand
    .command('validate')
    .description('Validate a quote')
    .argument(
      'url',
      'a valid URL with only the domain, excluding any path, for instance, https://ugli-etch-vic.superprotocol.io',
    )
    .action(async (url: string, options: { config: string }) => {
      const configLoader = new ConfigLoader(options.config);
      const backend = configLoader.loadSection('backend');
      const { pccsServiceApiUrl } = configLoader.loadSection('tii');

      await quotesValidate({ url, pccsServiceApiUrl, backend });
    });

  // Add global options
  processSubCommands(program, (command) => {
    command.addHelpCommand('help', 'Display help for the command');
    command.helpOption('-h, --help', 'Display help for the command');
    if (!command.commands.length) {
      command.option(
        '--config <configPath>',
        'Path to the configuration file',
        `${CONFIG_DEFAULT_FILENAME}`,
      );
    }
  });

  await program.parseAsync(process.argv);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    const isSilent = error.isSilent;
    const message = error.message;

    if (isSilent || error.hasCustomMessage) error = error.error;
    if (!isSilent) Printer.error('Error occurred during execution');

    const errorLogPath = path.join(process.cwd(), 'error.log');
    const errorDetails = JSON.stringify(error, null, 2);
    const currentTimestamp = new Date().toISOString();
    fs.writeFileSync(
      errorLogPath,
      `${currentTimestamp}: ${error.stack}\n\n` +
        (errorDetails != '{}' ? `Details:\n ${errorDetails}\n` : ''),
    );

    if (!isSilent) {
      Printer.error(`Error log was saved to ${errorLogPath}`);
      if (message) Printer.error(message);
      process.exit(1);
    } else {
      process.exit(0);
    }
  });

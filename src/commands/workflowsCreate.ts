import {
  EncryptionKey,
  Hash,
  RIIType,
  RuntimeInputInfo,
  TeeOrderEncryptedArgs,
  TeeOrderEncryptedArgsConfiguration,
} from '@super-protocol/dto-js';
import {
  Analytics,
  AnalyticsEvent,
  Config as BlockchainConfig,
  constants,
  helpers,
  OfferType,
  Offer,
  Orders,
  OrderStatus,
  RIGenerator,
  TIIGenerator,
} from '@super-protocol/sdk-js';
import { Config } from '../config';
import { MINUTES_IN_HOUR } from '../constants';
import { TOfferType } from '../gql';
import Printer from '../printer';
import { AnalyticEvent, IEventProperties, IOrderEventProperties } from '../services/analytics';
import approveTeeTokens from '../services/approveTeeTokens';
import automatchTeeSlot from '../services/automatchTeeSlot';
import calcWorkflowDepositService from '../services/calcWorkflowDeposit';
import createWorkflowService, { ValueOfferParams } from '../services/createWorkflow';
import fetchConfigurationErrors from '../services/fetchConfigurationErrors';
import fetchOrdersCountService from '../services/fetchOrdersCount';
import fetchTeeOffers from '../services/fetchTeeOffers';
import initBlockchainConnectorService from '../services/initBlockchainConnector';
import parseInputResourcesService from '../services/parseInputResources';
import readJsonFile from '../services/readJsonFile';
import { ResourceFile } from '../services/readResourceFile';
import validateOfferWorkflowService from '../services/validateOfferWorkflow';
import {
  calculateValueOffersMinTimeMinutes,
  checkFetchedOffers,
  checkSlot,
  divideImagesAndSolutions,
  FetchedOffer,
  getFetchedOffers,
  getHoldDeposit,
} from '../services/workflowHelpers';
import { findFirstPrimaryToken, findTokenBySymbol, formatTeeOptions, getObjectKey } from '../utils';

export type WorkflowCreateParams = {
  analytics?: Analytics<AnalyticsEvent> | null;
  backendUrl: string;
  accessToken: string;
  blockchainConfig: BlockchainConfig;
  actionAccountKey: string;
  tee?: string;
  teeSlotCount?: number;
  teeOptionsIds: string[];
  teeOptionsCount: number[];
  storage: string;
  solution: string[];
  solutionHash: Hash;
  data: string[];
  solutionConfigurationPath?: string;
  dataConfigurationPaths: string[];
  resultEncryption: EncryptionKey;
  userDepositAmount: string;
  minRentMinutes: number;
  workflowNumber: number;
  ordersLimit: number;
  skipHardwareCheck: boolean;
  pccsServiceApiUrl: string;
  storageAccess: Config['storage'];
};

const buildConfiguration = async (params: {
  solutionConfigPath: string;
  dataConfigurationPaths: string[];
}): Promise<TeeOrderEncryptedArgsConfiguration> => {
  Printer.print('The configuration is used');
  const [solution, ...data] = await Promise.all([
    readJsonFile({ path: params.solutionConfigPath }),
    ...params.dataConfigurationPaths.map((path) => readJsonFile({ path })),
  ]);

  return {
    solution,
    data,
  };
};

export type WorkflowCreateCommandParams = WorkflowCreateParams & { tokenSymbol?: string };

const workflowCreate = async (params: WorkflowCreateCommandParams): Promise<string | void> => {
  if (params.dataConfigurationPaths.length && !params.solutionConfigurationPath) {
    throw new Error(
      'Invalid solution-configuration param. It must be specified if at least one data-configuration param is provided.',
    );
  }

  Printer.print('Connecting to the blockchain');
  const consumerAddress = await initBlockchainConnectorService({
    blockchainConfig: params.blockchainConfig,
    actionAccountKey: params.actionAccountKey,
  });

  const token = params.tokenSymbol
    ? await findTokenBySymbol(params.tokenSymbol)
    : await findFirstPrimaryToken();

  const ordersCount = await fetchOrdersCountService({
    backendUrl: params.backendUrl,
    accessToken: params.accessToken,
    includeStatuses: [OrderStatus.New, OrderStatus.Processing],
    consumer: consumerAddress!,
    offerType: TOfferType.TeeOffer,
  });

  if (params.workflowNumber === 1 && ordersCount >= params.ordersLimit) {
    throw new Error(
      `You have reached a limit on the number of active orders: ${params.ordersLimit}\nThis restriction was introduced temporarily due to the limited computing resources available during the Testnet phase`,
    );
  }

  const tee: ValueOfferParams = params.tee
    ? await parseInputResourcesService({
        options: [params.tee],
        backendUrl: params.backendUrl,
        accessToken: params.accessToken,
        isTee: true,
      }).then(({ offers }) => offers[0])
    : { id: '', slotId: '' };

  const storage = await parseInputResourcesService({
    options: [params.storage],
    backendUrl: params.backendUrl,
    accessToken: params.accessToken,
    minRentMinutes: params.minRentMinutes,
  }).then(({ offers }) => offers[0]);

  let solutions = await parseInputResourcesService({
    options: params.solution,
    backendUrl: params.backendUrl,
    accessToken: params.accessToken,
    minRentMinutes: params.minRentMinutes,
  });
  const divideImagesAndSolutionResult = await divideImagesAndSolutions(solutions);
  solutions = divideImagesAndSolutionResult.solutions;
  const images = divideImagesAndSolutionResult.images;

  const solutionIds = solutions.offers.map((offer) => offer.id);

  const data = await parseInputResourcesService({
    options: params.data,
    backendUrl: params.backendUrl,
    accessToken: params.accessToken,
    minRentMinutes: params.minRentMinutes,
  });
  const dataIds = data.offers.map((offer) => offer.id);

  const valueOfferIds = [...solutionIds, ...dataIds, storage.id];

  const fetchedValueOffers = await getFetchedOffers({
    backendUrl: params.backendUrl,
    accessToken: params.accessToken,
    limit: valueOfferIds.length,
    ids: valueOfferIds,
  });

  const offersMap = new Map<string, FetchedOffer>(fetchedValueOffers.map((o) => [o.id, o]));

  checkFetchedOffers([storage], offersMap, OfferType.Storage);
  checkFetchedOffers(solutions.offers, offersMap, OfferType.Solution);
  checkFetchedOffers(data.offers, offersMap, OfferType.Data);

  let workflowMinTimeMinutes: number =
    params.minRentMinutes ||
    calculateValueOffersMinTimeMinutes([...data.offers, ...solutions.offers], offersMap);

  if (!tee.slotId || !tee.id) {
    Printer.print(
      'Compute offer or slot is not specified, configuration will be selected automatically',
    );

    const slot = await automatchTeeSlot({
      backendUrl: params.backendUrl,
      accessToken: params.accessToken,
      tee: tee,
      storage,
      data: data.offers,
      solutions: solutions.offers,
      usageMinutes: workflowMinTimeMinutes,
    });

    if (!slot || !slot.teeOffer || !slot.slotResult) {
      throw new Error(
        `Unable to find available TEE offer ${tee.id ? `with id ${tee.id} ` : ' '}for workflow`,
      );
    }

    tee.id = slot.teeOffer.id;
    tee.slotId = slot.slotResult.slot.id;
    params.teeSlotCount = slot.slotResult.multiplier;

    // If user passed options then we don't modify them
    if (!params.teeOptionsIds.length && slot.optionsResult?.optionResults.length) {
      const { ids, counts } = formatTeeOptions(slot.optionsResult?.optionResults);

      params.teeOptionsIds = ids;
      params.teeOptionsCount = counts;
    }
    Printer.print('Selected Compute configuration:');
    Printer.print(`Compute offer id: ${tee.id}`);
    Printer.print(`With slot: id: ${tee.slotId}, times: ${params.teeSlotCount}`);
    if (params.teeOptionsIds.length) {
      params.teeOptionsIds.forEach((teeOption, index) => {
        Printer.print(`With option: id: ${teeOption}, times: ${params.teeOptionsCount[index]}`);
      });
    }
  }

  const restrictionOffersMap = new Map<string, Offer>(
    fetchedValueOffers
      .map(({ id }) => [id.toString(), new Offer(id)]),
  );

  Printer.print('Validating workflow configuration');

  await Promise.all(
    [...solutionIds, ...dataIds].map((offerId) => {
      const offerToCheck = fetchedValueOffers.find((o) => o.id === offerId);
      const restrictions =
        <Offer[]>(
          (offerToCheck?.offerInfo?.restrictions?.offers || [])
            .map((o) => restrictionOffersMap.get(o.id || ''))
            .filter(Boolean)
        ) ?? [];
      return validateOfferWorkflowService({
        offerId,
        restrictions,
        tee: tee.id,
        solutions: solutionIds,
        data: dataIds,
        solutionArgs: solutions.resourceFiles,
        dataArgs: data.resourceFiles,
      });
    }),
  );

  if (!params.skipHardwareCheck) {
    const configurationErrors = await fetchConfigurationErrors({
      backendUrl: params.backendUrl,
      accessToken: params.accessToken,
      offers: {
        tee: {
          offerId: tee.id,
          options: params.teeOptionsIds.map((optionId, index) => ({
            id: optionId,
            count: params.teeOptionsCount[index],
          })),
          slot: { id: tee.slotId, count: params.teeSlotCount! },
        },
        solution: solutions.offers.map((solution) => ({
          offerId: solution.id,
          slot: { id: solution.slotId },
        })),
        data: data.offers.map((dataOffer) => ({
          offerId: dataOffer.id,
          slot: { id: dataOffer.slotId },
        })),
        storage: { offerId: storage.id, slot: { id: storage.slotId } },
      },
    });

    if (!configurationErrors.success && configurationErrors.errors) {
      let errorMessage = 'Not enough compute resources to create workflow.';
      Object.entries(configurationErrors.errors).forEach(([key, value]) => {
        if (value !== 'ValidationErrors' && value !== null && value !== undefined) {
          errorMessage += `\nInsufficient ${key}. Required ${value.required}. Provided ${value.provided}`;
        }
      });

      throw new Error(errorMessage);
    }
  }

  const fetchedTeeOffer = await fetchTeeOffers({
    backendUrl: params.backendUrl,
    accessToken: params.accessToken,
    limit: 1,
    filter: { id: tee.id },
  }).then(({ list }) => list[0]);

  if (!fetchedTeeOffer) {
    throw new Error(`TEE offer ${tee.id} does not exist or is of the wrong type`);
  }

  const teeOfferSlots = fetchedTeeOffer?.slots.map((slot) => slot.id);

  checkSlot(teeOfferSlots, tee.id, tee.slotId, OfferType.TeeOffer);

  workflowMinTimeMinutes =
    Math.max(
      workflowMinTimeMinutes,
      fetchedTeeOffer.slots?.find((slot) => slot.id === tee.slotId)?.usage.minTimeMinutes || 0, // We do not count TEE options minTimeMinutes
    ) || MINUTES_IN_HOUR;

  const runtimeInputInfos = await TIIGenerator.generateRiiByOfferIds(solutionIds.concat(dataIds));
  const buildRuntimeInputInfoFromResource = (
    resource: ResourceFile,
    type: RIIType,
  ): RuntimeInputInfo => ({
    args: resource.args,
    hash: resource.hash ?? constants.ZERO_HASH,
    ...(resource.signatureKeyHash && { signatureKeyHash: resource.signatureKeyHash }),
    type,
    ...(Object.keys(resource.hardwareContext ?? {}).length && {
      hardwareContext: resource.hardwareContext,
    }),
  });

  solutions.resourceFiles.forEach((resource) =>
    runtimeInputInfos.push(buildRuntimeInputInfoFromResource(resource, 'Solution')),
  );

  images.resourceFiles.forEach((resource) =>
    runtimeInputInfos.push(buildRuntimeInputInfoFromResource(resource, 'Image')),
  );

  data.resourceFiles.forEach((resource) =>
    runtimeInputInfos.push(buildRuntimeInputInfoFromResource(resource, 'Data')),
  );

  const buildRuntimeInputInfoFromTii = (hash: Hash, type: RIIType): RuntimeInputInfo => ({
    args: undefined,
    hash,
    type,
  });

  solutions.tiis.forEach((_) =>
    runtimeInputInfos.push(buildRuntimeInputInfoFromTii(params.solutionHash, 'Solution')),
  );

  data.tiis.forEach((_) =>
    runtimeInputInfos.push(buildRuntimeInputInfoFromTii(constants.ZERO_HASH, 'Data')),
  );

  images.tiis.forEach((_) =>
    runtimeInputInfos.push(buildRuntimeInputInfoFromTii(params.solutionHash, 'Image')),
  );

  Printer.print('Generating input arguments for TEE');
  const generateTIIByResources = (resources: ResourceFile[]): Promise<string[]> => {
    return Promise.all(
      resources.map((resource) =>
        TIIGenerator.generateByOffer({
          offerId: tee.id,
          runtimeInputInfos: runtimeInputInfos.filter((rii) =>
            ['Solution', 'Image'].includes(rii.type),
          ),
          resource: resource.resource,
          args: resource.args,
          encryption: resource.encryption!,
          sgxApiUrl: params.pccsServiceApiUrl,
        }),
      ),
    );
  };
  const [solutionTIIs, dataTIIs, imageTIIs] = await Promise.all([
    generateTIIByResources(solutions.resourceFiles),
    generateTIIByResources(data.resourceFiles),
    generateTIIByResources(images.resourceFiles),
  ]);

  if (solutions.tiis.length) {
    solutionTIIs.push(...solutions.tiis);
  }
  if (data.tiis.length) {
    dataTIIs.push(...data.tiis);
  }
  if (images.tiis.length) {
    imageTIIs.push(...images.tiis);
  }

  Printer.print('Calculating payment deposit');

  const teeOfferParams = {
    id: tee.id,
    offer: fetchedTeeOffer,
    slotId: tee.slotId,
    slotCount: params.teeSlotCount!,
    optionsIds: params.teeOptionsIds,
    optionsCount: params.teeOptionsCount,
  };

  let holdDeposit = await calcWorkflowDepositService({
    tee: teeOfferParams,
    storage: storage,
    solutions: solutions.offers,
    data: data.offers,
    minRentMinutes: workflowMinTimeMinutes,
    teeOffer: fetchedTeeOffer,
    valueOffers: offersMap,
  });

  holdDeposit = await getHoldDeposit({
    holdDeposit,
    token,
    userDepositAmount: params.userDepositAmount,
    consumerAddress: consumerAddress!,
    minRentMinutes: workflowMinTimeMinutes,
  });

  const workflowPromises = new Array(params.workflowNumber);
  await approveTeeTokens({
    amount: holdDeposit,
    from: consumerAddress!,
    to: Orders.address,
    token,
  });
  const inputOffersParams = [...solutions.offers, ...data.offers];

  const argsToEncrypt: TeeOrderEncryptedArgs = {
    data: dataTIIs,
    solution: solutionTIIs,
    image: imageTIIs,
  };
  if (params.solutionConfigurationPath) {
    const configuration = await buildConfiguration({
      solutionConfigPath: params.solutionConfigurationPath,
      dataConfigurationPaths: params.dataConfigurationPaths,
    });
    const encryptedConfiguration = await RIGenerator.encryptByTeeBlock(
      teeOfferParams.id,
      JSON.stringify(configuration),
      params.pccsServiceApiUrl,
    );
    argsToEncrypt.configuration = JSON.stringify(encryptedConfiguration);
  }

  const argsHash = helpers.calculateObjectHash(argsToEncrypt);

  const orderResultKeys = await RIGenerator.generate({
    offerId: teeOfferParams.id,
    encryptionPrivateKey: params.resultEncryption,
    pccsServiceApiUrl: params.pccsServiceApiUrl,
    runtimeInputInfos,
    argsHash,
  });

  Printer.print(`Creating workflow${params.workflowNumber > 1 ? 's' : ''}`);
  const properties: (IOrderEventProperties | IEventProperties)[] = [];
  for (let pos = 0; pos < params.workflowNumber; pos++) {
    workflowPromises[pos] = new Promise((resolve) => {
      createWorkflowService({
        accessToken: params.accessToken,
        actionAccountKey: params.actionAccountKey,
        backendUrl: params.backendUrl,
        blockchainConfig: params.blockchainConfig,
        minRentMinutes: 3 * 24 * MINUTES_IN_HOUR,
        pccsServiceApiUrl: params.pccsServiceApiUrl,
        resultEncryption: params.resultEncryption,
        analytics: params.analytics,
        teeOffer: teeOfferParams,
        storageOffer: storage,
        inputOffers: inputOffersParams,
        argsToEncrypt,
        resultPublicKey: orderResultKeys.publicKey,
        encryptedInfo: orderResultKeys.encryptedInfo,
        holdDeposit: holdDeposit.toString(),
        consumerAddress: consumerAddress!,
        storageAccess: params.storageAccess,
        token,
      })
        .then((workflowId) => {
          properties.push({
            orderId: workflowId,
            offers: [
              {
                offer: teeOfferParams.id,
                slot: {
                  id: teeOfferParams.slotId,
                  count: teeOfferParams.slotCount,
                },
                offerType: getObjectKey(
                  teeOfferParams.offer.teeOfferInfo.teeType,
                  OfferType,
                ) as TOfferType,
                ...(teeOfferParams.optionsIds.length && {
                  options: teeOfferParams.optionsIds.map((_, index) => ({
                    id: teeOfferParams.optionsIds[index],
                    count: teeOfferParams.optionsCount[index],
                  })),
                }),
              },
              ...fetchedValueOffers.map((offer) => ({
                offer: offer.id,
                ...(offer.slots.length && {
                  slot: {
                    id: offer.slots[0].id,
                    count: 1,
                  },
                }),
                offerType: getObjectKey(offer.offerInfo.offerType, OfferType) as TOfferType,
                mrSigner: offer.version?.info.signatureKeyHash?.hash ?? '',
                hash: offer.version?.info.hash?.hash ?? '',
              })),
            ],
          });
          resolve(workflowId);
        })
        .catch((error) => {
          Printer.error(`Error creating workflow ${error}`);
          properties.push({
            result: 'error',
            error: error.message,
            errorStack: error.stack,
          });
          resolve(null);
        });
    });
  }

  const results = await Promise.all(workflowPromises);
  if (properties.length) {
    const events = properties.map((event) => ({
      eventName: AnalyticEvent.ORDER_CREATED,
      eventProperties: event,
    }));
    await params.analytics?.trackEventsCatched({ events });
  }
  const id = JSON.stringify(results);

  Printer.print(`Workflow was created, TEE order id: ${id}`);

  return id;
};

export default workflowCreate;

import {
  Analytics,
  Config as BlockchainConfig,
  TIIGenerator,
  OrderStatus,
  Offer,
  OfferType,
  Orders,
  helpers,
  AnalyticsEvent,
} from '@super-protocol/sdk-js';
import Printer from '../printer';
import initBlockchainConnectorService from '../services/initBlockchainConnector';
import validateOfferWorkflowService from '../services/validateOfferWorkflow';
import createWorkflowService, { ValueOfferParams } from '../services/createWorkflow';
import parseInputResourcesService from '../services/parseInputResources';
import calcWorkflowDepositService from '../services/calcWorkflowDeposit';
import { formatTeeOptions, getObjectKey } from '../utils';
import fetchOrdersCountService from '../services/fetchOrdersCount';
import { TOfferType } from '../gql';
import fetchTeeOffers from '../services/fetchTeeOffers';
import automatchTeeSlot from '../services/automatchTeeSlot';
import {
  calculateValueOffersMinTimeMinutes,
  checkFetchedOffers,
  checkSlot,
  getHoldDeposit,
  FethchedOffer,
  getFetchedOffers,
} from '../services/workflowHelpers';
import fetchConfigurationErrors from '../services/fetchConfigurationErrors';
import { MINUTES_IN_HOUR } from '../constants';
import approveTeeTokens from '../services/approveTeeTokens';
import { AnalyticEvent, IEventProperties, IOrderEventProperties } from '../services/analytics';
import { EncryptionKey, Linkage } from '@super-protocol/dto-js';
import { SolutionResourceFileValidator } from '../services/readResourceFile';

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
  data: string[];
  resultEncryption: EncryptionKey;
  userDepositAmount: string;
  minRentMinutes: number;
  workflowNumber: number;
  ordersLimit: number;
  skipHardwareCheck: boolean;
  pccsServiceApiUrl: string;
};

const workflowCreate = async (params: WorkflowCreateParams): Promise<string | void> => {
  Printer.print('Connecting to the blockchain');
  const consumerAddress = await initBlockchainConnectorService({
    blockchainConfig: params.blockchainConfig,
    actionAccountKey: params.actionAccountKey,
  });

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

  const solutions = await parseInputResourcesService({
    options: params.solution,
    backendUrl: params.backendUrl,
    accessToken: params.accessToken,
    minRentMinutes: params.minRentMinutes,
    resourceValidator: SolutionResourceFileValidator,
  });
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

  const offersMap = new Map<string, FethchedOffer>(fetchedValueOffers.map((o) => [o.id, o]));

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
      .flatMap(({ offerInfo }) => offerInfo.restrictions?.offers || [])
      .map((id) => [id.toString(), new Offer(id)]),
  );

  Printer.print('Validating workflow configuration');

  await Promise.all(
    [...solutionIds, ...dataIds].map((offerId) => {
      const offerToCheck = fetchedValueOffers.find((o) => o.id === offerId);
      const restrictions =
        <Offer[]>(
          (offerToCheck?.offerInfo?.restrictions?.offers || [])
            .map((o) => restrictionOffersMap.get(o))
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

  // eslint-disable-next-line prefer-const
  let { hashes, linkage } = await TIIGenerator.getSolutionHashesAndLinkage(
    solutionIds.concat(dataIds),
  );

  [...solutions.resourceFiles, ...data.resourceFiles].forEach((resource) => {
    if (resource.hash) {
      hashes.push(resource.hash);
    }

    if (!linkage && resource.linkage) {
      linkage = JSON.stringify(resource.linkage);
    }
  });

  Printer.print('Generating input arguments for TEE');
  const [solutionTIIs, dataTIIs] = await Promise.all([
    Promise.all(
      solutions.resourceFiles.map((solution) =>
        TIIGenerator.generateByOffer(
          tee.id,
          hashes,
          linkage,
          solution.resource,
          solution.args,
          solution.encryption!,
          params.pccsServiceApiUrl,
        ),
      ),
    ),
    await Promise.all(
      data.resourceFiles.map((data) =>
        TIIGenerator.generateByOffer(
          tee.id,
          hashes,
          linkage,
          data.resource,
          data.args,
          data.encryption!,
          params.pccsServiceApiUrl,
        ),
      ),
    ),
  ]);

  if (solutions.tiis.length) {
    solutionTIIs.push(...solutions.tiis);
  }
  if (data.tiis.length) {
    dataTIIs.push(...data.tiis);
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
    userDepositAmount: params.userDepositAmount,
    consumerAddress: consumerAddress!,
    minRentMinutes: workflowMinTimeMinutes,
  });

  const workflowPromises = new Array(params.workflowNumber);
  await approveTeeTokens({
    amount: holdDeposit,
    from: consumerAddress!,
    to: Orders.address,
  });
  const inputOffersParams = [...solutions.offers, ...data.offers];

  const orderResultKeys = await helpers.getEncryptionKeysForOrder({
    offerId: teeOfferParams.id,
    encryptionPrivateKey: params.resultEncryption,
    pccsServiceApiUrl: params.pccsServiceApiUrl,
  });

  Printer.print(`Creating workflow${params.workflowNumber > 1 ? 's' : ''}`);
  const properties: (IOrderEventProperties | IEventProperties)[] = [];
  for (let pos = 0; pos < params.workflowNumber; pos++) {
    workflowPromises[pos] = new Promise((resolve) => {
      createWorkflowService({
        teeOffer: teeOfferParams,
        storageOffer: storage,
        inputOffers: inputOffersParams,
        argsToEncrypt: JSON.stringify({
          data: dataTIIs,
          solution: solutionTIIs,
        }),
        resultPublicKey: orderResultKeys.publicKey,
        encryptedInfo: orderResultKeys.encryptedInfo,
        holdDeposit: holdDeposit.toString(),
        consumerAddress: consumerAddress!,
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
    const linkageObj = linkage ? (JSON.parse(linkage) as Linkage) : {};
    const events = properties.map((event) => ({
      eventName: AnalyticEvent.ORDER_CREATED,
      eventProperties: {
        ...event,
        ...(Object.keys(linkageObj).length &&
          (event as IEventProperties).result !== 'error' && { ...linkageObj }),
      },
    }));
    await params.analytics?.trackEventsCatched({ events });
  }
  const id = JSON.stringify(results);

  Printer.print(`Workflow was created, TEE order id: ${id}`);

  return id;
};

export default workflowCreate;

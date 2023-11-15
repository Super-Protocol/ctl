import { FethchedOffer } from '../commands/workflowsCreate';
import { ValueOfferParams } from './createWorkflow';

export function calculateValueOffersMinTimeMinutes(
  offersWithSlot: ValueOfferParams[],
  allOffers: Map<string, FethchedOffer>,
): number {
  return offersWithSlot.reduce((greatestMinTimeMinutes: number, valueOffer: ValueOfferParams) => {
    const valueOfferSlot = allOffers
      .get(valueOffer.id)
      ?.slots.find((slot) => slot.id === valueOffer.slotId);
    if (valueOfferSlot) {
      return Math.max(valueOfferSlot?.usage.minTimeMinutes, greatestMinTimeMinutes);
    }
    return greatestMinTimeMinutes;
  }, 0);
}

import { OfferVersion, OfferVersionStatus } from '@super-protocol/sdk-js';

export const selectLastValueOfferVersion = (
  versions?: OfferVersion[],
): OfferVersion | undefined => {
  const version = versions
    ?.filter((v) => v.status === OfferVersionStatus.New)
    .reduce((max, current) => (current.version > max.version ? current : max), {
      version: Number.MIN_SAFE_INTEGER,
      info: {},
      status: OfferVersionStatus.New,
    });

  if (version?.version !== Number.MIN_SAFE_INTEGER) {
    return version;
  }
};

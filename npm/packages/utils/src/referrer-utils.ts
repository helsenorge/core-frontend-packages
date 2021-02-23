import { getQueryStrings } from './querystring-utils';

export const isReferrer = (referrer: string): boolean => {
  const queryStrings = getQueryStrings() as { referrer?: string };
  return queryStrings && queryStrings.referrer === referrer;
};

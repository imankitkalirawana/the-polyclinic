import { createLoader, parseAsString } from 'nuqs/server';

export const queuesSearchParams = {
  id: parseAsString,
  view: parseAsString,
};

export const loadSearchParams = createLoader(queuesSearchParams);

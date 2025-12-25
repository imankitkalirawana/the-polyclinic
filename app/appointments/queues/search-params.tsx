import { createLoader, parseAsString } from 'nuqs/server';

export const queuesSearchParams = {
  id: parseAsString,
};

export const loadSearchParams = createLoader(queuesSearchParams);

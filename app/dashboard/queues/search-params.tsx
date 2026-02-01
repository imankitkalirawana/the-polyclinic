import { createLoader, parseAsIsoDateTime, parseAsString } from 'nuqs/server';

export const queuesSearchParams = {
  id: parseAsString,
  view: parseAsString,
  date: parseAsIsoDateTime,
};

export const loadSearchParams = createLoader(queuesSearchParams);

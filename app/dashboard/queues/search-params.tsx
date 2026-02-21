import { createLoader, parseAsIsoDateTime, parseAsString, parseAsStringEnum } from 'nuqs/server';
import { QueueViewType } from './types';

export const queuesSearchParams = {
  id: parseAsString,
  view: parseAsStringEnum(Object.values(QueueViewType)).withDefault(QueueViewType.DEFAULT),
  date: parseAsIsoDateTime,
};

export const loadSearchParams = createLoader(queuesSearchParams);

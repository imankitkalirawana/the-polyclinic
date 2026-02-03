import { ValuesOf } from '@/libs/utils';

export const views = ['month', 'week', 'day', 'schedule', 'year'];

export type View = ValuesOf<typeof views>;

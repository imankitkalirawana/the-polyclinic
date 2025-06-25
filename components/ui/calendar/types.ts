import { ValuesOf } from '@/lib/utils';

export const views = ['month', 'week', 'day', 'schedule', 'year'];

export type View = ValuesOf<typeof views>;

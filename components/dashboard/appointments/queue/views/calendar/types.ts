import { ValuesOf } from '@/libs/utils';

export const viewTypes = ['month', 'week', 'day', 'schedule', 'year'];

export type ViewType = ValuesOf<typeof viewTypes>;

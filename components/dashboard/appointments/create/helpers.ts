import { DateValue, isWeekend } from '@internationalized/date';

import { disabledDates } from '@/libs/appointments/new';

export const isDateUnavailable = (date: DateValue, timeZone: string) =>
  isWeekend(date, timeZone) || disabledDates[0].map((d) => d.compare(date)).includes(0);

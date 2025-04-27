import { CalendarDate } from '@internationalized/date';

import { TIMINGS } from '../config';

export const disabledDates = [
  TIMINGS.holidays.map((date) => {
    const [year, month, day] = date.split('-').map(Number);
    return new CalendarDate(year, month, day);
  }),
];

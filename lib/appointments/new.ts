import { TIMINGS } from '../config';
import { CalendarDate } from '@internationalized/date';

export const disabledDates = [
  TIMINGS.holidays.map((date) => {
    const [year, month, day] = date.split('-').map(Number);
    return new CalendarDate(year, month, day);
  })
];

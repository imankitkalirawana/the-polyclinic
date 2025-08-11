'use client';

import { Calendar, cn } from '@heroui/react';
import { format } from 'date-fns';
import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
import { useLocale } from '@react-aria/i18n';

import { isDateUnavailable } from './helper';

import CalendarTimeSelect from '@/components/ui/calendar/booking/calendar-time-select';
import { TIMINGS } from '@/lib/config';

export default function DateSelection({
  date,
  setDate,
}: {
  date: Date;
  setDate: (date: Date) => void;
}) {
  const { locale } = useLocale();

  return (
    <div className="flex justify-center">
      <Calendar
        aria-label="Appointment Date"
        minValue={today(getLocalTimeZone())}
        maxValue={today(getLocalTimeZone()).add({
          days: TIMINGS.booking.maximum,
        })}
        // @ts-expect-error - TODO: fix this
        value={new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())}
        onChange={(selectedDate: CalendarDate) => {
          // Preserve the current time when changing the date
          const newDate = new Date(
            selectedDate.year,
            selectedDate.month - 1,
            selectedDate.day,
            date.getHours(),
            date.getMinutes()
          );
          setDate(newDate);
        }}
        showHelper
        isDateUnavailable={(date) => isDateUnavailable(date, locale)}
        calendarWidth="372px"
        className="rounded-r-none shadow-none"
        classNames={{
          headerWrapper: 'bg-transparent px-3 pt-1.5 pb-3',
          title: 'text-default-700 text-small font-semibold',
          gridHeader: 'bg-transparent shadow-none',
          gridHeaderCell: 'font-medium text-default-400 text-xs p-0 w-full',
          gridHeaderRow: 'px-3 pb-3',
          gridBodyRow: 'gap-x-1 px-3 mb-1 first:mt-4 last:mb-0',
          gridWrapper: 'pb-3',
          cell: 'p-1.5 w-full',
          cellButton:
            'w-full h-9 rounded-medium data-[selected]:shadow-[0_2px_12px_0] data-[selected]:shadow-primary-300 text-small font-medium',
        }}
      />
      <CalendarTimeSelect date={date} setDate={setDate} />
    </div>
  );
}

export function DateSelectionTitle({ date, isSelected }: { date: Date; isSelected: boolean }) {
  return date ? (
    <h3
      className={cn('text-2xl font-semibold transition-all', {
        'text-center': isSelected,
      })}
    >
      {format(date, 'PPPp')}
    </h3>
  ) : (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold">Choose Date & Time</h3>
    </div>
  );
}

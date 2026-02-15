'use client';

import { Calendar } from '@heroui/react';
import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
import { useLocale } from '@react-aria/i18n';

import { isDateUnavailable } from '../helpers';

import CalendarTimeSelect from '@/components/dashboard/appointments/all/booking/calendar-time-select';
import { TIMINGS } from '@/libs/config';

export default function CreateAppointmentTimeSelection({
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
            'w-full h-9 rounded-medium data-selected:shadow-[0_2px_12px_0] data-[selected]:shadow-primary-300 text-small font-medium',
        }}
      />
      <CalendarTimeSelect date={date} setDate={setDate} />
    </div>
  );
}

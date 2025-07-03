'use client';
import { format, isWeekend } from 'date-fns';
import { Calendar, cn } from '@heroui/react';
import {
  CalendarDate,
  DateValue,
  getLocalTimeZone,
  Time,
  today,
} from '@internationalized/date';

import { TIMINGS } from '@/lib/config';
import DateTimePicker from './date-time-picker';
import { disabledDates } from '@/lib/appointments/new';
import { useLocale } from '@react-aria/i18n';
import CalendarTimeSelect from '@/components/ui/calendar/booking/calendar-time-select';
import { DurationEnum } from '@/components/ui/calendar/booking/util';

export default function DateSelection({
  date,
  setDate,
  onSubmit,
}: {
  date: Date;
  setDate: (date: Date) => void;
  onSubmit: () => void;
}) {
  const isDateUnavailable = (date: DateValue) => {
    return (
      isWeekend(new Date(date.year, date.month - 1, date.day)) ||
      disabledDates[0].map((d) => d.compare(date)).includes(0)
    );
  };

  return (
    <div className="flex">
      <Calendar
        aria-label="Appointment Date"
        minValue={today(getLocalTimeZone())}
        maxValue={today(getLocalTimeZone()).add({
          days: TIMINGS.booking.maximum,
        })}
        // @ts-ignore
        value={
          new CalendarDate(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate()
          )
        }
        onChange={(selectedDate: CalendarDate) => {
          setDate(
            new Date(
              selectedDate.year,
              selectedDate.month - 1,
              selectedDate.day
            )
          );
        }}
        showHelper
        isDateUnavailable={isDateUnavailable}
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
      <CalendarTimeSelect
        day={format(date, 'd')}
        duration={DurationEnum.FifteenMinutes}
        selectedTime="10:00"
        weekday={format(date, 'EEE')}
        onConfirm={() => {}}
        onTimeChange={() => {}}
      />
      {/* <div className="mt-4 flex justify-center xs:justify-start">
        <Button
          color="primary"
          radius="lg"
          className="w-full max-w-64 xs:w-fit"
          endContent={<Icon icon="tabler:chevron-right" />}
          onPress={() => {
            setDate(date);
            onSubmit();
          }}
        >
          Continue
        </Button>
      </div> */}
    </div>
  );
}

export function DateSelectionTitle({
  date,
  isSelected,
}: {
  date: Date;
  isSelected: boolean;
}) {
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

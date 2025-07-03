'use client';
import * as React from 'react';
import {
  Calendar,
  CalendarProps,
  DateValue,
  TimeInput,
  TimeInputProps,
  TimeInputValue,
  Tooltip,
} from '@heroui/react';
import {
  CalendarDate,
  getLocalTimeZone,
  Time,
  today,
} from '@internationalized/date';
import { useLocale } from '@react-aria/i18n';

import { disabledDates } from '@/lib/appointments/new';
import { TIMINGS } from '@/lib/config';
import CalendarTimeSelect from '@/components/ui/calendar/booking/calendar-time-select';
import { DurationEnum } from '@/components/ui/calendar/booking/util';
import { format } from 'date-fns';

export default function DateTimePicker({
  date = today(getLocalTimeZone()),
  time = new Time(TIMINGS.appointment.start),
  onDateChange,
  onTimeChange,
  dateProps,
  timeProps,
}: {
  date?: CalendarDate;
  time?: TimeInputValue;
  onDateChange?: (date: CalendarDate) => void;
  onTimeChange?: (time: TimeInputValue) => void;
  dateProps?: CalendarProps;
  timeProps?: TimeInputProps;
}) {
  console.log(format(date.toDate(getLocalTimeZone()), 'HH:mm'));
  return (
    <>
      <div className="flex justify-center">
        <Calendar
          {...dateProps}
          aria-label="Appointment Date"
          minValue={today(getLocalTimeZone())}
          maxValue={today(getLocalTimeZone()).add({
            days: TIMINGS.booking.maximum,
          })}
          // @ts-ignore
          value={date}
          onChange={(selectedDate) =>
            onDateChange?.(selectedDate as CalendarDate)
          }
          isInvalid={disabledDates[0].map((d) => d.compare(date!)).includes(0)}
          showHelper
          isDateUnavailable={(date) => {
            return disabledDates[0].map((d) => d.compare(date)).includes(0);
          }}
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
          day={format(date.toDate(getLocalTimeZone()), 'd')}
          duration={DurationEnum.FifteenMinutes}
          selectedTime={format(date.toDate(getLocalTimeZone()), 'HH:mm')}
          weekday={format(date.toDate(getLocalTimeZone()), 'EEE')}
          onConfirm={() => {
            onDateChange?.(date);
          }}
          onTimeChange={() => {
            onTimeChange?.(time);
          }}
        />
        {/* <Tooltip
          content={
            <div className="px-1 py-2">
              <div className="text-tiny">
                We book appointments between 11am to 7pm only
              </div>
            </div>
          }
        >
          <div className="inline-block">
            <TimeInput
              {...timeProps}
              className="max-w-64"
              label="Appointment Time"
              minValue={new Time(TIMINGS.appointment.start)}
              maxValue={new Time(TIMINGS.appointment.end)}
              isRequired
              value={time}
              onChange={onTimeChange as any}
            />
          </div>
        </Tooltip> */}
      </div>
    </>
  );
}

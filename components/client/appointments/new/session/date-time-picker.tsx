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
import { CalendarDate, getLocalTimeZone, Time, today } from '@internationalized/date';

import { disabledDates } from '@/lib/appointments/new';
import { TIMINGS } from '@/lib/config';
import { $FixMe } from '@/types';

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
  return (
    <div className="flex flex-col items-center gap-4 xs:items-start">
      <Calendar
        {...dateProps}
        aria-label="Date (Min Date Value)"
        // @ts-expect-error - TODO: fix this
        defaultValue={today(getLocalTimeZone()) as unknown as DateValue}
        minValue={today(getLocalTimeZone())}
        maxValue={today(getLocalTimeZone()).add({
          days: TIMINGS.booking.maximum,
        })}
        // @ts-expect-error - TODO: fix this
        value={date}
        onChange={(selectedDate) => onDateChange?.(selectedDate as CalendarDate)}
        isInvalid={disabledDates[0].map((d) => d.compare(date!)).includes(0)}
        showMonthAndYearPickers
        showHelper
        isDateUnavailable={(date) => disabledDates[0].map((d) => d.compare(date)).includes(0)}
      />
      <Tooltip
        content={
          <div className="px-1 py-2">
            <div className="text-tiny">We book appointments between 11am to 7pm only</div>
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
            onChange={onTimeChange as $FixMe}
          />
        </div>
      </Tooltip>
    </div>
  );
}

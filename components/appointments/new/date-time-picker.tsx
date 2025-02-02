'use client';
import {
  CalendarDate,
  getLocalTimeZone,
  today,
  isWeekend,
  Time
} from '@internationalized/date';
import { useLocale } from '@react-aria/i18n';
import * as React from 'react';
import {
  Calendar,
  CalendarProps,
  TimeInput,
  TimeInputProps,
  TimeInputValue
} from '@heroui/react';
import { TIMINGS } from '@/lib/config';
import { disabledDates } from '@/lib/appointments/new';

export default function DateTimePicker({
  date = today(getLocalTimeZone()),
  time = new Time(TIMINGS.appointment.start),
  onDateChange,
  onTimeChange,
  dateProps,
  timeProps
}: {
  date?: CalendarDate;
  time?: TimeInputValue;
  onDateChange?: (date: CalendarDate) => void;
  onTimeChange?: (time: TimeInputValue) => void;
  dateProps?: CalendarProps;
  timeProps?: TimeInputProps;
}) {
  const { locale } = useLocale();

  return (
    <>
      <div className="flex flex-col gap-4">
        <Calendar
          {...dateProps}
          aria-label="Date (Min Date Value)"
          defaultValue={today(getLocalTimeZone())}
          minValue={today(getLocalTimeZone())}
          maxValue={today(getLocalTimeZone()).add({
            days: TIMINGS.booking.maximum
          })}
          value={date}
          onChange={onDateChange}
          isInvalid={
            isWeekend(date!, locale) ||
            disabledDates[0].map((d) => d.compare(date!)).includes(0)
          }
          errorMessage={
            isWeekend(date!, locale) ? 'We are closed on weekends' : ''
          }
          showMonthAndYearPickers
          showHelper
          isDateUnavailable={(date) => {
            return (
              isWeekend(date, locale) ||
              disabledDates[0].map((d) => d.compare(date)).includes(0)
            );
          }}
        />
        <TimeInput
          {...timeProps}
          label="Appointment Time"
          className="max-w-64"
          minValue={new Time(TIMINGS.appointment.start)}
          maxValue={new Time(TIMINGS.appointment.end)}
          isRequired
          errorMessage={(value) => {
            if (value) {
              return 'We are closed at this time';
            }
            return '';
          }}
          value={time}
          // onChange={(value) => handleChangeTime(value as TimeInputValue)}
          onChange={onTimeChange as any}
        />
      </div>
    </>
  );
}

'use client';
import {
  CalendarDate,
  getLocalTimeZone,
  today,
  isWeekend,
  Time
} from '@internationalized/date';
import type { DateValue } from '@react-aria/calendar';
import { useLocale } from '@react-aria/i18n';
import * as React from 'react';
import {
  Calendar,
  CalendarProps,
  TimeInput,
  TimeInputProps,
  TimeInputValue
} from '@nextui-org/react';
import { useQueryState } from 'nuqs';
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

  // const [dateParam, setDateParam] = useQueryState('date', {
  //   defaultValue: today(getLocalTimeZone()).toString()
  // });
  // const [slotParam, setSlotParam] = useQueryState('slot', {
  //   defaultValue: new Date()
  //     .toLocaleTimeString('en-IN', { hour12: false })
  //     .split(' ')[0]
  // });

  // const [date, setDate] = React.useState<CalendarDate>(
  //   (() => {
  //     const localDateTime = new Date(`${dateParam}T${slotParam}`);

  //     // if current time is after 5 PM, set the date to tomorrow
  //     if (localDateTime.getHours() >= TIMINGS.appointment.end) {
  //       localDateTime.setDate(localDateTime.getDate() + 1);
  //     }

  //     return new CalendarDate(
  //       localDateTime.getFullYear(),
  //       localDateTime.getMonth() + 1,
  //       localDateTime.getDate()
  //     );
  //   })()
  // );

  // const [time, setTime] = React.useState<TimeInputValue | null>(
  //   (() => {
  //     const localDateTime = new Date(`${dateParam}T${slotParam}`);
  //     const currentHour = localDateTime.getHours();
  //     const currentMinute = localDateTime.getMinutes();

  //     if (
  //       currentHour < TIMINGS.appointment.start ||
  //       currentHour >= TIMINGS.appointment.end
  //     ) {
  //       return new Time(TIMINGS.appointment.start);
  //     }

  //     return new Time(currentHour, currentMinute);
  //   })()
  // );

  // const handleChangeDate = (date: DateValue) => {
  //   setDate(date as CalendarDate);
  //   const formattedDate = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
  //   setDateParam(formattedDate);
  // };

  // const handleChangeTime = (time: TimeInputValue) => {
  //   setTime(time);
  //   const formattedTime = `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}:00`;
  //   setSlotParam(formattedTime);
  // };

  return (
    <>
      <div className="flex w-full flex-col items-center gap-4">
        <Calendar
          {...dateProps}
          calendarWidth={384 - 36}
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
          className="max-w-96"
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

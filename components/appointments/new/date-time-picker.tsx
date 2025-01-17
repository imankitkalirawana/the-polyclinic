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
import { Button, Calendar, TimeInput, TimeInputValue } from '@nextui-org/react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { TIMINGS } from '@/lib/config';
import { Icon } from '@iconify/react/dist/iconify.js';

export default function DateTimePicker() {
  const { locale } = useLocale();

  const [step, setStep] = useQueryState('step', parseAsInteger.withDefault(0));

  const [dateParam, setDateParam] = useQueryState('date', {
    defaultValue: today(getLocalTimeZone()).toString()
  });
  const [slotParam, setSlotParam] = useQueryState('slot', {
    defaultValue: new Date()
      .toLocaleTimeString('en-IN', { hour12: false })
      .split(' ')[0]
  });

  const [date, setDate] = React.useState<CalendarDate>(
    (() => {
      const localDateTime = new Date(`${dateParam}T${slotParam}`);

      // if current time is after 5 PM, set the date to tomorrow
      if (localDateTime.getHours() >= TIMINGS.appointment.end) {
        localDateTime.setDate(localDateTime.getDate() + 1);
      }

      return new CalendarDate(
        localDateTime.getFullYear(),
        localDateTime.getMonth() + 1,
        localDateTime.getDate()
      );
    })()
  );

  const [time, setTime] = React.useState<TimeInputValue | null>(
    (() => {
      const localDateTime = new Date(`${dateParam}T${slotParam}`);
      const currentHour = localDateTime.getHours();
      const currentMinute = localDateTime.getMinutes();

      if (
        currentHour < TIMINGS.appointment.start ||
        currentHour >= TIMINGS.appointment.end
      ) {
        return new Time(TIMINGS.appointment.start);
      }

      return new Time(currentHour, currentMinute);
    })()
  );

  const disabledDates = [
    TIMINGS.holidays.map((date) => {
      const [year, month, day] = date.split('-').map(Number);
      return new CalendarDate(year, month, day);
    })
  ];

  const handleChangeDate = (date: DateValue) => {
    setDate(date as CalendarDate);
    const formattedDate = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
    setDateParam(formattedDate);
  };

  const handleChangeTime = (time: TimeInputValue) => {
    setTime(time);
    const formattedTime = `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}:00`;
    setSlotParam(formattedTime);
  };

  return (
    <>
      <div className="flex w-full max-w-sm flex-col gap-4">
        {step === 1 && (
          <Button
            fullWidth
            color="primary"
            endContent={<Icon icon={'tabler:arrow-right'} />}
            isDisabled={
              isWeekend(date!, locale) ||
              disabledDates[0].map((d) => d.compare(date!)).includes(0) ||
              // if selected time is before 9 AM or after 5 PM
              time!.hour < TIMINGS.appointment.start ||
              time!.hour >= TIMINGS.appointment.end
            }
            variant="flat"
            onPress={() => setStep(step + 1)}
          >
            Proceed
          </Button>
        )}
        <Calendar
          calendarWidth={384}
          aria-label="Date (Min Date Value)"
          defaultValue={today(getLocalTimeZone())}
          minValue={today(getLocalTimeZone())}
          maxValue={today(getLocalTimeZone()).add({
            days: TIMINGS.booking.maximum
          })}
          value={date}
          onChange={handleChangeDate}
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
          onChange={(value) => handleChangeTime(value as TimeInputValue)}
        />
      </div>
    </>
  );
}

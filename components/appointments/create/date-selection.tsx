'use client';
import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  CalendarDate,
  getLocalTimeZone,
  isWeekend,
  Time,
} from '@internationalized/date';
import { useLocale } from '@react-aria/i18n';

import { disabledDates } from '@/lib/appointments/new';
import { TIMINGS } from '@/lib/config';
import DateTimePicker from './date-time-picker';

export default function DateSelection({
  date,
  setDate,
  onSubmit,
}: {
  date: Date;
  setDate: (date: Date) => void;
  onSubmit: () => void;
}) {
  const { locale } = useLocale();

  const [timing, setTiming] = useState<Date>(() => {
    if (date) {
      return date;
    }
    const currentDate = new Date(
      new Date().toLocaleString('en-US', { timeZone: getLocalTimeZone() })
    );
    if (currentDate.getHours() >= 17) {
      if (
        isWeekend(
          new CalendarDate(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            currentDate.getDate()
          ),
          locale
        )
      ) {
        // If next day is weekend, set to next Monday
        while (
          isWeekend(
            new CalendarDate(
              currentDate.getFullYear(),
              currentDate.getMonth() + 1,
              currentDate.getDate()
            ),
            locale
          )
        ) {
          currentDate.setDate(currentDate.getDate() + 1);
        }
      } else {
        currentDate.setDate(currentDate.getDate() + 1);
      }
      currentDate.setHours(9);
      currentDate.setMinutes(0);
    } else {
      currentDate.setMinutes(currentDate.getMinutes() + 5);
    }
    return currentDate;
  });

  return (
    <>
      <DateTimePicker
        date={
          new CalendarDate(
            timing.getFullYear(),
            timing.getMonth() + 1,
            timing.getDate()
          )
        }
        time={new Time(timing.getHours(), timing.getMinutes())}
        onDateChange={(date) => {
          // set the date to the selected date
          setTiming(
            new Date(
              date.year,
              date.month - 1,
              date.day,
              timing.getHours(),
              timing.getMinutes()
            )
          );
        }}
        onTimeChange={(time) => {
          // set the time to the selected time
          setTiming(
            new Date(
              timing.getFullYear(),
              timing.getMonth(),
              timing.getDate(),
              time.hour,
              time.minute
            )
          );
        }}
        timeProps={{
          minValue: new Time(TIMINGS.appointment.start),
          maxValue: new Time(TIMINGS.appointment.end),
        }}
      />
      <div className="mt-4 flex justify-center xs:justify-start">
        <Button
          color="primary"
          radius="lg"
          className="w-full max-w-64 xs:w-fit"
          endContent={<Icon icon="tabler:chevron-right" />}
          onPress={() => {
            setDate(timing);
            onSubmit();
          }}
          isDisabled={
            isWeekend(
              new CalendarDate(
                timing.getFullYear(),
                timing.getMonth() + 1,
                timing.getDate()
              ),
              locale
            ) ||
            disabledDates[0]
              .map((d: any) =>
                d.compare(
                  new CalendarDate(
                    timing.getFullYear(),
                    timing.getMonth() + 1,
                    timing.getDate()
                  )
                )
              )
              .includes(0) ||
            timing.getHours() < TIMINGS.appointment.start ||
            timing.getHours() >= TIMINGS.appointment.end
          }
        >
          Continue
        </Button>
      </div>
    </>
  );
}

export function DateSelectionTitle({ date }: { date: Date }) {
  return date ? (
    <h3 className="text-2xl font-semibold">{format(date, 'PPPp')}</h3>
  ) : (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold">Choose Date & Time</h3>
    </div>
  );
}

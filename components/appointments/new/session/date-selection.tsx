'use client';
import { Button } from '@heroui/react';
import DateTimePicker from './date-time-picker';
import {
  CalendarDate,
  getLocalTimeZone,
  Time,
  isWeekend
} from '@internationalized/date';
import { useLocale } from '@react-aria/i18n';
import { useState } from 'react';
import { TIMINGS } from '@/lib/config';
import { disabledDates } from '@/lib/appointments/new';
import { Icon } from '@iconify/react/dist/iconify.js';
import { format } from 'date-fns';
import { useForm } from './context';

export default function DateSelection() {
  const { formik } = useForm();
  const { locale } = useLocale();

  const [timing, setTiming] = useState<Date>(() => {
    if (formik.values.date) {
      return formik.values.date;
    }
    const date = new Date(
      new Date().toLocaleString('en-US', { timeZone: getLocalTimeZone() })
    );
    if (date.getHours() >= 17) {
      if (
        isWeekend(
          new CalendarDate(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate()
          ),
          locale
        )
      ) {
        // If next day is weekend, set to next Monday
        while (
          isWeekend(
            new CalendarDate(
              date.getFullYear(),
              date.getMonth() + 1,
              date.getDate()
            ),
            locale
          )
        ) {
          date.setDate(date.getDate() + 1);
        }
      } else {
        date.setDate(date.getDate() + 1);
      }
      date.setHours(9);
      date.setMinutes(0);
    } else {
      date.setMinutes(date.getMinutes() + 5);
    }
    return date;
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
          maxValue: new Time(TIMINGS.appointment.end)
        }}
      />
      <div className="mt-4 flex justify-center xs:justify-start">
        <Button
          color="primary"
          radius="lg"
          className="w-full max-w-64 xs:w-fit"
          endContent={<Icon icon="tabler:chevron-right" />}
          onPress={() => {
            formik.setFieldValue('date', timing);
            formik.setFieldValue('step', 3);
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

export function DateSelectionTitle() {
  const { formik } = useForm();

  return formik.values.date && formik.values.step > 2 ? (
    <h3 className="text-2xl font-semibold">
      {format(formik.values.date, 'PPPp')}
    </h3>
  ) : (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold">Choose Date & Time</h3>
    </div>
  );
}

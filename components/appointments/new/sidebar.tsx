import { Icon } from '@iconify/react/dist/iconify.js';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Divider,
  Link,
  TimeInputValue
} from '@nextui-org/react';
import PatientSelection from './patient-selection';
import { parseAsInteger, useQueryState } from 'nuqs';
import {
  today,
  getLocalTimeZone,
  Time,
  CalendarDate,
  isWeekend
} from '@internationalized/date';
import DateTimePicker from './date-time-picker';
import { useEffect, useState } from 'react';
import { TIMINGS } from '@/lib/config';
import { disabledDates } from '@/lib/appointments/new';
import { useLocale } from '@react-aria/i18n';
import DoctorSelection from './doctor-selection';

export default function Sidebar() {
  const { locale } = useLocale();

  const [isInvalidDate, setIsInvalidDate] = useState(false);
  const [isInvalidTime, setIsInvalidTime] = useState(false);

  const [step, setStep] = useQueryState('step', parseAsInteger.withDefault(0));
  const [uid] = useQueryState('uid');
  const [did] = useQueryState('did');
  const [dateParam, setDateParam] = useQueryState('date', {
    defaultValue: today(getLocalTimeZone()).toString()
  });
  const [slotParam, setSlotParam] = useQueryState('slot', {
    defaultValue: new Date()
      .toLocaleTimeString('en-IN', { hour12: false })
      .split(' ')[0]
  });

  const [date, setDate] = useState<CalendarDate>(
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

  const [time, setTime] = useState<TimeInputValue | null>(
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

  useEffect(() => {
    if (
      isWeekend(date!, locale) ||
      disabledDates[0].map((d) => d.compare(date!)).includes(0)
    ) {
      setIsInvalidDate(true);
    } else {
      setIsInvalidDate(false);
    }
  }, [date, locale]);

  useEffect(() => {
    if (
      // if choosen time is before 9 AM or after 5 PM
      time!.hour < TIMINGS.appointment.start ||
      time!.hour >= TIMINGS.appointment.end
    ) {
      setIsInvalidTime(true);
    } else {
      setIsInvalidTime(false);
    }
  }, [time, locale]);

  const stepMap: Record<number, React.ReactNode> = {
    0: <PatientSelection />,
    1: (
      <DateTimePicker
        date={date}
        time={time as TimeInputValue}
        onDateChange={(date) => {
          setDate(date as CalendarDate);
          const formattedDate = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
          setDateParam(formattedDate);
        }}
        onTimeChange={(time) => {
          setTime(time);
          const formattedTime = `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}:00`;
          setSlotParam(formattedTime);
        }}
        dateProps={{
          isInvalid:
            isWeekend(date!, locale) ||
            disabledDates[0].map((d) => d.compare(date!)).includes(0)
        }}
      />
    ),
    2: <DoctorSelection />,
    3: <PatientSelection />
  };

  const disabledMap: Record<number, boolean> = {
    0: !uid,
    1: !dateParam || !slotParam || isInvalidDate || isInvalidTime,
    2: !did,
    3: false
  };

  const titleMap: Record<number, string> = {
    0: 'Select Patient',
    1: 'Select Date & Time',
    2: 'Select Doctor',
    3: 'Confirm Appointment'
  };

  return (
    <>
      <div className="relative flex h-screen w-96 min-w-96 max-w-96 flex-col justify-between border-r shadow-lg">
        <div className="flex flex-col">
          <div className="flex flex-col gap-4 p-4">
            <div>
              <Link href="/appointments" className="underline">
                <Icon icon="tabler:chevron-left" />
                Cancel
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold">Book An Appointment</h2>
            </div>
          </div>
          <Divider className="w-full border-t border-solid" />
          <div className="flex flex-col p-4">
            <div className="mb-2 text-sm font-semibold">{titleMap[step]}</div>
            <div>{stepMap[step]}</div>
          </div>
        </div>
        <div className="fixed bottom-0 flex w-[382px] justify-end gap-2 border-t border-solid bg-background/60 p-4 backdrop-blur-lg">
          {step > 0 && (
            <Button
              onPress={() => {
                setStep((step - 1) % 4);
              }}
              variant="light"
            >
              Back
            </Button>
          )}
          <Button
            color="primary"
            onPress={() => {
              setStep((step + 1) % 4);
            }}
            isDisabled={disabledMap[step]}
          >
            Continue
          </Button>
        </div>
      </div>
    </>
  );
}

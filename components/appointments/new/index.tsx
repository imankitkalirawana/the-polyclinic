'use client';

import {
  type CalendarDate,
  getLocalTimeZone,
  today,
  isWeekend,
  Time,
  parseAbsoluteToLocal
} from '@internationalized/date';
import type { DateValue } from '@react-aria/calendar';
import { useLocale, useDateFormatter } from '@react-aria/i18n';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { LeftPanel } from './calendar/left-panel';
import { getUserWithUID } from '@/functions/server-actions';
import { UserType } from '@/models/User';
import { Calendar, TimeInput, TimeInputValue } from '@nextui-org/react';
import { useQueryState } from 'nuqs';

export default function Appointments() {
  const router = useRouter();
  const { locale } = useLocale();

  const [dateParam, setDateParam] = useQueryState('date', {
    defaultValue: today(getLocalTimeZone()).toString()
  });
  const [slotParam, setSlotParam] = useQueryState('slot', {
    defaultValue: new Date()
      .toLocaleTimeString('en-IN', { hour12: false })
      .split(' ')[0]
  });
  const [uid, setUIDParam] = useQueryState('uid');

  const [date, setDate] = React.useState(today(getLocalTimeZone()));
  const [time, setTime] = React.useState<TimeInputValue | null>(
    (() => {
      const localDateTime = new Date(`${dateParam}T${slotParam}`); // Interpret as local time
      const currentHour = localDateTime.getHours();
      const currentMinute = localDateTime.getMinutes();

      // Default to 09:00 AM if current time is earlier than 09:00 AM
      if (currentHour < 9 || (currentHour === 9 && currentMinute === 0)) {
        return new Time(9, 0);
      }

      // Default to 05:00 PM if current time is later than 05:00 PM
      if (currentHour > 17 || (currentHour === 17 && currentMinute === 0)) {
        return new Time(17, 0);
      }

      // Use current time otherwise
      return new Time(currentHour, currentMinute);
    })()
  );

  const [user, setUser] = React.useState<UserType | null>(null);
  const [users, setUsers] = React.useState<UserType[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

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

  React.useEffect(() => {
    const fetchData = async () => {
      if (!uid) {
        setIsLoading(false);
        return;
      } else {
        setIsLoading(true);
        await getUserWithUID(parseInt(uid))
          .then((user) => {
            if (!user) return;
            setUser(user as UserType);
          })
          .finally(() => setIsLoading(false));
      }
    };
    // fetchData();
  }, [uid]);

  return (
    <div className="bg-gray-1 mx-auto w-full max-w-max rounded-md px-8 py-6">
      <div className="flex flex-col gap-6 md:flex-row">
        <LeftPanel
          isLoading={isLoading}
          user={user as UserType}
          users={users}
        />
        <div className="flex flex-col gap-4">
          <Calendar
            aria-label="Date (Min Date Value)"
            defaultValue={today(getLocalTimeZone())}
            minValue={today(getLocalTimeZone())}
            value={date}
            onChange={handleChangeDate}
            isInvalid={isWeekend(date!, locale)}
            errorMessage={
              isWeekend(date!, locale) ? 'We are closed on weekends' : ''
            }
            showMonthAndYearPickers
            showHelper
            isDateUnavailable={(date) => {
              return isWeekend(date, locale);
            }}
          />
          <TimeInput
            label="Appointment Time"
            minValue={new Time(9)}
            maxValue={new Time(17)}
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
        {/* <FormPanel
          user={user as UserType}
          date={slotParam as string}
          isLoading={isLoading}
          doctors={doctors}
        /> */}
      </div>
    </div>
  );
}

'use client';

import { Calendar } from '@/components/calendar';

import {
  type CalendarDate,
  CalendarDate as CalendarDateClass,
  getLocalTimeZone,
  getWeeksInMonth,
  today
} from '@internationalized/date';
import type { DateValue } from '@react-aria/calendar';
import { useLocale } from '@react-aria/i18n';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { LeftPanel } from './calendar/left-panel';
import { RightPanel } from './calendar/right-panel';
import { FormPanel } from './calendar/form-panel';
import { getAllPatients, getUserWithUID } from '@/functions/server-actions';
import { User } from '@/lib/interface';
import { toast } from 'sonner';
import { DoctorType } from '@/models/Doctor';
import axios from 'axios';

export default function Appointments() {
  const router = useRouter();
  const { locale } = useLocale();

  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');
  const slotParam = searchParams.get('slot');
  const uid = searchParams.get('uid');
  const timeZone = getLocalTimeZone();

  const [date, setDate] = React.useState(today(getLocalTimeZone()));
  const [focusedDate, setFocusedDate] = React.useState<CalendarDate | null>(
    date
  );
  const [user, setUser] = React.useState<User | null>(null);
  const [users, setUsers] = React.useState<User[]>([]);
  const [doctors, setDoctors] = React.useState<DoctorType[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const weeksInMonth = getWeeksInMonth(focusedDate as DateValue, locale);

  const handleChangeDate = (date: DateValue) => {
    setDate(date as CalendarDate);
    const formattedDate = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;

    const url = new URL(window.location.href);
    url.searchParams.set('date', formattedDate);
    router.push(url.toString());
  };

  React.useEffect(() => {
    if (dateParam) {
      const [year, month, day] = dateParam.split('-').map(Number);
      const calendarDate = new CalendarDateClass(year, month, day);
      setDate(calendarDate);
    } else {
      const url = new URL(window.location.href);
      const formattedDate = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
      url.searchParams.set('date', formattedDate);
      router.push(url.toString());
    }
  }, []);

  const handleChangeAvailableTime = (time: string) => {
    const timeValue = time.split(':').join(' ');

    const match = timeValue.match(/^(\d{1,2}) (\d{2})([ap]m)?$/i);
    if (!match) {
      console.error('Invalid time format');
      return null;
    }

    let hours = Number.parseInt(match[1]);
    const minutes = Number.parseInt(match[2]);
    const isPM = match[3] && match[3].toLowerCase() === 'pm';

    if (isPM && (hours < 1 || hours > 12)) {
      console.error('Time out of range (1-12) in 12-hour format');
      return null;
    }

    if (isPM && hours !== 12) {
      hours += 12;
    } else if (!isPM && hours === 12) {
      hours = 0;
    }

    const currentDate = date.toDate(timeZone);
    currentDate.setHours(hours, minutes);

    if (currentDate.toISOString() < new Date().toISOString()) {
      toast.error('Cannot book appointments in the past');
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set('slot', currentDate.toISOString());
    router.push(url.toString());
  };

  const showForm = !!dateParam && !!slotParam;

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
            setUser(user as User);
          })
          .finally(() => setIsLoading(false));
      }
    };
    fetchData();
  }, [uid]);

  React.useEffect(() => {
    const fetchData = async () => {
      await axios.get('/api/doctors').then((res) => {
        setDoctors(res.data);
      });
      await getAllPatients()
        .then((users) => {
          setUsers(users);
        })
        .finally(() => setIsLoading(false));
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gray-1 mx-auto w-full max-w-max rounded-md px-8 py-6">
      <div className="flex gap-6">
        <LeftPanel isLoading={isLoading} user={user as User} users={users} />
        {!showForm ? (
          <>
            <Calendar
              minValue={today(getLocalTimeZone())}
              defaultValue={today(getLocalTimeZone())}
              value={date}
              onChange={handleChangeDate}
              onFocusChange={(focused) => setFocusedDate(focused)}
            />
            <RightPanel
              {...{ date, timeZone, weeksInMonth, handleChangeAvailableTime }}
            />
          </>
        ) : (
          <FormPanel
            user={user as User}
            date={slotParam}
            isLoading={isLoading}
            doctors={doctors}
          />
        )}
      </div>
    </div>
  );
}

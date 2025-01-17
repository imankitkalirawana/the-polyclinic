'use client';

import {
  CalendarDate,
  getLocalTimeZone,
  Time,
  today
} from '@internationalized/date';
import * as React from 'react';
import { parseAsInteger, useQueryState } from 'nuqs';
import HorizontalSteps from './horizontal-steps';
import PatientSelection from './patient-selection';
import DateTimePicker from './date-time-picker';
import PatientProfile from './patient-profile';
import { cn, TimeInputValue } from '@nextui-org/react';
import AppointmentSummary from './summary';
import DoctorSelection from './doctor-selection';
import Sidebar from './sidebar';
import { TIMINGS } from '@/lib/config';

export default function Appointments() {
  const [step, setStep] = useQueryState('step', parseAsInteger.withDefault(0));

  const [dateParam] = useQueryState('date', {
    defaultValue: today(getLocalTimeZone()).toString()
  });
  const [slotParam] = useQueryState('slot', {
    defaultValue: new Date()
      .toLocaleTimeString('en-IN', { hour12: false })
      .split(' ')[0]
  });

  const stepMap: Record<number, React.ReactNode> = {
    0: (
      <div
        className={cn(
          'flex w-full flex-col items-center justify-center gap-4 sm:items-start md:flex-row',
          {
            'flex-col sm:flex-row': step === 1
          }
        )}
      >
        <PatientSelection />
        {<PatientProfile />}
      </div>
    ),
    1: (
      <div
        className={cn(
          'flex w-full flex-col items-center justify-center gap-4 sm:items-start md:flex-row',
          {
            'flex-col sm:flex-row': step === 1
          }
        )}
      >
        <PatientProfile />
        <DateTimePicker />
      </div>
    ),
    2: (
      <div
        className={cn(
          'flex w-full flex-col items-center justify-center gap-4 sm:items-start md:flex-row',
          {
            'flex-col sm:flex-row': step === 1
          }
        )}
      >
        <PatientProfile />
        <DateTimePicker />
        <DoctorSelection />
      </div>
    ),
    3: (
      <div
        className={cn(
          'flex w-full flex-col items-center justify-center gap-4 sm:items-start md:flex-row',
          {
            'flex-col sm:flex-row': step === 1
          }
        )}
      >
        <PatientProfile />
        <DateTimePicker />
        <AppointmentSummary />
      </div>
    )
  };

  return (
    <div className="mx-auto flex max-w-8xl">
      <Sidebar />
    </div>
  );
}

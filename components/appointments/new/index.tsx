'use client';

import { getLocalTimeZone, today } from '@internationalized/date';
import * as React from 'react';
import { parseAsInteger, useQueryState } from 'nuqs';
import HorizontalSteps from './horizontal-steps';
import PatientSelection from './patient-selection';
import DateTimePicker from './date-time-picker';
import PatientProfile from './patient-profile';
import { UserType } from '@/models/User';
import { useQuery } from '@tanstack/react-query';
import { getUserWithUID } from '@/functions/server-actions';
import { cn } from '@nextui-org/react';
import { FormPanel } from './calendar/form-panel';
import AppointmentSummary from './summary';
import DoctorSelection from './doctor-selection';

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

  const [uid] = useQueryState('uid');

  const {
    data: user,
    isError,
    isLoading
  } = useQuery<UserType>({
    queryKey: ['user', uid],
    queryFn: () => {
      if (!uid) {
        console.error('Invalid UID');
        return Promise.reject('Invalid UID');
      }
      return getUserWithUID(parseInt(uid));
    },
    enabled: !!uid
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
        {<PatientProfile user={user} />}
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
        <PatientProfile user={user} />
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
        <PatientProfile user={user} />
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
        <PatientProfile user={user} />
        <DateTimePicker />
        <AppointmentSummary />
      </div>
    )
  };

  return (
    <div className="mx-auto w-full p-4">
      <div className="flex flex-col items-center gap-6">
        <HorizontalSteps
          onStepChange={(value) => {
            // if (value < step) {
            setStep(value);
            // }
          }}
          currentStep={step}
          steps={[
            {
              title: 'Choose a Patient'
            },
            {
              title: 'Date & Time'
            },
            {
              title: 'Fill in Details'
            },
            {
              title: 'Complete Payment'
            }
          ]}
        />
        {stepMap[step]}
      </div>
    </div>
  );
}

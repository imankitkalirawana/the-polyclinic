'use client';

import { getLocalTimeZone, today } from '@internationalized/date';
import * as React from 'react';
import { parseAsInteger, useQueryState } from 'nuqs';
import HorizontalSteps from './horizontal-steps';
import PatientSelection from './patient-selection';
import DateTimePicker from './date-time-picker';

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

  const stepMap: Record<number, React.ReactNode> = {
    0: <PatientSelection />,
    1: <DateTimePicker />,
    2: <div>Step 3</div>,
    3: <div>Step 4</div>
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
        <PatientSelection />
        {/* {stepMap[step]} */}
      </div>
    </div>
  );
}

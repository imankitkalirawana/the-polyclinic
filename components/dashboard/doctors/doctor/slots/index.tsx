'use client';

import { useState } from 'react';
import { ConfigurationPanel } from './configuration-panel';
import { CalendarPreview } from './calendar-preview';
import type { AppointmentConfig } from './types';
import { Formik, FormikProps, useFormik } from 'formik';

const initialValues: AppointmentConfig = {
  title: '',
  duration: 60,
  availability: {
    type: 'weekly',
    schedule: {
      monday: {
        enabled: true,
        slots: [{ id: '1', start: '09:00', end: '17:00' }],
      },
      tuesday: {
        enabled: true,
        slots: [{ id: '1', start: '09:00', end: '17:00' }],
      },
      wednesday: {
        enabled: true,
        slots: [{ id: '1', start: '09:00', end: '17:00' }],
      },
      thursday: {
        enabled: true,
        slots: [{ id: '1', start: '09:00', end: '17:00' }],
      },
      friday: {
        enabled: true,
        slots: [{ id: '1', start: '09:00', end: '17:00' }],
      },
      saturday: {
        enabled: false,
        slots: [{ id: '1', start: '09:00', end: '17:00' }],
      },
      sunday: {
        enabled: false,
        slots: [{ id: '1', start: '09:00', end: '17:00' }],
      },
    },
  },
  schedulingWindow: {
    type: 'available_now',
    maxAdvanceDays: 60,
    minAdvanceHours: 4,
  },
  bufferTime: 0,
  maxBookingsPerDay: null,
  guestPermissions: {
    canInviteOthers: true,
  },
  timezone: 'GMT+05:30',
};

export function AppointmentScheduler() {
  const [config, setConfig] = useState<AppointmentConfig>(initialValues);

  const formik = useFormik<AppointmentConfig>({
    initialValues: initialValues,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const updateConfig = (updates: Partial<AppointmentConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = (values: AppointmentConfig) => {
    console.log(values);
  };

  return (
    <div className="flex h-screen">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik: FormikProps<AppointmentConfig>) => (
          <>
            <ConfigurationPanel formik={formik} />
            <CalendarPreview config={formik.values} />
          </>
        )}
      </Formik>
    </div>
  );
}

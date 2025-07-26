'use client';
import { Formik, FormikProps } from 'formik';
import { useClipboard } from 'react-haiku';

import type { SlotConfig } from '@/types/slots';

import { CalendarPreview } from './calendar-preview';
import { ConfigurationPanel } from './configuration-panel';

const initialValues: SlotConfig = {
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
    specificDates: [],
  },
  bufferTime: 0,
  maxBookingsPerDay: null,
  guestPermissions: {
    canInviteOthers: false,
  },
  timezone: 'GMT+05:30',
};

export function AppointmentScheduler() {
  const { copy } = useClipboard();
  const handleSubmit = (values: SlotConfig) => {
    copy(JSON.stringify(values));
  };

  return (
    <div className="flex h-full">
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formik: FormikProps<SlotConfig>) => (
          <>
            <ConfigurationPanel formik={formik} />
            <CalendarPreview config={formik.values} />
          </>
        )}
      </Formik>
    </div>
  );
}

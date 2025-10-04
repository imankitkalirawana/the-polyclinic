'use client';

import { Formik, FormikProps } from 'formik';

import { ConfigurationPanel } from './configuration-panel';
import { SlotsPreview } from './slots-preview';

import { SlotConfig, useSlotsByUID, useUpdateSlots } from '@/services/client/doctor';

const initialValues: SlotConfig = {
  title: '',
  duration: 30,
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
  timezone: 'Asia/Kolkata',
};

export function AppointmentScheduler({ uid }: { uid: string }) {
  const updateSlots = useUpdateSlots(uid);
  const { data: slots } = useSlotsByUID(uid);

  const handleSubmit = async (values: SlotConfig) => {
    await updateSlots.mutateAsync(values);
  };

  return (
    <div className="flex h-full">
      <Formik initialValues={slots || initialValues} onSubmit={handleSubmit} enableReinitialize>
        {(formik: FormikProps<SlotConfig>) => (
          <>
            <ConfigurationPanel formik={formik} />
            <div className="w-full flex-1 overflow-scroll">
              <SlotsPreview config={formik.values} />
            </div>
          </>
        )}
      </Formik>
    </div>
  );
}

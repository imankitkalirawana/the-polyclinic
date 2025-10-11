'use client';

import React from 'react';
import { addToast } from '@heroui/react';

import CreateAppointmentAdditionalDetails from './additional-details';
import AppointmentType from './appointment-type';
import AppointmentBookingConfirmation from './confirmation';
import DateSelectionContainer from './date';
import DoctorSelection from './doctor';
import PatientSelection from './patient';
import AppointmentBookingReceipt from './receipt';
import { CreateAppointmentSidebar } from './sidebar';
import { CreateAppointmentFormProvider, useCreateAppointmentForm } from './context';
import { CreateAppointmentFormValues } from './schema';

import { useCreateAppointment } from '@/services/client/appointment/query';
import { cn } from '@/lib/utils';
import { useKeyPress } from '@/hooks/useKeyPress';

const contentMap: Record<number, React.ReactNode> = {
  0: <PatientSelection />,
  1: <AppointmentType />,
  2: <DoctorSelection />,
  3: <DateSelectionContainer />,
  4: <CreateAppointmentAdditionalDetails />,
};

export default function CreateAppointment({ date, isModal }: { date?: Date; isModal?: boolean }) {
  const createAppointment = useCreateAppointment();

  const handleSubmit = async (values: CreateAppointmentFormValues) => {
    try {
      const { data } = await createAppointment.mutateAsync(values.appointment);
      if (data && typeof data.aid !== 'undefined') {
        // Update form state to show receipt
        // This will be handled by the context provider
      }
      // Handle success state updates
    } catch (error) {
      if (error instanceof Error) {
        addToast({
          title: 'Failed to create appointment',
          description: `${error.message}`,
          color: 'danger',
        });
      }
      console.error(error);
    }
  };

  return (
    <CreateAppointmentFormProvider
      defaultValues={{
        appointment: {
          date: date ?? new Date(new Date().setHours(9, 0, 0, 0)),
        },
      }}
      onSubmit={handleSubmit}
    >
      <div className={cn('flex h-[calc(100vh-3.75rem)]', isModal && 'h-screen')}>
        <MainContent />
      </div>
    </CreateAppointmentFormProvider>
  );
}

function MainContent() {
  const { form, values } = useCreateAppointmentForm();

  useKeyPress(
    ['Control', 'Backspace'],
    () => {
      if (values.meta.currentStep > 0) {
        form.setValue('meta.currentStep', values.meta.currentStep - 1);
      }
    },
    {
      capture: true,
    }
  );

  return (
    <>
      <CreateAppointmentSidebar
        currentStep={values.meta.currentStep}
        setCurrentStep={(step) => form.setValue('meta.currentStep', step)}
      />
      {contentMap[values.meta.currentStep]}
      {values.meta.showConfirmation && <AppointmentBookingConfirmation />}
      {values.meta.showReceipt && <AppointmentBookingReceipt />}
    </>
  );
}

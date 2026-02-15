'use client';

import React, { createContext, useContext } from 'react';
import { addToast } from '@heroui/react';
import { useForm, UseFormReturn, FormProvider } from 'react-hook-form';

import CreateAppointmentAdditionalDetails from './additional-details';
import AppointmentType from './appointment-type';
import AppointmentBookingConfirmation from './confirmation';
import DateSelectionContainer from './date';
import DoctorSelection from './doctor';
import PatientSelection from './patient';
import AppointmentBookingReceipt from './receipt';
import { CreateAppointmentSidebar } from './sidebar';
import { CreateAppointmentFormValues } from './types';

import { useCreateAppointment } from '@/services/client/appointment/appointment.query';
import { cn } from '@heroui/react';
import { useKeyPress } from '@/hooks/useKeyPress';
import { BookQueueSteps } from './data';

const contentMap: Record<number, React.ReactNode> = {
  0: <PatientSelection />,
  1: <AppointmentType />,
  2: <DoctorSelection />,
  3: <DateSelectionContainer />,
  4: <CreateAppointmentAdditionalDetails />,
};

type CreateAppointmentContextType = UseFormReturn<CreateAppointmentFormValues> & {
  onSubmit: (values: CreateAppointmentFormValues) => Promise<void>;
};

const CreateAppointmentContext = createContext<CreateAppointmentContextType | null>(null);

export const useCreateAppointmentForm = () => {
  const context = useContext(CreateAppointmentContext);
  if (!context) {
    throw new Error('useCreateAppointmentForm must be used within CreateAppointmentProvider');
  }
  return context;
};

export default function NewAppointment({ date, isModal }: { date?: Date; isModal?: boolean }) {
  const createAppointment = useCreateAppointment();

  const form = useForm<CreateAppointmentFormValues>({
    defaultValues: {
      appointment: {
        date: date ?? new Date(new Date().setHours(9, 0, 0, 0)),
        type: 'consultation',
        additionalInfo: {
          notes: '',
          mode: 'online',
          symptoms: '',
        },
        patientId: '',
        doctorId: '',
        previousAppointment: '',
      },
      meta: {
        currentStep: 0,
        showConfirmation: false,
        showReceipt: false,
        createNewPatient: false,
        knowYourDoctor: false,
      },
    },
  });

  const onSubmit = async (values: CreateAppointmentFormValues) => {
    try {
      await createAppointment.mutateAsync(values.appointment);
      form.setValue('meta.showConfirmation', false);
      form.setValue('meta.showReceipt', true);
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

  const currentStep = form.watch('meta.currentStep');

  const contextValue = {
    ...form,
    onSubmit,
  };

  return (
    <FormProvider {...form}>
      <CreateAppointmentContext.Provider value={contextValue}>
        <div className={cn('flex h-[calc(100vh-3.75rem)]', isModal && 'h-screen')}>
          <CreateAppointmentSidebar
            currentStep={Object.values(BookQueueSteps)[currentStep]}
            setCurrentStep={(step) =>
              form.setValue('meta.currentStep', Object.keys(BookQueueSteps).indexOf(step))
            }
          />
          <MainContent />
        </div>
      </CreateAppointmentContext.Provider>
    </FormProvider>
  );
}

function MainContent() {
  const { watch, setValue, handleSubmit, onSubmit } = useCreateAppointmentForm();
  const currentStep = watch('meta.currentStep');
  const showConfirmation = watch('meta.showConfirmation');
  const showReceipt = watch('meta.showReceipt');

  useKeyPress(
    ['Control', 'Backspace'],
    () => {
      if (currentStep > 0) {
        setValue('meta.currentStep', currentStep - 1);
      }
    },
    {
      capture: true,
    }
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
      {contentMap[currentStep]}
      {showConfirmation && <AppointmentBookingConfirmation />}
      {showReceipt && <AppointmentBookingReceipt />}
    </form>
  );
}

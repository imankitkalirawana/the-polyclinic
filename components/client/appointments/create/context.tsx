'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateAppointmentFormValues, createAppointmentFormSchema } from './schema';

interface CreateAppointmentFormContextType {
  form: UseFormReturn<CreateAppointmentFormValues>;
  values: CreateAppointmentFormValues;
}

const CreateAppointmentFormContext = createContext<CreateAppointmentFormContextType | null>(null);

export const useCreateAppointmentForm = () => {
  const context = useContext(CreateAppointmentFormContext);
  if (!context) {
    throw new Error('useCreateAppointmentForm must be used within CreateAppointmentFormProvider');
  }
  return context;
};

interface CreateAppointmentFormProviderProps {
  children: React.ReactNode;
  defaultValues?: Partial<CreateAppointmentFormValues>;
  onSubmit?: (values: CreateAppointmentFormValues) => Promise<void> | void;
}

export const CreateAppointmentFormProvider: React.FC<CreateAppointmentFormProviderProps> = ({
  children,
  defaultValues,
  onSubmit,
}) => {
  const form = useForm<CreateAppointmentFormValues>({
    resolver: zodResolver(createAppointmentFormSchema),
    defaultValues: {
      appointment: {
        patientId: '',
        doctorId: '',
        date: new Date(new Date().setHours(9, 0, 0, 0)),
        type: 'consultation',
        additionalInfo: {
          notes: '',
          mode: 'online',
          symptoms: '',
        },
        previousAppointment: '',
      },
      meta: {
        currentStep: 0,
        showConfirmation: false,
        showReceipt: false,
        createNewPatient: false,
        knowYourDoctor: false,
      },
      ...defaultValues,
    },
  });

  // Handle form submission
  const handleFormSubmit = async (values: CreateAppointmentFormValues) => {
    if (onSubmit) {
      try {
        await onSubmit(values);
        // On successful submission, show receipt and hide confirmation
        form.setValue('meta.showConfirmation', false);
        form.setValue('meta.showReceipt', true);
      } catch (error) {
        // Error handling is done in the parent component
        console.error('Form submission error:', error);
      }
    }
  };

  const values = form.watch();

  const contextValue = useMemo(
    () => ({
      form: {
        ...form,
        handleSubmit: form.handleSubmit(handleFormSubmit),
      },
      values,
    }),
    [form, values, handleFormSubmit]
  );

  return (
    <CreateAppointmentFormContext.Provider value={contextValue}>
      {children}
    </CreateAppointmentFormContext.Provider>
  );
};
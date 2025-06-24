'use client';
import React, { createContext, useContext } from 'react';
import { useFormik } from 'formik';
import { useQueryState } from 'nuqs';

import { ActionType } from './appointment-details-modal';

import { AppointmentType } from '@/types/appointment';
import { AuthUser } from '@/types/user';
import { useAllAppointments } from '@/services/appointment';

interface FormType {
  selected: AppointmentType | null;
  modal: ActionType | null;
}

interface FormContextType {
  formik: ReturnType<typeof useFormik<FormType>>;
  appointments: AppointmentType[];
  refetch: () => void;
  isLoading: boolean;
  session?: AuthUser | null;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: AuthUser | null;
}) => {
  const [date] = useQueryState('date', {
    defaultValue: new Date().toISOString().split('T')[0],
  });

  const { data, refetch, isLoading } = useAllAppointments();

  const appointments = data || [];

  const formik = useFormik<FormType>({
    initialValues: {
      selected: null,
      modal: null,
    },
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <FormContext.Provider
      value={{ formik, appointments, refetch, isLoading, session }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};

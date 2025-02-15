'use client';
import React, { createContext, useContext } from 'react';
import { useFormik } from 'formik';
import { AppointmentType } from '@/models/Appointment';
import { ActionType } from './appointment-details-modal';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useQueryState } from 'nuqs';

interface FormType {
  selected: AppointmentType | null;
  modal: ActionType | null;
}

interface FormContextType {
  formik: ReturnType<typeof useFormik<FormType>>;
  appointments: AppointmentType[];
  refetch: () => void;
  isLoading: boolean;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [date, setDate] = useQueryState('date', {
    defaultValue: new Date().toISOString().split('T')[0]
  });

  const { data, refetch, isLoading } = useQuery<AppointmentType[]>({
    queryKey: ['appointments', date],
    queryFn: async () => {
      const response = await axios.get(`/api/v1/appointments?date=${date}`);
      return response.data;
    }
  });

  const appointments = data || [];

  const formik = useFormik<FormType>({
    initialValues: {
      selected: null,
      modal: null
    },
    onSubmit: async (values) => {
      console.log(values);
    }
  });

  return (
    <FormContext.Provider value={{ formik, appointments, refetch, isLoading }}>
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

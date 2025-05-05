'use client';
import React, { createContext, useContext, useMemo } from 'react';
import { useFormik } from 'formik';

import { AppointmentType } from '@/models/Appointment';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getAllAppointments } from '@/functions/server-actions/appointment';
import { ActionType } from './types';

interface AppointmentForm {
  selected: AppointmentType | null;
  action: ActionType | null;
}

interface FormContextType {
  formik: ReturnType<typeof useFormik<AppointmentForm>>;
  query: UseQueryResult<AppointmentType[], Error>;
}

const AppointmentContext = createContext<FormContextType | undefined>(
  undefined
);

export const AppointmentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const query: UseQueryResult<AppointmentType[], Error> = useQuery({
    queryKey: ['appointments'],
    queryFn: () => getAllAppointments(),
  });

  const formik = useFormik<AppointmentForm>({
    initialValues: {
      selected: null,
      action: null,
    },
    onSubmit: async (values) => {},
  });

  const contextValue = useMemo(() => ({ formik, query }), [query]);

  return (
    <AppointmentContext.Provider value={contextValue}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = () => {
  const context = useContext(AppointmentContext);

  if (!context) {
    throw new Error('useAppointment must be used within a AppointmentProvider');
  }
  return context;
};

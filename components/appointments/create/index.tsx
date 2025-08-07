'use client';

import React from 'react';
import { FormikConfig } from 'formik';

import AppointmentType from './appointment-type';
import DoctorSelection from './doctor';
import PatientSelection from './patient';
import { CreateAppointmentSidebar } from './sidebar';
import { CreateAppointmentFormValues } from './types';

import { FormikProvider, useSharedFormik } from '@/hooks/useSharedFormik';

const contentMap: Record<number, React.ReactNode> = {
  0: <PatientSelection />,
  1: <AppointmentType />,
  2: <DoctorSelection />,
};

export default function CreateAppointment() {
  const formikConfig: FormikConfig<CreateAppointmentFormValues> = {
    initialValues: {
      appointment: {
        date: new Date(),
        type: 'consultation',
        additionalInfo: {
          notes: '',
          type: 'online',
          symptoms: '',
        },
        patient: undefined,
        doctor: undefined,
        previousAppointment: undefined,
        knowYourDoctor: false,
      },
      meta: {
        currentStep: 0,
      },
    },
    onSubmit: async (values) => {
      console.log(values);
    },
  };

  return (
    <FormikProvider<CreateAppointmentFormValues> formikConfig={formikConfig}>
      <div className="flex h-[calc(100vh-3.75rem)] gap-4 overflow-hidden">
        <CreateAppointmentSidebar />
        <MainContent />
      </div>
    </FormikProvider>
  );
}

function MainContent() {
  const formik = useSharedFormik<CreateAppointmentFormValues>();
  return contentMap[formik.values.meta.currentStep];
}

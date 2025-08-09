'use client';

import React from 'react';
import { Formik, FormikConfig, useFormikContext } from 'formik';

import AppointmentType from './appointment-type';
import DoctorSelection from './doctor';
import PatientSelection from './patient';
import { CreateAppointmentSidebar } from './sidebar';
import { CreateAppointmentFormValues } from './types';

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
    <Formik {...formikConfig}>
      {({ values, setFieldValue }) => (
        <form className="flex h-[calc(100vh-3.75rem)] overflow-hidden">
          <CreateAppointmentSidebar
            currentStep={values.meta.currentStep}
            setCurrentStep={(step) => setFieldValue('meta.currentStep', step)}
          />
          <MainContent />
        </form>
      )}
    </Formik>
  );
}

function MainContent() {
  const { values } = useFormikContext<CreateAppointmentFormValues>();
  return contentMap[values.meta.currentStep];
}

'use client';

import React from 'react';
import { Formik, FormikConfig, useFormikContext } from 'formik';

import CreateAppointmentAdditionalDetails from './additional-details';
import AppointmentType from './appointment-type';
import DateSelectionContainer from './date';
import DoctorSelection from './doctor';
import PatientSelection from './patient';
import AppointmentBookingConfirmation from './receipt';
import { CreateAppointmentSidebar } from './sidebar';
import { CreateAppointmentFormValues } from './types';

const contentMap: Record<number, React.ReactNode> = {
  0: <PatientSelection />,
  1: <AppointmentType />,
  2: <DoctorSelection />,
  3: <DateSelectionContainer />,
  4: <CreateAppointmentAdditionalDetails />,
};

export default function CreateAppointment() {
  const formikConfig: FormikConfig<CreateAppointmentFormValues> = {
    initialValues: {
      appointment: {
        date: new Date(new Date().setHours(9, 0, 0, 0)),
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
        showConfirmation: false,
      },
    },
    onSubmit: async (values) => {
      console.log(values);
    },
  };

  return (
    <Formik {...formikConfig}>
      {({ values, setFieldValue }) => {
        return (
          <div className="flex h-[calc(100vh-3.75rem)]">
            <CreateAppointmentSidebar
              currentStep={values.meta.currentStep}
              setCurrentStep={(step) => setFieldValue('meta.currentStep', step)}
            />
            <MainContent />
          </div>
        );
      }}
    </Formik>
  );
}

function MainContent() {
  const { values } = useFormikContext<CreateAppointmentFormValues>();

  return (
    <>
      {contentMap[values.meta.currentStep]}
      {values.meta.showConfirmation && <AppointmentBookingConfirmation />}
    </>
  );
}

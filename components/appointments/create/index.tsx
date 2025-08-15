'use client';

import React from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { addToast, Button } from '@heroui/react';
import { format } from 'date-fns';
import { Formik, FormikConfig, useFormikContext } from 'formik';

import CreateAppointmentAdditionalDetails from './additional-details';
import AppointmentType from './appointment-type';
import AppointmentBookingConfirmation from './confirmation';
import DateSelectionContainer from './date';
import DoctorSelection from './doctor';
import PatientSelection from './patient';
import AppointmentBookingReceipt from './receipt';
import { CreateAppointmentSidebar } from './sidebar';
import { CreateAppointmentFormValues } from './types';

import { useCreateAppointment } from '@/services/appointment';

const contentMap: Record<number, React.ReactNode> = {
  0: <PatientSelection />,
  1: <AppointmentType />,
  2: <DoctorSelection />,
  3: <DateSelectionContainer />,
  4: <CreateAppointmentAdditionalDetails />,
};

export default function CreateAppointment() {
  const router = useRouter();
  const createAppointment = useCreateAppointment();

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
        showReceipt: false,
      },
    },
    onSubmit: async ({ appointment }, { setFieldValue }) => {
      try {
        const { data } = await createAppointment.mutateAsync(appointment);
        addToast({
          title: 'Appointment created',
          description: `Your appointment is scheduled for ${format(new Date(appointment.date), 'PPp')}`,
          color: 'success',
          endContent: (
            <Button
              size="sm"
              variant="flat"
              color="primary"
              onPress={() => {
                router.push(`/appointments/${data.aid}`);
              }}
            >
              View
            </Button>
          ),
        });
        setFieldValue('appointment.aid', data.aid);
        setFieldValue('meta.showConfirmation', false);
        setFieldValue('meta.showReceipt', true);
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
      {values.meta.showReceipt && <AppointmentBookingReceipt />}
    </>
  );
}

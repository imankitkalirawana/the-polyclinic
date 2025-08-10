'use client';
import { Button } from '@heroui/react';
import { isPast } from 'date-fns';
import { useFormikContext } from 'formik';

import { CreateAppointmentFormValues } from '../types';
import CreateAppointmentContentContainer from '../ui/content-container';
import CreateAppointmentContentHeader from '../ui/header';
import CreateAppointmentTimeSelection from './time';

export default function DateSelectionContainer() {
  const formik = useFormikContext<CreateAppointmentFormValues>();
  const { values, setFieldValue } = formik;

  return (
    <CreateAppointmentContentContainer
      header={
        <CreateAppointmentContentHeader
          title="Date Selection"
          description="Select the date and time for the appointment"
        />
      }
      footer={
        <Button
          variant="shadow"
          color="primary"
          radius="full"
          onPress={() => formik.setFieldValue('meta.currentStep', 4)}
          isDisabled={isPast(values.appointment.date)}
        >
          Next
        </Button>
      }
    >
      <CreateAppointmentTimeSelection
        date={values.appointment.date}
        setDate={(date) => setFieldValue('appointment.date', date)}
      />
    </CreateAppointmentContentContainer>
  );
}

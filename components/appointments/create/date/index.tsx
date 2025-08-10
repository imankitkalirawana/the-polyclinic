'use client';
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
    >
      <CreateAppointmentTimeSelection
        onSubmit={() => setFieldValue('meta.showConfirmation', true)}
        date={values.appointment.date}
        setDate={(date) => setFieldValue('appointment.date', date)}
      />
    </CreateAppointmentContentContainer>
  );
}

'use client';
import { Button } from '@heroui/react';
import { isPast } from 'date-fns';
import { useFormikContext } from 'formik';

import { CreateAppointmentFormValues } from '../types';
import CreateAppointmentContentContainer from '../ui/content-container';
import CreateAppointmentContentHeader from '../ui/header';
import CreateAppointmentTimeSelection from './time';

import { SlotsPreview } from '@/components/dashboard/doctors/doctor/slots/slots-preview';
import { useSlotsByUID } from '@/services/slots';

export default function DateSelectionContainer() {
  const formik = useFormikContext<CreateAppointmentFormValues>();
  const { values, setFieldValue } = formik;
  const { data: slot } = useSlotsByUID(values.appointment.doctor ?? 0);

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
      {values.appointment.doctor ? (
        slot ? (
          <SlotsPreview config={slot} />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-sm text-default-500">No slots available</p>
          </div>
        )
      ) : (
        <CreateAppointmentTimeSelection
          date={values.appointment.date}
          setDate={(date) => setFieldValue('appointment.date', date)}
        />
      )}
    </CreateAppointmentContentContainer>
  );
}

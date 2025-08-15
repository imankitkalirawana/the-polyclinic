'use client';
import { Button, Chip, Kbd } from '@heroui/react';
import { format, isPast } from 'date-fns';
import { useFormikContext } from 'formik';

import { CreateAppointmentFormValues } from '../types';
import CreateAppointmentContentContainer from '../ui/content-container';
import CreateAppointmentContentHeader from '../ui/header';
import CreateAppointmentTimeSelection from './time';

import { SlotsPreview } from '@/components/dashboard/doctors/doctor/slots/slots-preview';
import { useSlotsByUID } from '@/services/slots';
import { useKeyPress } from '@/hooks/useKeyPress';

export default function DateSelectionContainer() {
  const { values, setFieldValue } = useFormikContext<CreateAppointmentFormValues>();
  const { appointment } = values;
  const { data: slot } = useSlotsByUID(values.appointment.doctor ?? 0);

  useKeyPress(
    ['Enter'],
    () => {
      if (appointment.date && !isPast(appointment.date)) {
        setFieldValue('meta.currentStep', 4);
      }
    },
    { capture: true }
  );

  return (
    <CreateAppointmentContentContainer
      header={
        <CreateAppointmentContentHeader
          title="Date Selection"
          description="Select the date and time for the appointment"
          endContent={<div>{format(values.appointment.date, 'PPPp')}</div>}
        />
      }
      footer={
        <>
          <Button
            variant="shadow"
            color="primary"
            radius="full"
            onPress={() => setFieldValue('meta.currentStep', 4)}
            isDisabled={isPast(appointment.date)}
            endContent={<Kbd keys={['enter']} className="bg-transparent" />}
          >
            Next
          </Button>
          <div>
            {isPast(appointment.date) ? (
              <Chip color="danger" variant="dot">
                Slot not available
              </Chip>
            ) : (
              <Chip color="success" variant="dot">
                Available
              </Chip>
            )}
          </div>
        </>
      }
    >
      {appointment.doctor ? (
        slot ? (
          <SlotsPreview
            selected={appointment.date}
            config={slot}
            onSlotSelect={(date) => {
              setFieldValue('appointment.date', date);
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-sm text-default-500">No slots available</p>
          </div>
        )
      ) : (
        <CreateAppointmentTimeSelection
          date={appointment.date}
          setDate={(date) => setFieldValue('appointment.date', date)}
        />
      )}
    </CreateAppointmentContentContainer>
  );
}

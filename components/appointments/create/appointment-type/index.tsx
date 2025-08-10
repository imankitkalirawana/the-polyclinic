'use client';
import { useMemo } from 'react';
import { Button, RadioGroup } from '@heroui/react';
import { useFormikContext } from 'formik';

import { CreateAppointmentFormValues } from '../types';
import CreateAppointmentContentContainer from '../ui/content-container';
import CreateAppointmentContentHeader from '../ui/header';
import CreateAppointmentFollowUp from './follow-up';

import CustomRadio from '@/components/ui/custom-radio';
import { cn } from '@/lib/utils';
import { type AppointmentType, appointmentTypes } from '@/types/appointment';

export default function AppointmentType() {
  const { values, setFieldValue, isSubmitting } = useFormikContext<CreateAppointmentFormValues>();

  const { appointment } = values;

  const isNextButtonDisabled = useMemo(() => {
    return (
      (appointment.type === 'follow-up' && !appointment.previousAppointment) || !appointment.type
    );
  }, [appointment.type, appointment.previousAppointment]);

  return (
    <CreateAppointmentContentContainer
      classNames={{
        endContent: 'p-0',
      }}
      header={
        <CreateAppointmentContentHeader
          title="Appointment Type"
          description="Select the type of appointment you want to book"
          className="items-start"
        />
      }
      footer={
        <Button
          variant="shadow"
          color="primary"
          radius="lg"
          className="btn btn-primary"
          isDisabled={isSubmitting || isNextButtonDisabled}
          onPress={() => setFieldValue('meta.currentStep', 2)}
        >
          Next
        </Button>
      }
      endContent={appointment.type === 'follow-up' && <CreateAppointmentFollowUp />}
    >
      <RadioGroup
        orientation="horizontal"
        value={appointment.type}
        onValueChange={(value) => {
          setFieldValue('appointment.type', value);
          setFieldValue('appointment.previousAppointment', undefined);
        }}
      >
        {appointmentTypes.map((type) => (
          <CustomRadio
            key={type.value}
            value={type.value}
            description={type.description}
            color={type.value === 'emergency' ? 'danger' : 'primary'}
            className={cn({
              'data-[selected=true]:border-danger data-[selected=true]:bg-danger/10':
                type.value === 'emergency',
            })}
          >
            {type.label}
          </CustomRadio>
        ))}
      </RadioGroup>
    </CreateAppointmentContentContainer>
  );
}

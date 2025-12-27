'use client';
import { useMemo } from 'react';
import { Button, Kbd, RadioGroup } from '@heroui/react';

import CreateAppointmentContentContainer from '../../(common)/content-container';
import CreateAppointmentContentHeader from '../../(common)/header';
import CreateAppointmentFollowUp from './follow-up';
import { useCreateAppointmentForm } from '../index';

import CustomRadio from '@/components/ui/custom-radio';
import { cn } from '@heroui/react';
import { APPOINTMENT_TYPES, AppointmentTypes } from '@/services/client/appointment';
import { useKeyPress } from '@/hooks/useKeyPress';

const isValidAppointmentType = (value: string): value is AppointmentTypes => {
  return Object.values(APPOINTMENT_TYPES).some((type) => type.value === value);
};

export default function AppointmentType() {
  const { watch, setValue, formState } = useCreateAppointmentForm();

  const appointment = watch('appointment');
  const { isSubmitting } = formState;

  const isNextButtonDisabled = useMemo(() => {
    return (
      (appointment.type === APPOINTMENT_TYPES.follow_up.value &&
        !appointment.previousAppointment) ||
      !appointment.type
    );
  }, [appointment.type, appointment.previousAppointment]);

  useKeyPress(
    ['Enter'],
    () => {
      if (
        appointment.type === APPOINTMENT_TYPES.follow_up.value &&
        appointment.previousAppointment
      ) {
        setValue('meta.currentStep', 3);
      } else if (
        appointment.type === APPOINTMENT_TYPES.consultation.value ||
        appointment.type === APPOINTMENT_TYPES.emergency.value
      ) {
        setValue('meta.currentStep', 2);
      }
    },
    {
      capture: true,
    }
  );
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
          endContent={<Kbd keys={['enter']} className="bg-transparent text-primary-foreground" />}
          onPress={() => {
            if (appointment.type === APPOINTMENT_TYPES.follow_up.value) {
              setValue('meta.currentStep', 3);
            } else {
              setValue('meta.currentStep', 2);
            }
          }}
        >
          Next
        </Button>
      }
      endContent={
        appointment.type === APPOINTMENT_TYPES.follow_up.value && <CreateAppointmentFollowUp />
      }
    >
      <RadioGroup
        orientation="horizontal"
        value={appointment.type}
        onValueChange={(value) => {
          if (isValidAppointmentType(value)) {
            setValue('appointment.type', value);
            setValue('appointment.previousAppointment', undefined);
            setValue('appointment.doctorId', undefined);
          }
        }}
      >
        {Object.values(APPOINTMENT_TYPES).map((type) => (
          <CustomRadio
            key={type.value}
            value={type.value}
            description={type.description}
            color={type.value === APPOINTMENT_TYPES.emergency.value ? 'danger' : 'primary'}
            className={cn({
              'data-[selected=true]:border-danger data-[selected=true]:bg-danger/10':
                type.value === APPOINTMENT_TYPES.emergency.value,
            })}
          >
            {type.label}
          </CustomRadio>
        ))}
      </RadioGroup>
    </CreateAppointmentContentContainer>
  );
}

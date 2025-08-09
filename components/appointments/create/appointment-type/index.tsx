'use client';

import { useMemo, useState } from 'react';
import { Button, Input, RadioGroup, ScrollShadow } from '@heroui/react';
import { useFormikContext } from 'formik';

import { CreateAppointmentFormValues } from '../types';
import CreateAppointmentContentContainer from '../ui/content-container';
import CreateAppointmentContentHeader from '../ui/header';

import CustomRadio from '@/components/ui/custom-radio';
import { castData, cn } from '@/lib/utils';
import { useAllAppointments } from '@/services/appointment';
import { type AppointmentType, appointmentTypes } from '@/types/appointment';

export default function AppointmentType() {
  // TODO: instead of fetching all fetching all fetch for spefici patient
  const { values, setFieldValue, isSubmitting, handleSubmit } =
    useFormikContext<CreateAppointmentFormValues>();
  const { data } = useAllAppointments();

  const [search, setSearch] = useState('');
  const [_previousAppointment, setPreviousAppointment] = useState<AppointmentType['aid']>();

  const { appointment } = values;

  const appointments = castData<AppointmentType[]>(data) || [];

  const filteredAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment) =>
          appointment.patient.name.toLowerCase().includes(search.toLowerCase()) ||
          appointment.aid.toString().includes(search)
      ),
    [appointments, search]
  );

  return (
    <CreateAppointmentContentContainer
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
          onPress={() => handleSubmit()}
          isDisabled={isSubmitting}
        >
          Next
        </Button>
      }
      endContent={
        appointment.type === 'follow-up' && (
          <div className="flex h-full flex-col gap-2">
            <h3 className="text-sm text-default-500">Previous Appointments</h3>
            {appointments.length > 0 ? (
              <>
                <Input
                  placeholder="Search for an appointment"
                  radius="lg"
                  className="max-w-xs"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {filteredAppointments.length > 0 ? (
                  <RadioGroup
                    hideScrollBar
                    as={ScrollShadow}
                    orientation="horizontal"
                    value={appointment.previousAppointment?.toString()}
                    onValueChange={(value) =>
                      setFieldValue('appointment.previousAppointment', parseInt(value))
                    }
                  >
                    {filteredAppointments.map((appointment) => (
                      <CustomRadio
                        key={appointment.aid}
                        value={appointment.aid.toString()}
                        className="rounded-medium p-2"
                        description={`${appointment.patient.name} - ${appointment.doctor?.name}`}
                      >
                        #{appointment.aid}
                      </CustomRadio>
                    ))}
                  </RadioGroup>
                ) : (
                  <p className="text-sm text-default-500">No appointments found for {search}</p>
                )}
              </>
            ) : (
              <p className="text-sm text-default-500">No previous appointments found</p>
            )}
          </div>
        )
      }
    >
      <RadioGroup
        orientation="horizontal"
        value={appointment.type}
        onValueChange={(value) => {
          setFieldValue('appointment.type', value);
          setPreviousAppointment?.(undefined);
        }}
      >
        {appointmentTypes.map((type) => (
          <CustomRadio
            key={type.value}
            value={type.value}
            description={type.description}
            color={type.value === 'emergency' ? 'danger' : 'primary'}
            className={cn({
              'data-[selected=true]:border-danger': type.value === 'emergency',
            })}
          >
            {type.label}
          </CustomRadio>
        ))}
      </RadioGroup>
    </CreateAppointmentContentContainer>
  );
}

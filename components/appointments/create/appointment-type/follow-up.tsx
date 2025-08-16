import { useMemo, useState, useCallback } from 'react';
import { Input, RadioGroup, ScrollShadow } from '@heroui/react';
import { useFormikContext } from 'formik';

import { CreateAppointmentFormValues } from '../types';
import CreateAppointmentSelectedPreviousAppointment from './appointment';

import CustomRadio from '@/components/ui/custom-radio';
import Skeleton from '@/components/ui/skeleton';
import { usePreviousAppointments } from '@/services/patient';
import { AppointmentType } from '@/types/appointment';

function PreviousAppointments({ appointments }: { appointments: AppointmentType[] }) {
  const { values, setFieldValue } = useFormikContext<CreateAppointmentFormValues>();
  const { appointment } = values;
  const [search, setSearch] = useState('');

  const filteredAppointments = useMemo(() => {
    if (!search) return appointments;

    const searchLower = search.toLowerCase();
    return appointments.filter(
      (appointment) =>
        appointment.patient?.name?.toLowerCase().includes(searchLower) ||
        appointment.aid.toString().includes(search)
    );
  }, [appointments, search]);

  const handleRadioChange = useCallback(
    (value: string) => {
      const selectedAppointment = appointments.find((apt) => apt.aid.toString() === value);
      if (selectedAppointment?.doctor?.uid) {
        setFieldValue('appointment.doctor', selectedAppointment.doctor.uid);
      }
      setFieldValue('appointment.previousAppointment', parseInt(value));
    },
    [appointments, setFieldValue]
  );

  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex flex-1 flex-col gap-2 overflow-hidden">
        <h3 className="text-sm text-default-500">Previous Appointments</h3>

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
            onValueChange={handleRadioChange}
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
          <p className="text-sm text-default-500">
            {search ? `No appointments found for ${search}` : 'No appointments available'}
          </p>
        )}
      </div>

      <CreateAppointmentSelectedPreviousAppointment />
    </div>
  );
}

export default function CreateAppointmentFollowUp() {
  const { values } = useFormikContext<CreateAppointmentFormValues>();
  const { appointment } = values;

  const { data: appointments, isLoading } = usePreviousAppointments(appointment.patient ?? 0);

  if (isLoading) {
    return (
      <div className="flex h-full flex-col p-4">
        <div className="flex flex-1 flex-col gap-2 overflow-hidden">
          <Skeleton className="h-8 w-64 rounded-small" />
          <div className="flex flex-col gap-2 overflow-y-auto">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-medium" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="flex h-full flex-col p-4">
        <p className="text-sm text-default-500">No previous appointments found</p>
      </div>
    );
  }

  return <PreviousAppointments appointments={appointments} />;
}

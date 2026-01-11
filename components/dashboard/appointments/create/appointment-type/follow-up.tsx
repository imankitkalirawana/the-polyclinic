import { useMemo, useState, useCallback } from 'react';
import { RadioGroup, ScrollShadow } from '@heroui/react';

import CreateAppointmentSelectedPreviousAppointment from './appointment';
import { useCreateAppointmentForm } from '../index';

import CustomRadio from '@/components/ui/custom-radio';
import { AppointmentType } from '@/services/client/appointment';
import { useDebounce } from '@/hooks/useDebounce';
import Fuse from 'fuse.js';
import { SearchInput } from '@/components/dashboard/appointments/(common)';
import { usePreviousAppointments } from '@/services/client/patient';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';
import { format } from 'date-fns';

function PreviousAppointments({ appointments }: { appointments: AppointmentType[] }) {
  const { watch, setValue } = useCreateAppointmentForm();
  const appointment = watch('appointment');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const fuse = useMemo(() => {
    if (!appointments) return null;
    return new Fuse(appointments, {
      keys: ['patient.name', 'aid', 'doctor.name'],
      threshold: 0.3,
    });
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];
    if (!debouncedSearch.trim() || !fuse) return appointments;

    return fuse.search(debouncedSearch).map((result) => result.item);
  }, [appointments, debouncedSearch, fuse]);

  const handleRadioChange = useCallback(
    (value: string) => {
      const selectedAppointment = appointments.find((apt) => apt.aid.toString() === value);
      if (selectedAppointment?.doctor?.uid) {
        setValue('appointment.doctorId', selectedAppointment.doctor.uid);
      }
      setValue('appointment.previousAppointment', value);
    },
    [appointments, setValue]
  );

  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex flex-1 flex-col gap-2 overflow-hidden">
        <h3 className="text-sm text-default-500">Previous Appointments</h3>

        <SearchInput
          value={search}
          placeholder="Search by patient name or appointment ID"
          onChange={setSearch}
        />

        {filteredAppointments.length > 0 ? (
          <RadioGroup
            hideScrollBar
            as={ScrollShadow}
            orientation="horizontal"
            value={appointment.previousAppointment}
            onValueChange={handleRadioChange}
          >
            {filteredAppointments.map((appointment) => (
              <CustomRadio
                key={appointment.aid}
                value={appointment.aid.toString()}
                className="rounded-medium p-2"
                description={`On ${format(new Date(appointment.date), 'PPp')}`}
              >
                {appointment.patient.name} - {appointment.doctor?.name}
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
  const { watch } = useCreateAppointmentForm();
  const appointment = watch('appointment');

  const { data: appointments, isLoading } = usePreviousAppointments(appointment.patientId);

  if (isLoading) {
    return <MinimalPlaceholder message="Loading previous appointments..." />;
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

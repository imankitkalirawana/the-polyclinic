import { useMemo, useState } from 'react';
import { Input, RadioGroup, ScrollShadow } from '@heroui/react';
import { useFormikContext } from 'formik';

import { CreateAppointmentFormValues } from '../types';
import CreateAppointmentSelectedPreviousAppointment from './appointment';

import CustomRadio from '@/components/ui/custom-radio';
import { castData } from '@/lib/utils';
import { useAllAppointments } from '@/services/appointment';
import { AppointmentType } from '@/types/appointment';

export default function CreateAppointmentFollowUp() {
  const { data } = useAllAppointments();
  const appointments = castData<AppointmentType[]>(data) || [];

  const { values, setFieldValue } = useFormikContext<CreateAppointmentFormValues>();
  const [search, setSearch] = useState('');

  const { appointment } = values;

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
    <div className="flex h-full flex-col p-4">
      <div className="flex flex-1 flex-col gap-2 overflow-hidden">
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
                onValueChange={(value) => {
                  setFieldValue('appointment.previousAppointment', parseInt(value));
                }}
              >
                {filteredAppointments.map((appointment) => (
                  <CustomRadio
                    key={appointment.aid}
                    value={appointment.aid.toString()}
                    className="rounded-medium p-2"
                    description={`${appointment.patient.name} - ${appointment.doctor?.name}`}
                    onClick={() => {
                      setFieldValue('appointment.doctor', appointment.doctor?.uid);
                    }}
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
      <CreateAppointmentSelectedPreviousAppointment />
    </div>
  );
}

'use client';

import { Calendar } from '@/components/ui/calendar';
import { castData } from '@/lib/utils';
import { useAllAppointments } from '@/hooks/queries/client/appointment';
import { AppointmentType } from '@/types/appointment';

export default function Appointments() {
  const { data } = useAllAppointments();

  const appointments = castData<AppointmentType[]>(data);

  return <Calendar appointments={appointments} />;
}

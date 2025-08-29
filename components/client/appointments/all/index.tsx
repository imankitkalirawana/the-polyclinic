'use client';

import { Calendar } from '@/components/ui/calendar';
import { castData } from '@/lib/utils';
import { AppointmentType } from '@/services/client/appointment';
import { useAllAppointments } from '@/services/client/appointment';

export default function Appointments() {
  const { data } = useAllAppointments();

  const appointments = castData<AppointmentType[]>(data);

  return <Calendar appointments={appointments} />;
}

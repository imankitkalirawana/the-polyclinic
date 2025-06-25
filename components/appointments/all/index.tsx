'use client';
import { Calendar } from '@/components/ui/calendar';
import { AppointmentType } from '@/types/appointment';
import { useAllAppointments } from '@/services/appointment';
import { castData } from '@/lib/utils';

export default function Appointments() {
  const { data } = useAllAppointments();

  const appointments = castData<AppointmentType[]>(data);

  return <Calendar appointments={appointments} />;
}

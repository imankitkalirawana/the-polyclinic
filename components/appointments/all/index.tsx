'use client';
import { Calendar } from '@/components/ui/calendar';
import { AppointmentType } from '@/types/appointment';
import { useAllAppointments } from '@/services/appointment';

export default function Appointments() {
  const { data } = useAllAppointments();

  const appointments: AppointmentType[] = data || [];

  return <Calendar appointments={appointments} />;
}

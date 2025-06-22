'use client';
import { Calendar } from '@/components/ui/calendar';
import { getAllAppointments } from '@/app/appointments/helper';
import { AppointmentType } from '@/types/appointment';
import { useQuery } from '@tanstack/react-query';

export default function Appointments() {
  const { data } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => getAllAppointments(),
  });

  const appointments: AppointmentType[] = data || [];

  return <Calendar appointments={appointments} />;
}

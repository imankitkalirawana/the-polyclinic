'use client';
import AppointmentCard from '../ui/appointment-card';
import MinimalCard from '../ui/minimal-card';
import { useAllAppointmentQueues } from '@/services/client/appointment/queue/queue.query';

export default function AllAppointments() {
  const { data: appointments } = useAllAppointmentQueues();
  return (
    <div>
      {appointments?.map((appointment) => (
        <AppointmentCard key={appointment.id} appointment={appointment} />
      ))}
      {appointments?.map((appointment) => (
        <MinimalCard key={appointment.id} appointment={appointment} />
      ))}
    </div>
  );
}

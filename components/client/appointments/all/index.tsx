'use client';

import { Calendar } from '@/components/client/appointments/all/calendar';
import { useAllAppointments } from '@/services/client/appointment';

export default function Appointments() {
  const { data: appointments } = useAllAppointments();

  if (!appointments) {
    return <div>No appointments found</div>;
  }

  return <Calendar appointments={appointments || []} />;
}

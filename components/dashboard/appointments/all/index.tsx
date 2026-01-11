'use client';

import { Calendar } from '@/components/dashboard/appointments/all/calendar';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';
import { useAllAppointments } from '@/services/client/appointment';

export default function Appointments() {
  const { data: appointments } = useAllAppointments();

  if (!appointments) {
    return <MinimalPlaceholder message="No appointments found" isLoading={false} />;
  }

  return <Calendar appointments={appointments || []} />;
}

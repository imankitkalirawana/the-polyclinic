'use client';

import { Calendar } from './calendar';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';
import { useAllAppointmentQueues } from '@/services/client/appointment/queue/queue.query';

export default function QueueCalendarView() {
  const { data: appointments } = useAllAppointmentQueues();

  if (!appointments) {
    return <MinimalPlaceholder message="No appointments found" isLoading={false} />;
  }

  return <Calendar appointments={appointments || []} />;
}

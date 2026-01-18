'use client';
import { useAllAppointmentQueues } from '@/services/client/appointment/queue/queue.query';

export default function PatientQueueView() {
  const { data: appointments } = useAllAppointmentQueues();

  return (
    <div className="p-4">
      <h1>My appointments</h1>
      <p>Appointments: {appointments?.length}</p>
    </div>
  );
}

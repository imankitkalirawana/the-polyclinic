'use client';
import { useAllAppointmentQueues } from '@/services/client/appointment/queue/queue.query';
import { Card } from '@heroui/react';

export default function PatientQueueView() {
  const { data: appointments } = useAllAppointmentQueues();

  return (
    <div className="p-4">
      <h1>My appointments</h1>
      <div className="grid grid-cols-[repeat(auto-fill,400px)] gap-2">
        {appointments?.map((appointment) => (
          <Card key={appointment.id} isPressable>
            <p>{appointment.sequenceNumber}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useGroupedAppointmentQueuesForPatient } from '@/services/client/appointment/queue/queue.query';
import MinimalCard from '../ui/minimal-card';

export default function Completed() {
  const { data: appointments } = useGroupedAppointmentQueuesForPatient();
  const { previous = [] } = appointments ?? {};

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {previous?.map((appointment) => (
          <MinimalCard key={appointment.id} appointment={appointment} />
        ))}
      </div>
    </div>
  );
}

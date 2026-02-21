'use client';

import { useGroupedAppointmentQueuesForPatient } from '@/services/client/appointment/queue/queue.query';
import MinimalCard from '../ui/minimal-card';

export default function Upcoming() {
  const { data: appointments } = useGroupedAppointmentQueuesForPatient();
  const { current, next = [] } = appointments ?? {};

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {current && <MinimalCard key={current.id} appointment={current} />}
        {next?.map((appointment) => <MinimalCard key={appointment.id} appointment={appointment} />)}
      </div>
    </div>
  );
}

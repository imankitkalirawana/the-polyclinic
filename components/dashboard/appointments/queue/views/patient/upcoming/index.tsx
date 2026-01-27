'use client';

import { useGroupedAppointmentQueuesForPatient } from '@/services/client/appointment/queue/queue.query';
import AppointmentCard from '../ui/appointment-card';

export default function Upcoming() {
  const { data: appointments } = useGroupedAppointmentQueuesForPatient();
  const { current, next = [] } = appointments ?? {};

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {current && <AppointmentCard key={current.id} appointment={current} />}
        {next?.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>
    </div>
  );
}

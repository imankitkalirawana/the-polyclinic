'use client';
import AppointmentCard from '../ui/appointment-card';
import MinimalCard from '../ui/minimal-card';
import { useGroupedAppointmentQueuesForPatient } from '@/services/client/appointment/queue/queue.query';

export default function AllAppointments() {
  const { data: appointments } = useGroupedAppointmentQueuesForPatient();

  const { previous = [], current, next = [] } = appointments ?? {};

  return (
    <div>
      <div className="flex gap-4">
        {current && <AppointmentCard appointment={current} />}
        <div className="flex w-full flex-col gap-2 transition-all">
          <h1>All Upcoming Appointments</h1>
          {next
            ?.slice(0, 2)
            .map((appointment) => <MinimalCard key={appointment.id} appointment={appointment} />)}
        </div>
      </div>
      {/* /*previous appointments 3 at the row*/}
      <div className="flex flex-col gap-4 pt-4">
        <h1>Previous Appointments</h1>
        <div className="grid grid-cols-3 gap-4">
          {previous
            ?.slice(0, 3)
            .map((appointment) => <MinimalCard key={appointment.id} appointment={appointment} />)}
        </div>
      </div>
    </div>
  );
}

'use client';
import AppointmentCard from '../ui/appointment-card';
import MinimalCard from '../ui/minimal-card';
import { useAllAppointmentQueues } from '@/services/client/appointment/queue/queue.query';

export default function AllAppointments() {
  const { data: appointments } = useAllAppointmentQueues();
  return (
    <div>
      <div className="flex gap-4">
        {appointments?.[0] && <AppointmentCard appointment={appointments[0]} />}
        <div className="flex w-full flex-col gap-2 transition-all">
          <h1>All Upcoming Appointments</h1>
          {appointments
            ?.slice(1, 3)
            .map((appointment) => <MinimalCard key={appointment.id} appointment={appointment} />)}
        </div>
      </div>
      {/* /*previous appointments 3 at the row*/}
      <div className="flex flex-col gap-4 pt-4">
        <h1>Previous Appointments</h1>
        <div className="flex grid-cols-3 gap-4">
          {appointments
            ?.slice(3, 6)
            .map((appointment) => <MinimalCard key={appointment.id} appointment={appointment} />)}
        </div>
      </div>
    </div>
  );
}

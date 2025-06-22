import { AppointmentType } from '@/types/appointment';
import { useCalendarStore } from '../store';
import { cn } from '@heroui/react';
import StatusRenderer from './status-renderer';
import { formatTime } from '../helper';

export default function AppointmentTriggerItem({
  appointment,
}: {
  appointment: AppointmentType;
}) {
  const { setAppointment } = useCalendarStore();

  return (
    <button
      key={appointment.aid}
      className={cn(
        'flex min-h-6 cursor-pointer items-center justify-start gap-1 truncate rounded-lg p-1 text-tiny hover:bg-default-100 md:px-2',
        {
          'line-through': appointment.status === 'cancelled',
        }
      )}
      onClick={(e) => {
        e.stopPropagation();
        setAppointment(appointment);
      }}
    >
      <StatusRenderer isDotOnly status={appointment.status} />
      <div className="hidden font-light sm:block">
        {formatTime(new Date(appointment.date))}
      </div>
      <div className="font-medium">
        {appointment.patient.name}{' '}
        {appointment.doctor?.name ? `- ${appointment.doctor.name}` : ''}
      </div>
    </button>
  );
}

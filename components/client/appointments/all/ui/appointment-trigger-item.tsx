import React from 'react';
import { cn } from '@heroui/react';

import { formatTime } from '../helper';
import StatusRenderer from './status-renderer';

import { useAppointmentStore } from '@/store/appointment';
import { AppointmentType } from '@/services/client/appointment';

export default function AppointmentTriggerItem({
  appointment,
  openInNewTab = false,
}: {
  appointment: AppointmentType;
  openInNewTab?: boolean;
}) {
  const { setAid } = useAppointmentStore();

  return (
    <button
      title={`${appointment.patient.name} - ${appointment.doctor?.name}`}
      key={appointment.aid}
      className={cn(
        'flex min-h-6 cursor-pointer items-center justify-start gap-1 truncate rounded-lg p-1 text-tiny hover:bg-default-100 md:px-2',
        {
          'line-through': appointment.status === 'cancelled',
          'bg-warning-100/70 hover:bg-warning-100': appointment.type === 'emergency',
        }
      )}
      onClick={(e) => {
        e.stopPropagation();
        if (openInNewTab) {
          window.open(`/appointments/${appointment.aid}`, '_blank');
        } else {
          setAid(appointment.aid);
        }
      }}
    >
      <StatusRenderer isDotOnly status={appointment.status} />
      <div className="hidden font-light sm:block">{formatTime(new Date(appointment.date))}</div>
      <div className="font-medium">
        {appointment.patient.name} {appointment.doctor?.name ? `- ${appointment.doctor.name}` : ''}
      </div>
    </button>
  );
}

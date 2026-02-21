import React from 'react';
import { cn } from '@heroui/react';

import { useAppointmentStore } from '@/services/client/appointment/appointment.store';
import { AppointmentQueue } from '@repo/store';
import RenderChip from '@/components/ui/new-data-table/cell-renderer/render-chip';

export default function AppointmentTriggerItem({
  appointment,
  openInNewTab = false,
}: {
  appointment: AppointmentQueue;
  openInNewTab?: boolean;
}) {
  const { setAid } = useAppointmentStore();

  return (
    <button
      title={`${appointment.patient.name} - ${appointment.doctor?.name}`}
      key={appointment.aid}
      data-testid={`appointment-trigger-item-${appointment.aid}`}
      className={cn(
        'text-tiny hover:bg-default-100 line-clamp-1 flex min-h-6 cursor-pointer items-center justify-start gap-1 rounded-lg p-1 md:px-2'
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
      <RenderChip value={appointment.status} isDotOnly />
      <div className="line-clamp-1 font-medium">
        {appointment.patient.name}
        {appointment.doctor?.name ? ` - ${appointment.doctor.name}` : ''}
      </div>
    </button>
  );
}

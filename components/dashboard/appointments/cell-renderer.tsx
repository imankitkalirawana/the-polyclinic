import { User } from '@heroui/react';
import { format } from 'date-fns';

import { renderChip } from '@/components/ui/data-table/cell-renderers';
import { AppointmentType } from '@/services/client/appointment';

export function ModalCellRenderer({ appointment }: { appointment: AppointmentType }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <User
        name={appointment.patient.name}
        avatarProps={{
          src: appointment.patient.image,
          size: 'sm',
          name: appointment.patient.name,
        }}
        classNames={{
          description: 'text-default-400 text-tiny',
        }}
        description={`#${appointment.aid} - ${format(new Date(appointment.date), 'PP')}`}
      />
      {renderChip({ item: appointment.status })}
    </div>
  );
}

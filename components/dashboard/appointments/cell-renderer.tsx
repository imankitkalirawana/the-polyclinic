import { renderChip } from '@/components/ui/data-table/cell-renderers';
import { AppointmentType } from '@/models/Appointment';
import { cn, User } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { format } from 'date-fns';

export default function CellRenderer({
  icon,
  label,
  value,
  cols = 1,
  className,
  classNames,
}: {
  cols?: number;
  label: string;
  value: string | React.ReactNode;
  icon: string;
  className?: string;
  classNames?: {
    icon?: string;
    label?: string;
    value?: string;
  };
}) {
  return (
    <div
      className={cn('p-4', className)}
      style={{
        gridColumn: `span ${cols} / span ${cols}`,
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'rounded-medium bg-default-200 p-2 text-default-400',
              classNames?.icon
            )}
          >
            <Icon icon={icon} width="24" />
          </div>
          <div>
            <h6
              className={cn(
                'text-xs capitalize text-default-400',
                classNames?.label
              )}
            >
              {label}
            </h6>
            <div
              className={cn(
                'text-sm capitalize text-default-foreground',
                classNames?.value,
                {
                  lowercase: typeof value === 'string' && value.includes('@'),
                }
              )}
            >
              {value}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ModalCellRenderer({
  appointment,
}: {
  appointment: AppointmentType;
}) {
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
          description: 'text-default-400 text-xs',
        }}
        description={`#${appointment.aid} - ${format(new Date(appointment.date), 'PP')}`}
      />
      {renderChip({ item: appointment.status })}
    </div>
  );
}

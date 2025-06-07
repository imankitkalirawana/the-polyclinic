import { chipColorMap } from '@/lib/chip';
import { AppointmentStatus } from '@/models/Appointment';
import { cn, Tooltip } from '@heroui/react';

export default function StatusDot({
  status,
  size = 'sm',
}: {
  status: AppointmentStatus;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClass = {
    sm: 'size-3',
    md: 'size-4',
    lg: 'size-5',
  };

  return (
    <Tooltip
      content={status}
      classNames={{
        content: cn('capitalize', chipColorMap[status].bg),
      }}
    >
      <span
        className={cn(
          'aspect-square',
          sizeClass[size],
          'rounded-full',
          chipColorMap[status].text
        )}
      ></span>
    </Tooltip>
  );
}

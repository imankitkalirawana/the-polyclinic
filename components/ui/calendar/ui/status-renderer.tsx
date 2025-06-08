import { chipColorMap } from '@/lib/chip';
import { AppointmentStatus } from '@/models/Appointment';
import { cn, Tooltip } from '@heroui/react';

export default function StatusRenderer({
  status,
  size = 'sm',
  isDotOnly = false,
  className,
}: {
  status: AppointmentStatus;
  size?: 'sm' | 'md' | 'lg';
  isDotOnly?: boolean;
  className?: string;
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
      isDisabled={!isDotOnly}
    >
      <div className="flex items-center gap-1">
        <span
          className={cn(
            'block aspect-square',
            sizeClass[size],
            'rounded-full',
            chipColorMap[status].text
          )}
        ></span>
        {!isDotOnly && (
          <span className={cn('text-xs capitalize', className)}>
            {status.split('-').join(' ')}
          </span>
        )}
      </div>
    </Tooltip>
  );
}

import React from 'react';
import { cn, Tooltip } from '@heroui/react';

import { chipColorMap } from '@/lib/chip';
import { AppointmentType } from '@/types/client/appointment';

export default function StatusRenderer({
  status,
  size = 'sm',
  isDotOnly = false,
  className,
}: {
  status: AppointmentType['status'];
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
        />
        {!isDotOnly && (
          <span className={cn('text-tiny capitalize', className)}>
            {status.split('-').join(' ')}
          </span>
        )}
      </div>
    </Tooltip>
  );
}

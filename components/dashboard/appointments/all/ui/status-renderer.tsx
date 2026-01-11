import React from 'react';
import { cn, Tooltip } from '@heroui/react';

import { chipColorMap } from '@/lib/chip';
import { AppointmentType } from '@/services/client/appointment';
import { formatLabel } from '@/lib/utils';

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
      content={formatLabel(status)}
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
          <span className={cn('capitalize text-tiny', className)}>
            {status.replace(/[_-]/g, ' ')}
          </span>
        )}
      </div>
    </Tooltip>
  );
}

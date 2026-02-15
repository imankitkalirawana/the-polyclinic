import React from 'react';
import { cn } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

export interface CellRendererProps {
  label?: string;
  value: string | React.ReactNode;
  icon?: string;
  classNames?: {
    icon?: string;
    label?: string;
    value?: string;
  };
  className?: string;
  cols?: number;
  iconSize?: number;
  direction?: 'horizontal' | 'vertical';
}

export function CellRenderer({
  label,
  value,
  icon,
  classNames,
  className,
  iconSize = 24,
  cols = 1,
  direction = 'vertical',
}: CellRendererProps) {
  return (
    <div
      className={cn(
        'p-2',
        {
          'col-span-2': cols === 2,
        },
        className
      )}
    >
      <div className={cn('text-small flex items-center gap-2')}>
        {!!icon && (
          <div className={cn('rounded-small p-[5px]', classNames?.icon)}>
            <Icon icon={icon} width={iconSize} />
          </div>
        )}
        <div
          className={cn('flex w-full flex-col gap-0.5', {
            'flex-row items-center justify-between': direction === 'horizontal',
          })}
        >
          {!!label && (
            <span className={cn('text-default-400 capitalize', classNames?.label)}>{label}</span>
          )}
          <span
            className={cn(
              'text-default-foreground capitalize',
              {
                lowercase: typeof value === 'string' && value.includes('@'),
              },
              classNames?.value
            )}
          >
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}

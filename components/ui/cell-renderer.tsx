import { Icon } from '@iconify/react/dist/iconify.js';
import { cn } from '@heroui/react';

export interface CellRendererProps {
  label?: string;
  value: string | React.ReactNode;
  icon: string;
  classNames?: {
    icon?: string;
    label?: string;
    value?: string;
  };
  className?: string;
  cols?: number;
}

export const CellRenderer = ({
  label,
  value,
  icon,
  classNames,
  className,
  cols = 1,
}: CellRendererProps) => (
  <div className={`p-2 ${cols === 2 ? 'col-span-2' : ''} ${className || ''}`}>
    <div className="flex items-start gap-2 text-sm">
      <div className={cn('rounded-small p-[5px]', classNames?.icon)}>
        <Icon icon={icon} width="24" />
      </div>
      <div className="flex flex-col gap-1">
        <span className={cn('capitalize text-default-400', classNames?.label)}>
          {label}
        </span>
        <span
          className={cn(
            'capitalize text-default-foreground',
            classNames?.value
          )}
        >
          {value}
        </span>
      </div>
    </div>
  </div>
);

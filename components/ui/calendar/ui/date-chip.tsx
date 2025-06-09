import { cn } from '@heroui/react';
import { isToday, format } from 'date-fns';

export default function DateChip({
  date,
  onClick,
  className,
  size = 'sm',
}: {
  date: Date;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClass = {
    sm: 'size-6 text-tiny',
    md: 'size-8 text-small',
    lg: 'size-10 text-medium',
  };

  return (
    <button
      className={cn(
        'mb-1 flex items-center justify-center self-center rounded-full font-medium transition-colors hover:bg-default-100',
        sizeClass[size],
        {
          'bg-primary-500 text-primary-foreground hover:bg-primary-400':
            isToday(date),
        },
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {format(date, 'd')}
    </button>
  );
}

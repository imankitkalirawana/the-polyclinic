import { cn } from '@heroui/react';

export default function DataItem({
  label,
  value,
  alwaysShow = false,
  className,
  classNames,
}: {
  label: string;
  value?: string | null;
  alwaysShow?: boolean;
  className?: string;
  classNames?: {
    label?: string;
    value?: string;
  };
}) {
  if (!value && !alwaysShow) return null;

  return (
    <div className={cn('flex flex-col', className)}>
      <span className={cn('text-default-500 text-tiny', classNames?.label)}>{label}</span>
      <p className={cn('text-small', classNames?.value)}>{value}</p>
    </div>
  );
}

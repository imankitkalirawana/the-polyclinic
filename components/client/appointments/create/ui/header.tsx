import { cn } from '@heroui/react';

export default function CreateAppointmentContentHeader({
  title,
  description,
  endContent,
  className,
}: {
  title: string;
  description?: string;
  endContent?: React.ReactNode | string;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center justify-between gap-1', className)}>
      <div className="flex flex-col">
        <div className="font-semibold text-default-foreground">{title}</div>
        <div className="text-sm text-default-500">{description}</div>
      </div>
      {!!endContent && <div>{endContent}</div>}
    </div>
  );
}

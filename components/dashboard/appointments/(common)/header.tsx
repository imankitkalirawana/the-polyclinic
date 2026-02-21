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
        <div className="text-default-foreground font-semibold">{title}</div>
        <div className="text-default-500 text-sm">{description}</div>
      </div>
      {!!endContent && <div>{endContent}</div>}
    </div>
  );
}

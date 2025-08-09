import { cn } from '@/lib/utils';

export default function CreateAppointmentContentHeader({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-start justify-center gap-1', className)}>
      <div className="text-xl font-semibold leading-9 text-default-foreground">{title}</div>
      <div className="leading-5 text-default-500">{description}</div>
    </div>
  );
}

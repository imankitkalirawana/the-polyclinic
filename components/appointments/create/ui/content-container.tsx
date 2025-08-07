import { cn } from '@/lib/utils';

export default function CreateAppointmentContentContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn('mx-auto flex w-full max-w-md flex-col items-center justify-center', className)}
    >
      {children}
    </div>
  );
}

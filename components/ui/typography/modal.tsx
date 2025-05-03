import { cn } from '@heroui/react';

export function Title({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <>
      <h2 className={cn('text-lg font-semibold', className)}>{title}</h2>
    </>
  );
}

export function Subtitle({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <>
      <h2 className={cn('font-semibold text-default-700', className)}>
        {title}
      </h2>
    </>
  );
}

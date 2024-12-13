import { Skeleton as NextSkeleton, cn } from '@nextui-org/react';

export default function Skeleton({ className }: { className?: string }) {
  return (
    <NextSkeleton
      className={cn('rounded-md before:!duration-1000', className)}
    />
  );
}

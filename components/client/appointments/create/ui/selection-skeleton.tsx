import Skeleton from '@/components/ui/skeleton';

interface SelectionSkeletonProps {
  count?: number;
  className?: string;
}

export default function SelectionSkeleton({ count = 3, className }: SelectionSkeletonProps) {
  return (
    <div className={className} data-testid="selection-skeleton">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="flex items-center gap-4 rounded-large border border-divider p-4 py-2"
        >
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

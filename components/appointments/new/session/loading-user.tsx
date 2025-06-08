import { Card, CardBody } from '@heroui/react';

import Skeleton from '@/components/ui/skeleton';

export const LoadingUsers = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Card
          key={`skeleton-${index}`}
          className="flex min-w-64 flex-row justify-between rounded-medium border-small border-divider p-3 shadow-none transition-all"
        >
          <CardBody className="items-center gap-2 p-8">
            <div>
              <Skeleton className="h-20 w-20 rounded-full" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-4 w-40" />
            </div>
          </CardBody>
        </Card>
      ))}
    </>
  );
};

import { Card } from '@heroui/react';
import React from 'react';

import Skeleton from '../ui/skeleton';

export default function ListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="w-full space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card className="p-4" key={i}>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-6 w-32" /> {/* Title */}
                <Skeleton className="h-4 w-64" /> {/* Description */}
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-20 rounded-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

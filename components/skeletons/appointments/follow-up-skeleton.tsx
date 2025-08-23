import React from 'react';
import { Card } from '@heroui/react';

import Skeleton from '@/components/ui/skeleton';

export default function FollowUpSkeleton() {
  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex flex-1 flex-col gap-2 overflow-hidden">
        {/* Header */}
        <Skeleton className="h-5 w-32" />
        
        {/* Search Input */}
        <Skeleton className="h-10 w-64 rounded-lg" />
        
        {/* Appointment List */}
        <div className="space-y-2">
          {Array.from({ length: SKELETON_APPOINTMENT_COUNT }).map((_, i) => (
            <Card key={i} className="rounded-medium p-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-16" /> {/* Appointment ID */}
                  <Skeleton className="h-4 w-48" /> {/* Patient - Doctor */}
                </div>
                <Skeleton className="h-4 w-4 rounded-full" /> {/* Radio button */}
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Selected Appointment Section */}
      <div className="mt-4">
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>
    </div>
  );
}
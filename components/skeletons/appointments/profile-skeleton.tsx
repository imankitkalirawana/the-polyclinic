import { Card, cn } from '@heroui/react';

import Skeleton from '@/components/ui/skeleton';

export default function ProfileSkeleton({ step = 0 }: { step?: number }) {
  return (
    <Card
      className={cn('w-full space-y-4 p-4', {
        '': step > 0,
      })}
    >
      {/* Profile Header */}
      <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <Skeleton
            className={cn('h-20 w-20 rounded-full', {
              'h-12 w-12': step > 0,
            })}
          />

          {/* Name and Status */}
          <div className="flex flex-col items-start space-y-2">
            <Skeleton className="h-6 w-28" /> {/* User name */}
            <div className="flex items-start gap-2">
              <Skeleton className="h-4 w-12 rounded-full" />{' '}
              {/* User role badge */}
              <Skeleton className="h-4 w-12 rounded-full" />{' '}
              {/* Active status badge */}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />

          <Skeleton className="h-10 w-10 rounded-full" />

          <Skeleton className="h-10 w-10 rounded-full" />

          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="space-y-6">
        <Skeleton className="h-6 w-48" /> {/* Section title */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Full Name */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" /> {/* Label */}
            <Skeleton className="h-6 w-3/4" /> {/* Value */}
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-28" /> {/* Label */}
            <Skeleton className="h-6 w-3/4" /> {/* Value */}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-28" /> {/* Label */}
            <Skeleton className="h-6 w-3/4" /> {/* Value */}
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" /> {/* Label */}
            <Skeleton className="h-6 w-3/4" /> {/* Value */}
          </div>
        </div>
      </div>
    </Card>
  );
}

import Skeleton from '@/components/ui/skeleton';
import { Card, CardBody } from '@nextui-org/react';

export default function ServiceSkeleton() {
  return (
    <>
      <div className="w-full space-y-6">
        {/* Header Section */}

        <div className="grid gap-8 md:grid-cols-2">
          {/* Progress Circle */}
          <div className="flex items-center justify-center">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>

          {/* Right Side Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" /> {/* Test ID */}
              <Skeleton className="h-8 w-48" /> {/* Test Name */}
              <Skeleton className="h-8 w-24" /> {/* Price */}
            </div>
            {/* Estimated Time */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" /> {/* Clock icon */}
              <Skeleton className="h-4 w-40" />
            </div>

            {/* Status Badges */}
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>

            {/* Collapsible Sections */}
            <div className="flex flex-col gap-2">
              {[
                'Description',
                'Test Information',
                'Created By',
                'Updated By'
              ].map((_section, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-4" /> {/* Chevron icon */}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </div>

        {/* Results Table */}
        <Card>
          <CardBody className="p-0">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 border-b bg-default-100 p-4">
              {['Investigation', 'Value', 'Method', 'Unit', 'Inference'].map(
                (header, index) => (
                  <Skeleton key={index} className="h-4 w-24" />
                )
              )}
            </div>
            {/* Table Row */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div className="grid grid-cols-5 gap-4 p-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </>
  );
}

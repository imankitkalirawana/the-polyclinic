'use client';

import { Card } from '@heroui/react';
import Skeleton from '@/components/ui/skeleton';

export default function DashboardTableSkeleton() {
  return (
    <div className="w-full space-y-6 p-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        {/* Left side - Search */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" /> {/* Sort */}
          <Skeleton className="h-6 w-24" /> {/* Columns */}
          <Skeleton className="h-6 w-28 rounded-lg" /> {/* New User button */}
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-64" /> {/* Search bar */}
        </div>
      </div>

      {/* Table */}
      <Card className="w-full overflow-hidden">
        {/* Table Header */}
        <div className="p-2">
          <div className="grid grid-cols-12 rounded-xl border bg-gray-100 p-3 text-sm font-semibold">
            <div className="col-span-1">
              <Skeleton className="h-4 w-4 bg-gray-200" /> {/* Checkbox */}
            </div>
            <div className="col-span-1">
              <Skeleton className="h-4 w-12" /> {/* User ID */}
            </div>
            <div className="col-span-2">
              <Skeleton className="h-4 w-12" /> {/* Name */}
            </div>
            <div className="col-span-3">
              <Skeleton className="h-4 w-12" /> {/* Email */}
            </div>
            <div className="col-span-2">
              <Skeleton className="h-4 w-8" /> {/* Role */}
            </div>
            <div className="col-span-2">
              <Skeleton className="h-4 w-20" /> {/* Created At */}
            </div>
            <div className="col-span-1">
              <Skeleton className="h-4 w-16" /> {/* Actions */}
            </div>
          </div>
        </div>

        {/* Table Rows */}
        {[...Array(9)].map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-12 border-gray-100 p-2 hover:bg-gray-50"
          >
            {/* Checkbox */}
            <div className="col-span-1 flex items-center pl-4">
              <Skeleton className="h-4 w-4 rounded" />
            </div>

            {/* User ID */}
            <div className="col-span-1 flex items-center">
              <Skeleton className="h-4 w-12" />
            </div>

            {/* Name with Avatar */}
            <div className="col-span-2 flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" /> {/* Avatar */}
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" /> {/* Name */}
                <Skeleton className="h-3 w-32" /> {/* Email under name */}
              </div>
            </div>

            {/* Email */}
            <div className="col-span-3 flex items-center pl-6">
              <Skeleton className="h-4 w-48" />
            </div>

            {/* Role Badge */}
            <div className="col-span-2 flex items-center">
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>

            {/* Created At */}
            <div className="col-span-2 flex items-center">
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>

            {/* Actions */}
            <div className="col-span-1 flex items-center justify-center">
              <Skeleton className="h-6 w-6 rounded" />
            </div>
          </div>
        ))}
      </Card>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

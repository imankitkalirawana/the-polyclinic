import { Card } from '@nextui-org/react';
import Skeleton from '../ui/skeleton';

export default function DashboardTableSkeleton() {
  return (
    <>
      <div className="w-full space-y-4">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-72" /> {/* Search bar */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24" /> {/* Status dropdown */}
            <Skeleton className="h-10 w-24" /> {/* Columns dropdown */}
            <Skeleton className="h-10 w-28" /> {/* Add New button */}
          </div>
        </div>

        {/* Total users count */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" /> {/* Total users text */}
          <Skeleton className="h-5 w-40" /> {/* Rows per page */}
        </div>

        {/* Table */}
        <Card className="w-full">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 border-b bg-gray-50 p-4">
            <Skeleton className="h-5 w-16" /> {/* Checkbox column */}
            <Skeleton className="h-5 w-16" /> {/* UID */}
            <Skeleton className="h-5 w-24" /> {/* Name */}
            <Skeleton className="h-5 w-20" /> {/* Phone */}
            <Skeleton className="h-5 w-16" /> {/* Status */}
            <Skeleton className="h-5 w-24" /> {/* Updated At */}
          </div>

          {/* Table Rows */}
          {[...Array(5)].map((_, index) => (
            <div key={index} className="grid grid-cols-6 gap-4 border-b p-4">
              <Skeleton className="h-5 w-16" /> {/* Checkbox column */}
              <Skeleton className="h-5 w-20" /> {/* UID */}
              <Skeleton className="h-5 w-32" /> {/* Name */}
              <Skeleton className="h-5 w-28" /> {/* Phone */}
              <Skeleton className="h-5 w-24" /> {/* Status */}
              <Skeleton className="h-5 w-28" /> {/* Updated At */}
            </div>
          ))}
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between py-4">
          <Skeleton className="h-5 w-32" /> {/* Selected items count */}
          <div className="flex gap-2">
            <Skeleton className="h-8 w-12" /> {/* Previous */}
            <Skeleton className="h-8 w-8" /> {/* Page number */}
            <Skeleton className="h-8 w-12" /> {/* Next */}
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-16" /> {/* Previous */}
            <Skeleton className="h-8 w-16" /> {/* Next */}
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import { getAppointmentStyles } from './appointments';

import { cn } from '@/lib/utils';

export default function StatusReferences() {
  const statuses = [
    'booked',
    'confirmed',
    'in-progress',
    'completed',
    'cancelled',
    'overdue',
    'on-hold',
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {statuses.map((status) => (
        <div key={status} className="flex items-center gap-1">
          <span
            className={cn(
              'block size-4 rounded-md bg-default-500',
              getAppointmentStyles(status as any).avatarBg
            )}
          />
          <span className="text-small capitalize text-default-700">
            {status.split('-').join(' ')}
          </span>
        </div>
      ))}
    </div>
  );
}

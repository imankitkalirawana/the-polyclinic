'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Skeleton from './skeleton';
import { cn } from '@/lib/utils';

export default function FormatTimeInTable({
  date,
  template,
  skeleton,
  className
}: {
  date: string | Date;
  template?: string;
  skeleton?: React.ReactNode;
  className?: string;
}) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(format(new Date(date), template || 'PP p'));
  }, [date]);

  return (
    <div
      className={cn(
        'text-bold whitespace-nowrap text-sm capitalize',
        className
      )}
    >
      {formattedDate
        ? formattedDate
        : skeleton || <Skeleton className="h-5 w-32" />}
    </div>
  );
}

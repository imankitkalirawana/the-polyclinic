'use client';

import React from 'react';
import { cn, Skeleton as NextSkeleton } from '@heroui/react';

export default function Skeleton({ className }: { className?: string }) {
  return <NextSkeleton className={cn('rounded-md before:duration-1000!', className)} />;
}

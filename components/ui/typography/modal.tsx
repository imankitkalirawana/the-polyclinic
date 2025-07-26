import React from 'react';
import { cn } from '@heroui/react';

export function Title({
  title,
  level = 2,
  className,
}: {
  title: string;
  className?: string;
  level?: 1 | 2 | 3 | 4;
}) {
  return (
    <h2
      className={cn(
        `text-${level === 1 ? '2xl' : level === 2 ? 'xl' : level === 3 ? 'lg' : 'base'} font-semibold`,
        className
      )}
    >
      {title}
    </h2>
  );
}

export function Subtitle({
  title,
  className,
  level = 3,
}: {
  title: string;
  className?: string;
  level?: 1 | 2 | 3 | 4;
}) {
  return (
    <h2
      className={cn(
        `text-${level === 1 ? '2xl' : level === 2 ? 'xl' : level === 3 ? 'lg' : 'base'} font-medium`,
        className
      )}
    >
      {title}
    </h2>
  );
}

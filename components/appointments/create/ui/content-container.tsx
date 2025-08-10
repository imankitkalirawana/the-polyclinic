import React from 'react';

import { cn } from '@/lib/utils';

export default function CreateAppointmentContentContainer({
  header,
  children,
  footer,
  endContent,
  className,
  classNames,
}: {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  endContent?: React.ReactNode | null;
  className?: string;
  classNames?: {
    footer?: string;
    endContent?: string;
  };
}) {
  return (
    <div
      className={cn(
        'mx-auto grid h-full w-full',
        {
          'grid-cols-2': !!endContent,
        },
        className
      )}
    >
      <div className="relative flex h-full flex-col justify-between border-r border-divider">
        <div className="flex flex-col gap-4 p-4">
          {header}
          {children}
        </div>
        <div
          className={cn(
            'flex items-center justify-end gap-4 border-t border-divider p-4',
            classNames?.footer
          )}
        >
          {footer}
        </div>
      </div>
      {!!endContent && (
        <div className={cn('overflow-hidden p-4', classNames?.endContent)}>{endContent}</div>
      )}
    </div>
  );
}

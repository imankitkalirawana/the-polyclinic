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
        'mx-auto grid h-full w-full overflow-hidden',
        {
          'grid-cols-2': !!endContent,
        },
        className
      )}
    >
      <div className="relative flex h-full flex-col justify-between overflow-hidden border-r border-divider">
        {/* Main content area with proper flex handling */}
        <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden p-4">
          {header && <div className="flex-shrink-0">{header}</div>}
          {/* Ensure children can grow and shrink properly */}
          <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
        </div>

        {/* Footer stays at bottom */}
        {!!footer && (
          <div
            className={cn(
              'flex flex-shrink-0 flex-row-reverse items-center justify-between gap-4 border-t border-divider p-4',
              classNames?.footer
            )}
          >
            {footer}
          </div>
        )}
      </div>

      {!!endContent && (
        <div className={cn('h-full overflow-hidden p-4', classNames?.endContent)}>{endContent}</div>
      )}
    </div>
  );
}

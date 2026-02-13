import React from 'react';

import { cn } from '@heroui/react';

export type CellValueProps = React.HTMLAttributes<HTMLDivElement> & {
  label: string;
  value: React.ReactNode;
};

/** @deprecated
 * Use RenderCell from new-data-table/cell-renderer instead
 **/
const CellValue = React.forwardRef<HTMLDivElement, CellValueProps>(
  ({ label, value, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-between gap-2 py-2', props.className)}
      // {...props}
    >
      <div className="text-default-500 text-small max-w-48 sm:max-w-full">{label}</div>
      <div title={value?.toString()} className="text-small max-w-72 font-medium">
        {value || children}
      </div>
    </div>
  )
);

CellValue.displayName = 'CellValue';

export default CellValue;

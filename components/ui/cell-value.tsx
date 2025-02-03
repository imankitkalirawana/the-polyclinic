import { Divider } from '@heroui/react';
import React from 'react';

export type CellValueProps = React.HTMLAttributes<HTMLDivElement> & {
  label: string;
  value: React.ReactNode;
};

const CellValue = React.forwardRef<HTMLDivElement, CellValueProps>(
  ({ label, value, children, ...props }, ref) => (
    <div
      ref={ref}
      className="flex items-center justify-between gap-2 py-2"
      {...props}
    >
      <div className="max-w-48 text-small text-default-500 sm:max-w-full">
        {label}
      </div>
      <div
        title={value?.toString()}
        className="max-w-72 text-small font-medium"
      >
        {value || children}
      </div>
    </div>
  )
);

CellValue.displayName = 'CellValue';

export default CellValue;

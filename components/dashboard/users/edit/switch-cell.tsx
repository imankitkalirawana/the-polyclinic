'use client';

import React, { ReactElement } from 'react';
import type { SwitchProps } from '@heroui/react';
import { extendVariants, Switch } from '@heroui/react';
import { cn } from '@heroui/react';

const CustomSwitch = extendVariants(Switch, {
  variants: {
    color: {
      foreground: {
        wrapper: [
          'group-data-[selected=true]:bg-foreground',
          'group-data-[selected=true]:text-background',
        ],
      },
    },
  },
});

export type SwitchCellProps = Omit<SwitchProps, 'color'> & {
  label: string;
  description: string;
  color?: SwitchProps['color'] | 'foreground';
  classNames?: SwitchProps['classNames'] & {
    description?: string | string[];
  };
};

const SwitchCell = React.forwardRef<ReactElement, SwitchCellProps>(
  ({ label, description, classNames, ...props }, ref) => (
    <CustomSwitch
      ref={ref}
      classNames={{
        ...classNames,
        base: cn(
          'inline-flex bg-content2 flex-row-reverse w-full max-w-full items-center',
          'justify-between cursor-pointer rounded-medium gap-2 p-4',
          classNames?.base
        ),
      }}
      {...props}
    >
      <div className="flex flex-col">
        <p className={cn('text-medium', classNames?.label)}>{label}</p>
        <p
          className={cn('text-small text-default-500', classNames?.description)}
        >
          {description}
        </p>
      </div>
    </CustomSwitch>
  )
);

SwitchCell.displayName = 'SwitchCell';

export default SwitchCell;

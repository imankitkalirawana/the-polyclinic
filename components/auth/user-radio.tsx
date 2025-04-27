'use client';

import React from 'react';
import type { RadioProps } from '@heroui/react';
import { Radio } from '@heroui/react';
import { cn } from '@heroui/react';

export type UserRadioProps = RadioProps & {
  icon?: React.ReactNode;
  monthlyPrice?: number;
  label?: string;
};

const UserRadio = React.forwardRef<HTMLInputElement, UserRadioProps>(
  (
    {
      icon,
      monthlyPrice,
      label,
      description,
      className,
      classNames = {},
      ...props
    },
    ref
  ) => (
    <Radio
      {...props}
      ref={ref}
      classNames={{
        ...classNames,
        base: cn(
          'inline-flex m-0 px-3 py-4 max-w-[100%] items-center justify-between',
          'flex-row-reverse w-full cursor-pointer rounded-lg 3 border-medium border-default-100',
          'data-[selected=true]:border-secondary data-[selected=true]:bg-secondary-50',
          classNames?.base,
          className
        ),
        wrapper: cn(
          'group-data-[focus-visible=true]:ring-secondary',
          classNames?.wrapper
        ),
        labelWrapper: cn('ml-0', classNames?.labelWrapper),
      }}
      color="secondary"
    >
      <div className="flex w-full items-center gap-3">
        <div className="item-center flex rounded-full bg-secondary-50 p-2 group-data-[selected=true]:bg-secondary-100">
          {icon}
        </div>
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center gap-1">
            <p className="text-small">{label}</p>
            <span className="mt-0.5 text-tiny text-default-500">
              {monthlyPrice !== undefined && ` $${monthlyPrice} per month`}
            </span>
          </div>
          <p className="text-tiny text-default-400">{description}</p>
        </div>
      </div>
    </Radio>
  )
);

UserRadio.displayName = 'UserRadio';

export default UserRadio;

import React from 'react';
import { RadioProps, useRadio, VisuallyHidden } from '@heroui/react';

import { cn } from '@heroui/react';

export default function CustomRadio(props: RadioProps) {
  const {
    Component,
    children,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        'group inline-flex w-full flex-row-reverse items-center justify-between tap-highlight-transparent hover:opacity-70 active:opacity-50',
        'cursor-pointer gap-4 rounded-large border-2 border-default p-4',
        'data-[selected=true]:border-primary data-[selected=true]:bg-primary/10',
        props.className
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()}>
        {children && <span {...getLabelProps()}>{children}</span>}
        {description && (
          <span className="text-foreground opacity-70 text-small">{description}</span>
        )}
      </div>
    </Component>
  );
}

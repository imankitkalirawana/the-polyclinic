'use client';

import React from 'react';
import { useState } from 'react';
import { Button, ButtonProps, cn } from '@heroui/react';

const AsyncButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    fn?: () => Promise<void>;
    whileSubmitting?: string;
  }
>(
  (
    {
      isLoading: propIsLoading,
      fn,
      onPress,
      whileSubmitting = 'Loading...',
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
      try {
        setIsLoading(true);
        if (fn) {
          await fn();
        }
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <Button
        ref={ref}
        {...props}
        className={cn('btn btn-primary', props.className)}
        isLoading={isLoading || propIsLoading}
        onPress={onPress || handleSubmit}
        startContent={isLoading ? null : props.startContent}
      >
        {isLoading ? whileSubmitting : props.children}
      </Button>
    );
  }
);

AsyncButton.displayName = 'AsyncButton';

export default AsyncButton;

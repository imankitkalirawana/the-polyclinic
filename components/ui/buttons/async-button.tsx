'use client';

import { Button, ButtonProps, cn } from '@heroui/react';
import React from 'react';
import { useState } from 'react';

const AsyncButton = React.forwardRef<
  HTMLDivElement,
  ButtonProps & {
    aid: number;
    fn?: () => Promise<void>;
    whileSubmitting?: string;
  }
>(
  ({
    isLoading: propIsLoading,
    aid,
    fn,
    whileSubmitting = 'Loading...',
    ...props
  }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
      setIsLoading(true);
      fn &&
        (await fn().finally(() => {
          setIsLoading(false);
        }));
    };

    return (
      <Button
        {...props}
        className={cn('btn btn-primary', props.className)}
        isLoading={isLoading || propIsLoading}
        onPress={handleSubmit}
        startContent={isLoading ? null : props.startContent}
      >
        {isLoading ? whileSubmitting : props.children}
      </Button>
    );
  }
);

AsyncButton.displayName = 'AsyncButton';

export default AsyncButton;

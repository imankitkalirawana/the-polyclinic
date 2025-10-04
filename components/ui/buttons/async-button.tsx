'use client';

import React, { useState } from 'react';
import { Button, ButtonProps, cn } from '@heroui/react';

const AsyncButton = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'onPress'> & {
    whileSubmitting?: string;
    onPress?: () => Promise<void> | void;
  }
>(({ isLoading: propIsLoading, whileSubmitting, onPress, ...props }, ref) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (onPress) {
        await onPress();
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
      onPress={handleSubmit}
      startContent={isLoading ? null : props.startContent}
    >
      {isLoading && whileSubmitting ? whileSubmitting : props.children}
    </Button>
  );
});

AsyncButton.displayName = 'AsyncButton';

export default AsyncButton;

'use client';

import { downloadAppointmentReceipt } from '@/lib/client-functions';
import { Button, ButtonProps, cn } from '@heroui/react';
import React from 'react';
import { useState } from 'react';

const DownloadButton = React.forwardRef<
  HTMLDivElement,
  ButtonProps & { aid: number }
>(({ color, isLoading: propIsLoading, children, aid, ...props }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    await downloadAppointmentReceipt(aid).finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <Button
      color={color}
      {...props}
      className={cn('btn btn-primary', props.className)}
      isLoading={isLoading || propIsLoading}
      onPress={handleDownload}
      startContent={isLoading ? null : props.startContent}
    >
      {isLoading ? 'Downloading...' : children}
    </Button>
  );
});

DownloadButton.displayName = 'DownloadButton';

export default DownloadButton;

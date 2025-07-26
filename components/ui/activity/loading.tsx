import React from 'react';
import { Spinner } from '@heroui/react';

export default function ActivityLoading() {
  return (
    <div className="text-center text-small text-default-400">
      <Spinner size="sm" label="Loading..." />
    </div>
  );
}

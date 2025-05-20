import { Spinner } from '@heroui/react';

export default function ActivityLoading() {
  return (
    <div className="text-center text-sm text-default-400">
      <Spinner size="sm" label="Loading..." />
    </div>
  );
}

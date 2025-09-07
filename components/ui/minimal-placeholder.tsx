import { Spinner } from '@heroui/react';

export default function MinimalPlaceholder({
  isLoading = true,
  message = 'Loading...',
}: {
  isLoading?: boolean;
  message?: string;
}) {
  return (
    <div className="flex h-full w-full items-center justify-center gap-2">
      {isLoading && <Spinner variant="spinner" size="sm" />}
      <p className="text-sm text-default-500">{message}</p>
    </div>
  );
}

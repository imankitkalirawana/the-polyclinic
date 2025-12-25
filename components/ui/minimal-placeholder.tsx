import { Button, ButtonProps, Spinner } from '@heroui/react';

export default function MinimalPlaceholder({
  isLoading = true,
  message = 'Loading...',
  withButton = false,
  buttonProps,
}: {
  isLoading?: boolean;
  message?: string;
  withButton?: boolean;
  buttonProps?: ButtonProps;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <div className="flex">
        {isLoading && <Spinner variant="spinner" size="sm" />}
        <p className="text-sm text-default-500">{message}</p>
      </div>
      {withButton && <Button variant="flat" size="sm" color="primary" {...buttonProps} />}
    </div>
  );
}

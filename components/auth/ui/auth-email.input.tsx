import { Input } from '@heroui/react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { cn } from '@heroui/react';

interface FormWithUserEmail extends FieldValues {
  user: { email?: string };
}

export default function AuthEmailInput<T extends FormWithUserEmail>({
  autoFocus = true,
  isReadOnly,
  name,
  control,
}: {
  isReadOnly?: boolean;
  autoFocus?: boolean;
  name: Path<T>;
  control: Control<T>;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Input
          {...field}
          autoFocus={autoFocus}
          data-testid="auth-email-input"
          type="email"
          label="Email"
          radius="lg"
          autoComplete="email"
          placeholder="john.doe@example.com"
          isReadOnly={isReadOnly}
          className={cn({ 'sr-only': isReadOnly })}
          isInvalid={!!fieldState.error}
          errorMessage={fieldState.error?.message}
        />
      )}
    />
  );
}

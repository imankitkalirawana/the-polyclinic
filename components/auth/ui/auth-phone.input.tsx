import { Input } from '@heroui/react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { cn } from '@heroui/react';

interface FormWithUserPhone extends FieldValues {
  user: { phone?: string };
}

export default function AuthPhoneInput<T extends FormWithUserPhone>({
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
          data-testid="auth-phone-input"
          type="tel"
          maxLength={10}
          label="Phone"
          radius="lg"
          autoComplete="tel"
          placeholder="9876543210"
          isReadOnly={isReadOnly}
          className={cn({ 'sr-only': isReadOnly })}
          isInvalid={!!fieldState.error}
          errorMessage={fieldState.error?.message}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">+91</span>
            </div>
          }
        />
      )}
    />
  );
}

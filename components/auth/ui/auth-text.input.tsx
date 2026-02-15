import { Input } from '@heroui/react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

export interface AuthTextInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  autoFocus?: boolean;
  autoComplete?: string;
  isReadOnly?: boolean;
}

export function AuthTextInput<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  autoFocus = true,
  autoComplete,
  isReadOnly,
}: AuthTextInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Input
          {...field}
          autoFocus={autoFocus}
          data-testid={`auth-text-input-${String(name)}`}
          type="text"
          label={label}
          radius="lg"
          autoComplete={autoComplete}
          placeholder={placeholder}
          isReadOnly={isReadOnly}
          isInvalid={!!fieldState.error}
          errorMessage={fieldState.error?.message}
        />
      )}
    />
  );
}

import { Button, Input } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface FormWithUserPassword extends FieldValues {
  user: { password?: string };
}

export default function AuthPasswordInput<T extends FormWithUserPassword>({
  autoFocus = true,
  name,
  control,
}: {
  autoFocus?: boolean;
  name: Path<T>;
  control: Control<T>;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Input
          {...field}
          autoFocus={autoFocus}
          data-testid="auth-password-input"
          type={isVisible ? 'text' : 'password'}
          label="Password"
          radius="lg"
          autoComplete="password"
          placeholder="Enter password"
          isInvalid={!!fieldState.error}
          errorMessage={fieldState.error?.message}
          endContent={
            <Button
              isIconOnly
              type="button"
              variant="light"
              radius="full"
              onPress={toggleVisibility}
              tabIndex={-1}
            >
              <Icon
                icon={isVisible ? 'solar:eye-closed-bold-duotone' : 'solar:eye-bold-duotone'}
                width={20}
              />
            </Button>
          }
        />
      )}
    />
  );
}

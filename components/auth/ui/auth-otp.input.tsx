import { InputOtp } from '@heroui/react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface FormWithUserOtp extends FieldValues {
  user: { otp?: string };
}

export default function AuthOtpInput<T extends FormWithUserOtp>({
  autoFocus = true,
  name,
  control,
  onComplete,
}: {
  autoFocus?: boolean;
  name: Path<T>;
  control: Control<T>;
  onComplete: () => void;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <InputOtp
          {...field}
          autoFocus={autoFocus}
          data-testid="auth-otp-input"
          length={6}
          radius="lg"
          placeholder="Enter OTP"
          value={field.value}
          onComplete={onComplete}
          isInvalid={!!fieldState.error}
          errorMessage={fieldState.error?.message}
        />
      )}
    />
  );
}

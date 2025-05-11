import {
  addToast,
  Button,
  ButtonProps,
  Input as HeroInput,
  InputOtp,
  InputOtpProps,
  InputProps,
} from '@heroui/react';
import { sendOTP } from '@/lib/server-actions/auth';
import { forwardRef } from 'react';
import { useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { cn } from '@/lib/utils';

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <HeroInput
      ref={ref}
      radius="lg"
      {...props}
      classNames={{
        input: 'placeholder:text-default-400',
      }}
    />
  );
});

export const PasswordInput = forwardRef<
  HTMLInputElement,
  InputProps & {
    isValidation?: boolean;
  }
>(({ isValidation, ...props }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [password, setPassword] = useState('');
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [validations, setValidations] = useState<{
    number: boolean;
    symbol: boolean;
    uppercase: boolean;
    minLength: boolean;
  }>({
    number: false,
    symbol: false,
    uppercase: false,
    minLength: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (isValidation) {
      handleValidation(e);
    }
  };

  const handleValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isNumber = /\d/.test(value);
    const isSymbol = /[!@#$%^&*]/.test(value);
    const isUppercase = /[A-Z]/.test(value);
    const isMinLength = value.length >= 8;

    setValidations({
      number: isNumber,
      symbol: isSymbol,
      uppercase: isUppercase,
      minLength: isMinLength,
    });
  };

  return (
    <HeroInput
      {...props}
      ref={ref}
      name="password"
      label="Password"
      radius="lg"
      placeholder={isVisible ? 'Abc@123' : '*******'}
      type={isVisible ? 'text' : 'password'}
      value={password}
      autoComplete="password"
      onChange={handleChange}
      endContent={
        <button type="button" onClick={toggleVisibility}>
          {isVisible ? (
            <Icon
              className="pointer-events-none text-2xl text-default-400"
              icon="solar:eye-closed-linear"
            />
          ) : (
            <Icon
              className="pointer-events-none text-2xl text-default-400"
              icon="solar:eye-bold"
            />
          )}
        </button>
      }
      description={
        isValidation && (
          <ul>
            <li
              className={cn('flex items-center gap-1', {
                'text-success-500': validations.number,
              })}
            >
              <Icon icon="solar:check-circle-bold" />
              <span>Must contain one number</span>
            </li>
            <li
              className={cn('flex items-center gap-1', {
                'text-success-500': validations.symbol,
              })}
            >
              <Icon icon="solar:check-circle-bold" />
              <span>Must contain one symbol</span>
            </li>
            <li
              className={cn('flex items-center gap-1', {
                'text-success-500': validations.uppercase,
              })}
            >
              <Icon icon="solar:check-circle-bold" />
              <span>Must contain one uppercase letter</span>
            </li>
            <li
              className={cn('flex items-center gap-1', {
                'text-success-500': validations.minLength,
              })}
            >
              <Icon icon="solar:check-circle-bold" />
              <span>Min 8 characters</span>
            </li>
          </ul>
        )
      }
      classNames={{
        input: 'placeholder:text-default-400',
      }}
    />
  );
});

export const OtpInput = forwardRef<
  HTMLInputElement,
  Omit<InputOtpProps, 'length'> & {
    email: string;
    type?: 'registration' | 'forgot-password';
  }
>(({ email, type = 'registration', ...props }, ref) => {
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  const resendOtp = async () => {
    setIsResendingOtp(true);
    const res = await sendOTP({ email, type });
    if (res.success) {
      addToast({
        title: 'OTP resent',
        description: 'Please check your email for the verification code',
        color: 'success',
      });
    } else {
      addToast({ title: res.message, color: 'danger' });
    }
    setIsResendingOtp(false);
  };

  return (
    <div className="mb-2 flex flex-col items-center justify-center">
      <InputOtp ref={ref} radius="lg" length={4} name="otp" {...props} />
      <div className="flex flex-col items-center justify-between px-1 py-2 text-small text-default-500">
        <p>Didn't receive the code?</p>
        <Button
          variant="light"
          size="sm"
          color="primary"
          onPress={resendOtp}
          isLoading={isResendingOtp}
        >
          Resend Code
        </Button>
      </div>
    </div>
  );
});

export function PasswordGroupInput({
  passwordProps,
  confirmPasswordProps,
}: {
  passwordProps?: InputProps & { ref?: React.Ref<HTMLInputElement> };
  confirmPasswordProps?: InputProps & { ref?: React.Ref<HTMLInputElement> };
}) {
  return (
    <div className="flex flex-col gap-2">
      <Input
        radius="lg"
        label="Password"
        name="password"
        type="password"
        {...passwordProps}
      />
      <Input
        radius="lg"
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        {...confirmPasswordProps}
      />
    </div>
  );
}

export const SubmitButton = forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    children?: React.ReactNode;
  }
>(({ children, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      color="primary"
      type="submit"
      fullWidth
      radius="lg"
      variant="shadow"
      {...props}
    >
      {children}
    </Button>
  );
});

Input.displayName = 'Input';
PasswordInput.displayName = 'PasswordInput';
OtpInput.displayName = 'OtpInput';
SubmitButton.displayName = 'SubmitButton';

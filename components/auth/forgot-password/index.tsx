'use client';

import React from 'react';
import { Link } from '@heroui/react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  emailValidation,
  otpValidation,
  passwordValidation,
} from '@/utils/factories/validation.factory';
import { AuthFormLayout } from '../shared';
import AuthEmailInput from '../ui/auth-email.input';
import AuthPasswordInput from '../ui/auth-password.input';
import { useForgotPassword, useSendOTP } from '@/services/common/auth/auth.query';
import AuthOtpInput from '../ui/auth-otp.input';
import { AuthStep } from '../types';
import { APP_INFO } from '@/libs/config';
import { AuthApi } from '@/services/common/auth/auth.api';
import { VerificationType } from '@/services/common/auth/auth.enum';

const forgotPasswordSchema = z
  .object({
    user: z.object({
      email: emailValidation,
      otp: otpValidation.optional(),
      password: passwordValidation.optional(),
      confirmPassword: passwordValidation.optional(),
    }),
    meta: z.object({
      page: z.number().min(0),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.meta.page === 1) {
      if (!data.user.otp) {
        ctx.addIssue({
          code: 'custom',
          message: 'OTP is required',
          path: ['user', 'otp'],
        });
      }
    }
    if (data.meta.page === 2) {
      if (!data.user.password) {
        ctx.addIssue({
          code: 'custom',
          message: 'Password is required',
          path: ['user', 'password'],
        });
      }
      if (!data.user.confirmPassword) {
        ctx.addIssue({
          code: 'custom',
          message: 'Confirm password is required',
          path: ['user', 'confirmPassword'],
        });
      }
      if (data.user.password !== data.user.confirmPassword) {
        ctx.addIssue({
          code: 'custom',
          message: 'Passwords do not match',
          path: ['user', 'confirmPassword'],
        });
      }
    }
  });

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword(): React.ReactElement {
  const { mutateAsync: resetPassword, isSuccess: isResetSuccess } = useForgotPassword();
  const { mutate: sendOTP } = useSendOTP();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      user: {},
      meta: { page: 0 },
    },
  });

  const meta = useWatch({
    control: form.control,
    name: 'meta',
    defaultValue: { page: 0 },
  });

  const FORGOT_PASSWORD_STEPS: Record<number, AuthStep> = {
    0: {
      title: 'Reset your password',
      description: `Enter the email address for your ${APP_INFO.name} account. You'll then set a new password.`,
      button: 'Continue',
      content: <AuthEmailInput control={form.control} name="user.email" />,
    },
    1: {
      title: 'Verify and continue',
      description: `Enter the OTP sent to your email to continue.`,
      button: 'Verify',
      content: (
        <AuthOtpInput
          control={form.control}
          name="user.otp"
          onComplete={() => {
            form.handleSubmit(onSubmit)();
          }}
        />
      ),
    },
    2: {
      title: 'Enter new password',
      description: 'Choose a new password for your account.',
      button: 'Reset password',
      content: (
        <>
          <AuthPasswordInput<ForgotPasswordFormValues>
            control={form.control}
            name="user.password"
            autoFocus={false}
          />
          <AuthPasswordInput<ForgotPasswordFormValues>
            control={form.control}
            name="user.confirmPassword"
            autoFocus={false}
          />
        </>
      ),
    },
  };

  const onSubmit = async (data: ForgotPasswordFormValues): Promise<void> => {
    switch (data.meta.page) {
      case 0:
        // check email exists
        const res = await AuthApi.checkEmail({ email: data.user.email });
        if (res.data?.exists) {
          sendOTP({
            email: data.user.email,
            type: VerificationType.PASSWORD_RESET,
          });
          form.setValue('meta.page', 1);
        } else {
          form.setError('user.email', { message: 'Email does not exist' });
        }
        break;
      case 1:
        // verify OTP
        const { success } = await AuthApi.verifyOTP({
          email: data.user.email,
          otp: data.user.otp ?? '',
          type: VerificationType.PASSWORD_RESET,
        });
        if (success) {
          form.setValue('meta.page', 2);
        } else {
          form.setError('user.otp', { message: 'Invalid OTP' });
        }
        break;
      case 2:
        // reset password
        await resetPassword({
          email: data.user.email,
          password: data.user.password ?? '',
          otp: data.user.otp ?? '',
        });
        break;
    }
  };

  const footer = (
    <>
      <div className="flex items-center gap-2">
        <div className="bg-divider h-px w-full" />
        <div className="text-default-500 text-small">or</div>
        <div className="bg-divider h-px w-full" />
      </div>
      <div className="text-small text-center">
        Remember your password?&nbsp;
        <Link href={`/auth/login?email=${form.getValues('user.email') ?? ''}`} size="sm">
          Log in
        </Link>
      </div>
    </>
  );

  return (
    <AuthFormLayout
      stepKey={meta.page}
      title={FORGOT_PASSWORD_STEPS[meta.page].title}
      description={FORGOT_PASSWORD_STEPS[meta.page].description}
      isBack={meta.page > 0}
      onBack={() => form.setValue('meta.page', 0)}
      formContent={FORGOT_PASSWORD_STEPS[meta.page].content}
      submitLabel={FORGOT_PASSWORD_STEPS[meta.page].button}
      onSubmit={form.handleSubmit(onSubmit)}
      isSubmitting={form.formState.isSubmitting}
      isSubmitDisabled={isResetSuccess}
      footer={footer}
    />
  );
}

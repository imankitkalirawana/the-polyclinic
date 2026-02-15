'use client';

import React from 'react';
import { Link, addToast } from '@heroui/react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  emailValidation,
  nameValidation,
  otpValidation,
  passwordValidation,
  phoneNumberValidation,
} from '@/utils/factories/validation.factory';
import { APP_INFO } from '@/libs/config';
import { AuthFormLayout } from '../shared';
import AuthEmailInput from '../ui/auth-email.input';
import { AuthApi } from '@/services/common/auth/auth.api';
import { useGoogleLogin, useRegister, useSendOTP } from '@/services/common/auth/auth.query';
import { AuthStep } from '../types';
import AuthMethodSelector from '../ui/auth-method.input';
import { AuthMethod, VerificationType } from '@/services/common/auth/auth.enum';
import { toTitleCase } from '@/libs/utils';
import AuthPhoneInput from '../ui/auth-phone.input';
import AuthOtpInput from '../ui/auth-otp.input';
import { AuthTextInput } from '../ui/auth-text.input';
import AuthPasswordInput from '../ui/auth-password.input';

const registerSchema = z
  .object({
    user: z
      .object({
        email: emailValidation.optional(),
        phone: phoneNumberValidation.optional(),
        otp: otpValidation.optional(),
        name: nameValidation.optional(),
        password: passwordValidation.optional(),
        confirmPassword: z
          .string()
          .min(8, { message: 'Password must be at least 8 characters' })
          .optional(),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      }),
    meta: z.object({
      page: z.number().min(0),
      method: z.enum(AuthMethod),
    }),
  })
  .superRefine((data, ctx) => {
    switch (data.meta.page) {
      case 1:
        switch (data.meta.method) {
          case AuthMethod.EMAIL:
            if (!data.user.email) {
              ctx.addIssue({
                code: 'custom',
                message: 'Email is required',
                path: ['user', 'email'],
              });
            }
            break;
          case AuthMethod.PHONE:
            if (!data.user.phone) {
              ctx.addIssue({
                code: 'custom',
                message: 'Phone is required',
                path: ['user', 'phone'],
              });
            }
            break;
        }
        break;
      case 2:
        if (!data.user.otp) {
          ctx.addIssue({ code: 'custom', message: 'OTP is required', path: ['user', 'otp'] });
        }
        break;
      case 3:
        if (!data.user.name) {
          ctx.addIssue({ code: 'custom', message: 'Name is required', path: ['user', 'name'] });
        }
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
        break;
    }
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const { mutate: sendOTP } = useSendOTP();
  const { mutateAsync: registerUser, isSuccess: isRegisterSuccess } = useRegister();
  const { mutate: loginWithGoogle, isPending: isGoogleLoginPending } = useGoogleLogin();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      user: {},
      meta: { page: 0, method: AuthMethod.EMAIL },
    },
  });

  const meta = useWatch({
    control: form.control,
    name: 'meta',
    defaultValue: { page: 0, method: AuthMethod.EMAIL },
  });

  const REGISTER_STEPS: Record<number, AuthStep> = {
    0: {
      title: 'Create an account',
      description: `Join ${APP_INFO.name}! Please choose a way to continue.`,
      content: (
        <AuthMethodSelector
          onChange={(method) => {
            form.setValue('meta.method', method);
            form.setValue('meta.page', 1);
          }}
          onGoogleSuccess={(credential) => {
            loginWithGoogle({ credential });
          }}
          onGoogleError={() => {
            addToast({
              title: 'Google sign-in was cancelled or failed.',
              color: 'danger',
            });
          }}
        />
      ),
    },
    1: {
      title: 'Create an account',
      description: `Please enter your ${toTitleCase(meta.method)} to continue.`,
      button: 'Continue',
      content:
        meta.method === AuthMethod.EMAIL ? (
          <AuthEmailInput control={form.control} name="user.email" />
        ) : (
          <AuthPhoneInput control={form.control} name="user.phone" />
        ),
    },
    2: {
      title: 'Verify and continue',
      description: `Enter the OTP sent to your ${toTitleCase(meta.method)} to continue.`,
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
    3: {
      title: 'Create an account',
      description: 'Enter your details to create your account.',
      button: 'Create account',
      content: (
        <>
          <AuthTextInput<RegisterFormValues>
            control={form.control}
            name="user.name"
            label="Full name"
            placeholder="John Doe"
            autoComplete="name"
          />
          <AuthPasswordInput<RegisterFormValues>
            control={form.control}
            name="user.password"
            autoFocus={false}
          />
          <AuthPasswordInput<RegisterFormValues>
            control={form.control}
            name="user.confirmPassword"
            autoFocus={false}
          />
        </>
      ),
    },
  };

  const onSubmit = async (data: RegisterFormValues): Promise<void> => {
    switch (data.meta.page) {
      case 1:
        switch (data.meta.method) {
          case AuthMethod.PHONE:
            form.setValue('meta.page', 2);
            break;
          case AuthMethod.EMAIL: {
            const res = await AuthApi.checkEmail({ email: data.user.email ?? '' });
            if (res.data?.exists) {
              form.setError('user.email', { message: 'Email already exists' });
            } else {
              sendOTP({
                email: data.user.email ?? '',
                type: VerificationType.REGISTRATION,
              });
              form.setValue('meta.page', 2);
            }
            break;
          }
        }
        break;
      case 2:
        const { success } = await AuthApi.verifyOTP({
          email: data.user.email ?? '',
          otp: data.user.otp ?? '',
          type: VerificationType.REGISTRATION,
        });
        if (success) {
          form.setValue('meta.page', 3);
        } else {
          form.setError('user.otp', { message: 'Invalid OTP' });
        }
        break;
      case 3:
        await registerUser({
          email: data.user.email ?? '',
          password: data.user.password ?? '',
          name: data.user.name ?? '',
          otp: data.user.otp ?? '',
          phone: data.user.phone ?? '',
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
        Already have an account?&nbsp;
        <Link href="/auth/login" size="sm">
          Log in
        </Link>
      </div>
    </>
  );

  return (
    <AuthFormLayout
      stepKey={meta.page}
      title={REGISTER_STEPS[meta.page]?.title ?? ''}
      description={REGISTER_STEPS[meta.page]?.description}
      isBack={meta.page > 0}
      onBack={() => form.setValue('meta.page', meta.page - 1)}
      formContent={REGISTER_STEPS[meta.page]?.content}
      submitLabel={REGISTER_STEPS[meta.page]?.button}
      onSubmit={form.handleSubmit(onSubmit)}
      isSubmitting={form.formState.isSubmitting}
      isSubmitDisabled={isRegisterSuccess || isGoogleLoginPending}
      footer={footer}
    />
  );
}

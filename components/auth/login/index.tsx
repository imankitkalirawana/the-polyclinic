'use client';

import React from 'react';
import { Link, addToast } from '@heroui/react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  phoneNumberValidation,
  emailValidation,
  passwordValidation,
} from '@/utils/factories/validation.factory';
import { APP_INFO } from '@/libs/config';
import { toTitleCase } from '@/libs/utils';
import { AuthFormLayout } from '../shared';
import AuthEmailInput from '../ui/auth-email.input';
import AuthPhoneInput from '../ui/auth-phone.input';
import AuthPasswordInput from '../ui/auth-password.input';
import { AuthApi } from '@/services/common/auth/auth.api';
import { useGoogleLogin, useLogin } from '@/services/common/auth/auth.query';
import { AuthStep } from '../types';
import { AuthMethod } from '../../../services/common/auth/auth.enum';
import AuthMethodSelector from '../ui/auth-method.input';
// import { CredentialResponse, useGoogleOneTapLogin } from '@react-oauth/google';

const loginSchema = z
  .object({
    user: z.object({
      phone: phoneNumberValidation.optional(),
      email: emailValidation.optional(),
      password: passwordValidation.optional(),
    }),
    meta: z.object({
      method: z.nativeEnum(AuthMethod),
      page: z.number().min(0).max(2),
      submitCount: z.number().default(0),
    }),
  })
  .superRefine((data, ctx) => {
    switch (data.meta.method) {
      case AuthMethod.PHONE:
        if (!data.user.phone) {
          ctx.addIssue({ code: 'custom', message: 'Phone is required', path: ['user', 'phone'] });
        }
        break;
      case AuthMethod.EMAIL:
        if (!data.user.email) {
          ctx.addIssue({ code: 'custom', message: 'Email is required', path: ['user', 'email'] });
        }
        break;
      default:
        break;
    }
  });

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { mutateAsync: login, isSuccess: isLoginSuccess } = useLogin();
  const { mutate: loginWithGoogle, isPending: isGoogleLoginPending } = useGoogleLogin();

  // useGoogleOneTapLogin({
  //   auto_select: true,
  //   onSuccess: (credential: CredentialResponse) => {
  //     loginWithGoogle({ credential: credential.credential ?? '' });
  //   },
  //   onError: () => {
  //     addToast({
  //       title: 'Google sign-in was cancelled or failed.',
  //       color: 'danger',
  //     });
  //   },
  // });

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      user: {},
      meta: { method: AuthMethod.EMAIL, page: 0, submitCount: 0 },
    },
  });

  const meta = useWatch({
    control: form.control,
    name: 'meta',
    defaultValue: { method: AuthMethod.EMAIL, page: 0, submitCount: 0 },
  });

  const LOGIN_STEPS: Record<number, AuthStep> = {
    0: {
      title: 'Log in to your account',
      description: `Welcome back to ${APP_INFO.name}! Please choose a way to continue.`,
      content: (
        <AuthMethodSelector
          onChange={(method) => {
            if (method === AuthMethod.GOOGLE) return;
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
      title: 'Log in to your account',
      description: `Welcome back to ${APP_INFO.name}! Please enter your ${toTitleCase(meta.method)} to continue.`,
      button: 'Continue',
      content:
        meta.method === AuthMethod.EMAIL ? (
          <AuthEmailInput control={form.control} name="user.email" />
        ) : (
          <AuthPhoneInput control={form.control} name="user.phone" />
        ),
    },
    2: {
      title: 'Enter your password',
      description: 'Enter your password to log in to your account.',
      button: 'Log in',
      content: (
        <>
          <AuthEmailInput control={form.control} name="user.email" isReadOnly />
          <AuthPasswordInput control={form.control} name="user.password" />
        </>
      ),
    },
  };

  const onSubmit = async (data: LoginFormValues): Promise<void> => {
    switch (data.meta.page) {
      case 1:
        switch (data.meta.method) {
          case AuthMethod.PHONE:
            form.setValue('meta.page', 2);
            break;
          case AuthMethod.EMAIL: {
            const res = await AuthApi.checkEmail({ email: data.user.email ?? '' });
            if (res.data?.exists) {
              form.setValue('meta.page', 2);
            } else {
              form.setError('user.email', { message: 'Email does not exist' });
            }
            break;
          }
        }
        break;
      case 2:
        await login({
          email: data.user.email ?? '',
          password: data.user.password ?? '',
        });
        break;
    }
  };

  const footer = (
    <>
      {meta.page === 2 && (
        <div className="flex items-center justify-between px-1 py-2">
          <Link
            className="text-default-500 text-small hover:underline"
            href="/auth/forgot-password"
          >
            Forgot password?
          </Link>
        </div>
      )}
      <div className="flex items-center gap-2">
        <div className="bg-divider h-px w-full" />
        <div className="text-default-500 text-small">or</div>
        <div className="bg-divider h-px w-full" />
      </div>
      <div className="text-small text-center">
        Need to create an account?&nbsp;
        <Link href="/auth/register" size="sm">
          Sign Up
        </Link>
      </div>
    </>
  );

  return (
    <AuthFormLayout
      stepKey={meta.page}
      title={LOGIN_STEPS[meta.page]?.title ?? ''}
      description={LOGIN_STEPS[meta.page]?.description}
      isBack={meta.page > 0}
      onBack={() => form.setValue('meta.page', meta.page - 1)}
      formContent={LOGIN_STEPS[meta.page]?.content}
      submitLabel={LOGIN_STEPS[meta.page]?.button}
      onSubmit={form.handleSubmit(onSubmit)}
      isSubmitting={form.formState.isSubmitting}
      isSubmitDisabled={isLoginSuccess || isGoogleLoginPending}
      footer={footer}
    />
  );
}

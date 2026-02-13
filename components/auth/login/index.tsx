'use client';

import React from 'react';
import { addToast, Button, Link } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

import { APP_INFO } from '@/libs/config';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  phoneNumberValidation,
  emailValidation,
  passwordValidation,
} from '@/utils/factories/validation.factory';
import { AnimatePresence, domAnimation, m, LazyMotion } from 'framer-motion';
import { BlurIn } from '@/components/ui/text/blur-in';
import Logo from '@/components/ui/logo';
import { Header } from '../ui/header';
import AuthEmailInput from '../ui/auth-email.input';
import AuthPhoneInput from '../ui/auth-phone.input';
import { toTitleCase } from '@/libs/utils';
import AuthPasswordInput from '../ui/auth-password.input';
import { AuthApi } from '@/services/common/auth/auth.api';
import { useLogin } from '@/services/common/auth/auth.query';
import { AuthStep } from '../types';

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 20 : -20,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 20 : -20,
    opacity: 0,
  }),
};

enum LoginMethod {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
  ANOTHER = 'ANOTHER',
}

const loginSchema = z
  .object({
    user: z.object({
      phone: phoneNumberValidation.optional(),
      email: emailValidation.optional(),
      password: passwordValidation.optional(),
    }),
    meta: z.object({
      method: z.enum(LoginMethod),
      page: z.number().min(0).max(2),
      submitCount: z.number().default(0),
    }),
  })
  .superRefine((data, ctx) => {
    switch (data.meta.method) {
      case LoginMethod.PHONE:
        if (!data.user.phone) {
          ctx.addIssue({ code: 'custom', message: 'Phone is required', path: ['user', 'phone'] });
        }
        break;
      case LoginMethod.EMAIL:
        if (!data.user.email) {
          ctx.addIssue({ code: 'custom', message: 'Email is required', path: ['user', 'email'] });
        }
        break;
      default:
        break;
    }
  });

export default function Login() {
  const { mutateAsync: login, isSuccess: isLoginSuccess } = useLogin();
  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  const meta = useWatch({
    control: form.control,
    name: 'meta',
    defaultValue: { method: LoginMethod.EMAIL, page: 0, submitCount: 0 },
  });

  const LOGIN_STEPS: Record<number, AuthStep> = {
    0: {
      title: 'Log in to your account',
      description: `Welcome back to ${APP_INFO.name}! Please choose a way to continue.`,
      content: (
        <>
          <Button
            fullWidth
            variant="flat"
            startContent={<Icon icon="solar:phone-bold-duotone" width={20} />}
            size="lg"
            color="primary"
            data-testid="continue-with-phone-btn"
            onPress={() => {
              form.setValue('meta.method', LoginMethod.PHONE);
              form.setValue('meta.page', 1);
            }}
          >
            Continue with Phone
          </Button>
          <Button
            fullWidth
            variant="bordered"
            startContent={<Icon icon="solar:letter-bold-duotone" width={20} />}
            size="lg"
            color="primary"
            data-testid="continue-with-email-btn"
            onPress={() => {
              form.setValue('meta.method', LoginMethod.EMAIL);
              form.setValue('meta.page', 1);
            }}
          >
            Continue with Email
          </Button>
          <Button
            fullWidth
            variant="bordered"
            startContent={<Icon icon="devicon:google" width={20} />}
            size="lg"
            data-testid="continue-with-google-btn"
            onPress={async () => {
              addToast({
                title: 'Coming soon',
                description: 'This feature is coming soon',
                color: 'warning',
              });
            }}
          >
            Continue with Google
          </Button>
          <Button
            fullWidth
            variant="light"
            size="lg"
            data-testid="continue-another-way-btn"
            onPress={() => {
              addToast({
                title: 'Coming soon',
                description: 'This feature is coming soon',
                color: 'warning',
              });
            }}
          >
            Continue another way
          </Button>
        </>
      ),
    },
    1: {
      title: 'Log in to your account',
      description: `Welcome back to ${APP_INFO.name}! Please enter your ${toTitleCase(meta.method)} to continue.`,
      button: 'Continue',
      content:
        meta.method === LoginMethod.EMAIL ? (
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

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    // handle step 0
    switch (data.meta.page) {
      case 1:
        switch (data.meta.method) {
          case LoginMethod.PHONE:
            form.setValue('meta.page', 2);
            break;
          case LoginMethod.EMAIL:
            const res = await AuthApi.checkEmail({ email: data.user.email ?? '' });
            if (res.data?.exists) {
              form.setValue('meta.page', 2);
            } else {
              form.setError('user.email', { message: 'Email does not exist' });
            }
            break;
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
            href={`/auth/forgot-password?email=${form.getValues('user.email')}`}
          >
            Forgot password?
          </Link>
        </div>
      )}

      <>
        <div className="flex items-center gap-2">
          <div className="bg-divider h-px w-full" />
          <div className="text-default-500 text-small">or</div>
          <div className="bg-divider h-px w-full" />
        </div>
        <div className="text-small text-center">
          Need to create an account?&nbsp;
          <Link href={`/auth/register?email=${form.getValues('user.email')}`} size="sm">
            Sign Up
          </Link>
        </div>
      </>
    </>
  );

  return (
    <LazyMotion features={domAnimation}>
      <div className="grid h-screen w-screen grid-cols-2 overflow-hidden p-4">
        <div className="rounded-large flex h-full items-center justify-center bg-black">
          <BlurIn>
            <Logo className="text-background" />
          </BlurIn>
        </div>
        <div className="mx-auto mt-2 flex w-full max-w-sm flex-col justify-start gap-4">
          <Header
            title={LOGIN_STEPS[meta.page]?.title || ''}
            description={LOGIN_STEPS[meta.page]?.description || ''}
            isBack={!!meta.page && meta.page > 0}
            onBack={() => form.setValue('meta.page', meta.page - 1)}
          />
          <AnimatePresence custom={meta.page} initial={false} mode="wait">
            <m.form
              key={meta.page}
              animate="center"
              custom={meta.page}
              exit="exit"
              initial="enter"
              transition={{
                duration: 0.25,
              }}
              variants={variants}
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-center gap-2"
            >
              {LOGIN_STEPS[meta.page]?.content}
              {LOGIN_STEPS[meta.page]?.button && (
                <Button
                  type="submit"
                  color="primary"
                  isLoading={form.formState.isSubmitting}
                  variant="shadow"
                  radius="lg"
                  fullWidth
                  className="mt-4 py-6"
                  data-testid="auth-submit-btn"
                  isDisabled={isLoginSuccess}
                >
                  {LOGIN_STEPS[meta.page]?.button}
                </Button>
              )}
            </m.form>
          </AnimatePresence>

          <AnimatePresence>
            {footer && (
              <m.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-2"
              >
                {footer}
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </LazyMotion>
  );
}

'use client';
import { addToast, Button, Link } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import React from 'react';

import { APP_INFO } from '@/lib/config';
import { googleLogin } from '@/lib/server-actions/auth';

import Auth from '..';
import { Input, PasswordInput } from '../form';
import { LoginProvider, useLogin } from '../store';
import { AuthStep } from '../types';

const LoginComponent: React.FC = () => {
  const { formik, paginate } = useLogin();

  const LOGIN_STEPS: Record<number, AuthStep> = {
    0: {
      title: 'Log in to your account',
      description: `Welcome back to ${APP_INFO.name}! Please choose a way to continue.`,
      content: (
        <>
          <Button
            fullWidth
            variant="flat"
            startContent={<Icon icon="solar:letter-bold-duotone" width={20} />}
            size="lg"
            color="primary"
            onPress={() => {
              paginate(1);
            }}
          >
            Continue with Email
          </Button>
          <Button
            fullWidth
            variant="bordered"
            startContent={<Icon icon="devicon:google" width={20} />}
            size="lg"
            onPress={async () => {
              // addToast({
              //   title: 'Coming soon',
              //   description: 'This feature is coming soon',
              //   color: 'warning',
              // });
              await googleLogin();
            }}
          >
            Continue with Google
          </Button>
          <Button
            fullWidth
            variant="light"
            size="lg"
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
      description: `Welcome back to ${APP_INFO.name}! Please enter your email to continue.`,
      button: 'Continue',
      content: (
        <>
          <Input
            name="email"
            type="email"
            label="Email"
            placeholder="john.doe@example.com"
            autoComplete="email"
            autoFocus
            isInvalid={
              formik.touched.email && formik.errors.email ? true : false
            }
            errorMessage={formik.errors.email?.toString()}
            value={formik.values.email}
            onChange={formik.handleChange}
          />
        </>
      ),
    },
    2: {
      title: 'Enter your password',
      description: 'Enter your password to log in to your account.',
      button: 'Log in',
      content: (
        <>
          <Input
            name="email"
            type="email"
            label="Email"
            placeholder="john.doe@example.com"
            autoComplete="email"
            value={formik.values.email}
            className="sr-only"
          />
          <PasswordInput
            autoFocus
            label="Password"
            onValueChange={(value) => formik.setFieldValue('password', value)}
            isInvalid={
              formik.touched.password && formik.errors.password ? true : false
            }
            errorMessage={formik.errors.password?.toString()}
          />
        </>
      ),
    },
  };

  const loginFooter = (
    <>
      {formik.values.page === 2 && (
        <div className="flex items-center justify-between px-1 py-2">
          <Link
            className="text-small text-default-500 hover:underline"
            href={`/auth/forgot-password?email=${formik.values.email}`}
          >
            Forgot password?
          </Link>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="h-px w-full bg-divider" />
        <div className="text-small text-default-500">or</div>
        <div className="h-px w-full bg-divider" />
      </div>
      <div className="text-center text-small">
        Need to create an account?&nbsp;
        <Link href={`/auth/register?email=${formik.values.email}`} size="sm">
          Sign Up
        </Link>
      </div>
    </>
  );

  return (
    <Auth
      flowType="login"
      steps={LOGIN_STEPS}
      formik={formik}
      paginate={paginate}
      footer={loginFooter}
    />
  );
};

// Wrapper with provider
export default function Login() {
  return (
    <LoginProvider>
      <LoginComponent />
    </LoginProvider>
  );
}

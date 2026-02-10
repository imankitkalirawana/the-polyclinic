'use client';

import React from 'react';
import { addToast, Button, Link } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

import { Input, PasswordInput } from '../form';
import { LoginProvider, useLogin } from '../store';
import { AuthStep } from '../types';
import Auth from '..';

import { APP_INFO } from '@/libs/config';

const LoginComponent: React.FC<{ subdomain: string | null }> = ({ subdomain }) => {
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
            data-testid="continue-with-email-btn"
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
      description: `Welcome back to ${APP_INFO.name}! Please enter your email to continue.`,
      button: 'Continue',
      content: (
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="john.doe@example.com"
          autoComplete="email"
          autoFocus
          data-testid="email-input"
          isInvalid={!!(formik.touched.email && formik.errors.email)}
          errorMessage={formik.errors.email?.toString()}
          value={formik.values.email}
          onChange={formik.handleChange}
        />
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
            data-testid="password-input"
            onValueChange={(value) => formik.setFieldValue('password', value)}
            isInvalid={!!(formik.touched.password && formik.errors.password)}
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
            className="text-default-500 text-small hover:underline"
            href={`/auth/forgot-password?email=${formik.values.email}`}
          >
            Forgot password?
          </Link>
        </div>
      )}

      {subdomain && (
        <>
          <div className="flex items-center gap-2">
            <div className="bg-divider h-px w-full" />
            <div className="text-default-500 text-small">or</div>
            <div className="bg-divider h-px w-full" />
          </div>
          <div className="text-small text-center">
            Need to create an account?&nbsp;
            <Link href={`/auth/register?email=${formik.values.email}`} size="sm">
              Sign Up
            </Link>
          </div>
        </>
      )}
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
export default function Login({ subdomain }: { subdomain: string | null }) {
  return (
    <LoginProvider>
      <LoginComponent subdomain={subdomain} />
    </LoginProvider>
  );
}

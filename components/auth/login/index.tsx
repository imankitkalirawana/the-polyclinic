'use client';
import React from 'react';
import { Link } from '@heroui/react';
import { APP_INFO } from '@/lib/config';

import AuthFlow, { AuthFlowStep } from '../AuthFlow';
import { LoginProvider, useLoginFlow } from '../store';
import { Input, PasswordInput } from '../form';

const LoginComponent: React.FC = () => {
  const { formik, paginate } = useLoginFlow();

  const LOGIN_STEPS: Record<number, AuthFlowStep> = {
    0: {
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
    1: {
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
      <div className="flex items-center justify-between px-1 py-2">
        <Link
          className="text-small text-default-500 hover:underline"
          href={`/auth/forgot-password?email=${formik.values.email}`}
        >
          Forgot password?
        </Link>
      </div>
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
    <AuthFlow
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

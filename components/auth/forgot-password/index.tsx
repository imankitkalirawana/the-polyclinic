'use client';
import React from 'react';
import { Link } from '@heroui/react';
import { APP_INFO } from '@/lib/config';

import AuthFlow, { AuthFlowStep } from '../AuthFlow';
import { ForgotPasswordProvider, useForgotPasswordFlow } from '../store';
import { Input, OtpInput, PasswordInput } from '../form';

const ForgotPasswordComponent: React.FC = () => {
  const { formik, paginate } = useForgotPasswordFlow();

  const FORGOT_PASSWORD_STEPS: Record<number, AuthFlowStep> = {
    0: {
      title: 'Forgot your password?',
      description: `Enter your email address and we'll send you a code to reset your password.`,
      button: 'Send code',
      content: (
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="john.doe@example.com"
          autoComplete="email"
          autoFocus
          isInvalid={formik.touched.email && formik.errors.email ? true : false}
          errorMessage={formik.errors.email?.toString()}
          value={formik.values.email}
          onChange={formik.handleChange}
        />
      ),
    },
    1: {
      title: 'Check your email',
      description: `We've sent a verification code to ${formik.values.email}. Enter it below to reset your password.`,
      button: 'Verify code',
      content: (
        <OtpInput
          email={formik.values.email}
          type="forgot-password"
          label="Verification code"
          placeholder="Enter code"
          value={formik.values.otp}
          onValueChange={(value) => formik.setFieldValue('otp', value)}
          isInvalid={formik.touched.otp && formik.errors.otp ? true : false}
          errorMessage={formik.errors.otp?.toString()}
          autoFocus
          onComplete={() => formik.handleSubmit()}
        />
      ),
    },
    2: {
      title: 'Create new password',
      description: `Create a new password for your ${APP_INFO.name} account.`,
      button: 'Reset password',
      content: (
        <>
          <PasswordInput
            autoFocus
            isValidation
            label="New password"
            onValueChange={(value) =>
              formik.setFieldValue('newPassword', value)
            }
            isInvalid={
              formik.touched.newPassword && formik.errors.newPassword
                ? true
                : false
            }
            errorMessage={formik.errors.newPassword?.toString()}
          />

          <PasswordInput
            label="Confirm password"
            onValueChange={(value) =>
              formik.setFieldValue('confirmPassword', value)
            }
            isInvalid={
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? true
                : false
            }
            errorMessage={formik.errors.confirmPassword?.toString()}
          />
        </>
      ),
    },
  };

  const forgotPasswordFooter = (
    <div className="text-center text-small">
      Remember your password?&nbsp;
      <Link href={`/auth/login?email=${formik.values.email}`} size="sm">
        Log In
      </Link>
    </div>
  );

  return (
    <AuthFlow
      flowType="forgot-password"
      steps={FORGOT_PASSWORD_STEPS}
      formik={formik}
      paginate={paginate}
      footer={forgotPasswordFooter}
    />
  );
};

// Wrapper with provider
export default function ForgotPassword() {
  return (
    <ForgotPasswordProvider>
      <ForgotPasswordComponent />
    </ForgotPasswordProvider>
  );
}

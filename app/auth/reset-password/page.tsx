'use client';

import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardHeader, Input } from '@heroui/react';
import { useFormik } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const errorParam = searchParams.get('error');

    if (errorParam === 'INVALID_TOKEN') {
      setError('The password reset link is invalid or has expired. Please request a new one.');
    } else if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('No reset token found. Please request a new password reset link.');
    }
  }, [searchParams]);

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      if (!values.newPassword) {
        errors.newPassword = 'New password is required';
      } else if (values.newPassword.length < 8) {
        errors.newPassword = 'Password must be at least 8 characters long';
      }

      if (!values.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (values.newPassword !== values.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }

      return errors;
    },
    onSubmit: async (values) => {
      if (!token) {
        setError('No reset token available. Please request a new password reset link.');
        return;
      }

      try {
        const { data, error } = await authClient.resetPassword({
          newPassword: values.newPassword,
          token: token,
        });

        if (error) {
          console.error('Password reset error:', error);
          setError('Failed to reset password. Please try again.');
        } else {
          console.log('Password reset successful:', data);
          // Redirect to login page with success message
          router.push('/auth/login?message=password-reset-success');
        }
      } catch (err) {
        console.error('Password reset failed:', err);
        setError('Failed to reset password. Please try again.');
      }
    },
  });

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-bold text-danger">Reset Password Error</h1>
          </CardHeader>
          <CardBody className="flex flex-col gap-6">
            <p className="text-center text-default-500">{error}</p>
            <Button
              color="primary"
              size="lg"
              radius="lg"
              fullWidth
              onPress={() => router.push('/auth/forgot-password')}
            >
              Request New Reset Link
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold">Reset Your Password</h1>
          <p className="text-sm text-default-500">Enter your new password below</p>
        </CardHeader>
        <CardBody className="flex flex-col gap-6">
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            <Input
              type="password"
              name="newPassword"
              label="New Password"
              placeholder="Enter your new password"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.newPassword && !!formik.errors.newPassword}
              errorMessage={formik.touched.newPassword && formik.errors.newPassword}
              autoFocus
              radius="lg"
            />

            <Input
              type="password"
              name="confirmPassword"
              label="Confirm New Password"
              placeholder="Confirm your new password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
              errorMessage={formik.touched.confirmPassword && formik.errors.confirmPassword}
              radius="lg"
            />

            <Button
              type="submit"
              color="primary"
              size="lg"
              radius="lg"
              isLoading={formik.isSubmitting}
              fullWidth
            >
              Reset Password
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

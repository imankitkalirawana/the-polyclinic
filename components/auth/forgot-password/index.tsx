'use client';

import React from 'react';
import { Button, Card, CardBody, CardHeader, Input, Link } from '@heroui/react';
import { useFormik } from 'formik';
import { authClient } from '@/lib/auth-client';

export default function ForgotPassword() {
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      if (!values.email) {
        errors.email = 'Email is required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
      }

      return errors;
    },
    onSubmit: async (values) => {
      try {
        const { data, error } = await authClient.requestPasswordReset({
          email: values.email,
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });

        if (error) {
          console.error('Password reset request error:', error);
          // Handle error - you might want to show this to the user
        } else {
          console.log('Password reset email sent:', data);
          // Show success message to user
        }
      } catch (err) {
        console.error('Password reset request failed:', err);
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold">Forgot Password?</h1>
          <p className="text-sm text-default-500">
            Enter your email address and we&apos;ll send you a link to reset your password
          </p>
        </CardHeader>
        <CardBody className="flex flex-col gap-6">
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            <Input
              type="email"
              name="email"
              label="Email Address"
              placeholder="Enter your email address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.email && !!formik.errors.email}
              errorMessage={formik.touched.email && formik.errors.email}
              autoFocus
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
              Send Reset Link
            </Button>
          </form>

          <div className="text-center text-sm text-default-500">
            <p>
              Remember your password?{' '}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

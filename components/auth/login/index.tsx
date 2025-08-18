'use client';

import React from 'react';
import { addToast, Button, Card, CardBody, CardHeader, Input, Link } from '@heroui/react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function Login() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },

    onSubmit: async (values) => {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: '/dashboard',
      });
      if (error) {
        if (error.code === 'EMAIL_NOT_VERIFIED') {
          await authClient.sendVerificationEmail({
            email: values.email,
            callbackURL: '/auth/login',
          });
          addToast({
            title: 'Verification email sent',
            description: 'Please check your email for verification',
            color: 'success',
          });
        } else {
          addToast({
            description: error.message,
            color: 'danger',
          });
        }
      } else {
        router.push('/dashboard');
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm text-default-500">Sign in to your account</p>
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

            <Input
              type="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.password && !!formik.errors.password}
              errorMessage={formik.touched.password && formik.errors.password}
              radius="lg"
            />

            <div className="flex items-center justify-between px-1 py-2">
              <Link
                className="text-small text-default-500 hover:underline"
                href="/auth/forgot-password"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              color="primary"
              size="lg"
              radius="lg"
              isLoading={formik.isSubmitting}
              fullWidth
            >
              Sign In
            </Button>
          </form>

          <div className="text-center text-sm text-default-500">
            <p>
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

'use client';

import { Button, Card, CardBody, CardHeader, Input } from '@heroui/react';
import { useFormik } from 'formik';
import { authClient } from '@/lib/auth-client';

export default function Register() {
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      otp: '',
      step: 0,
    },

    onSubmit: async (values) => {
      const { error } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
        callbackURL: '/dashboard',
      });
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-sm text-default-500">Sign up to get started</p>
        </CardHeader>
        <CardBody className="flex flex-col gap-6">
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            <Input
              type="text"
              name="name"
              label="Full Name"
              placeholder="Enter your full name"
              value={formik.values.name}
              onChange={formik.handleChange}
              isInvalid={formik.touched.name && !!formik.errors.name}
              errorMessage={formik.touched.name && formik.errors.name}
              autoFocus
              radius="lg"
            />

            <Input
              type="email"
              name="email"
              label="Email Address"
              placeholder="Enter your email address"
              value={formik.values.email}
              onChange={formik.handleChange}
              isInvalid={formik.touched.email && !!formik.errors.email}
              errorMessage={formik.touched.email && formik.errors.email}
              radius="lg"
            />

            <Input
              type="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              isInvalid={formik.touched.password && !!formik.errors.password}
              errorMessage={formik.touched.password && formik.errors.password}
              radius="lg"
            />

            <Input
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
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
              Create Account
            </Button>
          </form>

          {formik.values.step > 0 && (
            <div className="text-center">
              <Button
                variant="light"
                size="sm"
                onPress={() => formik.setFieldValue('step', formik.values.step - 1)}
              >
                Back
              </Button>
            </div>
          )}

          <div className="text-center text-sm text-default-500">
            <p>
              Already have an account?{' '}
              <a href="/auth/login" className="text-primary hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

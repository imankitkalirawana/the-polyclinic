'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'nextjs-toploader/app';
import { useFormik } from 'formik';
import { useQueryState } from 'nuqs';
import * as Yup from 'yup';
import { Button, Input } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

import Logo from '../ui/logo';

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [email, setEmail] = useQueryState('email');
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: email ?? '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
        }).then((res) => {
          if (res?.error) {
            formik.setFieldError('password', res.code);
          } else {
            router.push('/dashboard');
          }
        });
      } catch (e) {
        console.error(e);
      }
    },
  });
  return (
    <div className="mt-12 flex h-full w-full flex-col items-center justify-center">
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-3xl bg-content1 px-8 py-6 shadow-small">
        <div className="flex flex-col items-center pb-6">
          <Logo />
          <p className="text-small text-default-500">
            Log in to your account to continue
          </p>
        </div>
        <form className="flex flex-col gap-3" onSubmit={formik.handleSubmit}>
          <Input
            label="Email"
            radius="lg"
            name="email"
            onChange={(e) => {
              formik.handleChange(e);
              setEmail(e.target.value);
            }}
            value={formik.values.email}
            isInvalid={
              formik.touched.email && formik.errors.email ? true : false
            }
            errorMessage={formik.errors.email}
          />
          <Input
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="Password"
            name="password"
            radius="lg"
            type={isVisible ? 'text' : 'password'}
            onChange={formik.handleChange}
            value={formik.values.password}
            isInvalid={
              formik.touched.password && formik.errors.password ? true : false
            }
            errorMessage={formik.errors.password}
          />
          <div className="flex items-center justify-between px-1 py-2">
            <Link
              className="text-small text-default-500 hover:underline"
              href={`/auth/forgot-password?email=${formik.values.email}`}
            >
              Forgot password?
            </Link>
          </div>
          <Button
            color="primary"
            type="submit"
            isLoading={formik.isSubmitting}
            isDisabled={!formik.isValid}
            variant="shadow"
            radius="lg"
            className="py-6"
          >
            Log In
          </Button>
        </form>

        <p className="text-center text-small">
          Need to create an account?&nbsp;
          <Link
            href={`/auth/register?email=${formik.values.email}`}
            className="text-primary hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

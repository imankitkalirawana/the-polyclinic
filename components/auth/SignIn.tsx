'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Avatar, Button, Divider, Input } from '@nextui-org/react';
import Link from 'next/link';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import * as Yup from 'yup';
import { useSearchParams } from 'next/navigation';

const SignIn = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const searchParams = useSearchParams();

  const search = searchParams.get('code');

  const formik = useFormik({
    initialValues: {
      id: '',
      password: ''
    },
    validationSchema: Yup.object({
      id: Yup.string().required('Email / Phone number is required'),
      password: Yup.string().required('Password is required')
    }),
    onSubmit: async (values) => {
      try {
        await signIn('credentials', {
          id: values.id,
          password: values.password,
          redirect: false
        }).then((res) => {
          if (res?.error) {
            toast.error(res.code);
          } else if (res?.ok) {
            window.location.href = '/dashboard';
          }
        });
      } catch (e) {
        console.error(e);
      }
    }
  });
  return (
    <div className="mt-12 flex h-full w-full flex-col items-center justify-center">
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <div className="flex flex-col items-center pb-6">
          <Avatar src="/logo.svg" className="p-2" size="lg" />
          <p className="text-xl font-medium">Welcome Back</p>
          <p className="text-small text-default-500">
            Log in to your account to continue
          </p>
        </div>
        <form className="flex flex-col gap-3" onSubmit={formik.handleSubmit}>
          <Input
            label="Email / Phone Number"
            name="id"
            variant="bordered"
            onChange={formik.handleChange}
            value={formik.values.id}
            isInvalid={
              (formik.touched.id && formik.errors.id ? true : false) || search
                ? true
                : false
            }
            errorMessage={formik.errors.id}
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
            type={isVisible ? 'text' : 'password'}
            variant="bordered"
            onChange={formik.handleChange}
            value={formik.values.password}
            isInvalid={
              (formik.touched.password && formik.errors.password
                ? true
                : false) || search
                ? true
                : false
            }
            errorMessage={formik.errors.password || search}
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
            color="primary"
            type="submit"
            isLoading={formik.isSubmitting}
            isDisabled={!formik.isValid}
          >
            Log In
          </Button>
        </form>

        <p className="text-center text-small">
          Need to create an account?&nbsp;
          <Link href="/auth/register" className="hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;

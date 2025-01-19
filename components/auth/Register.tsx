'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Avatar, Button, Link, Input } from "@heroui/react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import React from 'react';
import axios from 'axios';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp';

export default function Register() {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const searchParams = useSearchParams();
  const [isVerified, setIsVerified] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sp = searchParams.get('id') ?? '';
    formik.setFieldValue('id', sp);
  }, [searchParams.get('id')]);

  useEffect(() => {
    const sp = searchParams.get('otp') ?? '';
    if (sp) {
      setIsOtpSent(true);
    } else {
      setIsOtpSent(false);
    }
  }, [searchParams.get('otp')]);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      id: '',
      otp: '',
      password: '',
      confirmPassword: '',
      isChecked: false
    },
    onSubmit: async (values) => {
      try {
        if (values.otp) {
          verifyOtp();
        } else {
          const res = await axios.post('/api/auth/register/send-otp', values);
          toast.success(res.data.message);
          setIsOtpSent(true);
        }
      } catch (e) {
        console.error(e);
      }
    }
  });

  useEffect(() => {
    if (formik.values.otp.length === 4) {
      formik.handleSubmit();
    }
  }, [formik.values.otp]);

  useEffect(() => {
    if (count > 5) {
      toast.error('Maximum attempts reached. Please try again later.');
      setIsOtpSent(false);
      setIsVerified(false);
      setCount(0);
      formik.setFieldValue('otp', '');
    }
  }, [count]);

  const verifyOtp = async () => {
    try {
      console.log(formik.values.id, formik.values.otp);
      const res = await axios.post('/api/auth/verify-otp', {
        id: formik.values.id,
        otp: parseInt(formik.values.otp)
      });
      toast.success(res.data.message);
      setIsVerified(true);
    } catch (error: any) {
      setCount(count + 1);
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const resendOtp = async () => {
    try {
      const res = await axios.post('/api/auth/register/send-otp', {
        id: formik.values.id
      });
      toast.success(res.data.message);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="mt-12 flex h-full w-full flex-col items-center justify-center">
        <div className="mt-2 flex w-full max-w-sm flex-col justify-center gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
          <div className="flex flex-col items-center pb-6">
            <Avatar src="/logo.svg" className="p-2" size="lg" />
            <p className="text-xl font-medium">
              {isVerified
                ? 'Complete Profile'
                : isOtpSent
                  ? 'Enter OTP'
                  : 'Welcome'}
            </p>
            <p className="text-small text-default-500">
              {isVerified
                ? 'Enter your details to continue'
                : isOtpSent
                  ? `We have send a verification code to ${formik.values.id}`
                  : 'Enter your email / phone number to register'}
            </p>
          </div>
          {isVerified ? (
            <DetailForm />
          ) : (
            <>
              {!isOtpSent && <IdInput />}
              {isOtpSent && (
                <>
                  <div className="mb-2 flex flex-col items-center justify-center">
                    <InputOTP
                      maxLength={4}
                      value={formik.values.otp}
                      onChange={(value) => formik.setFieldValue('otp', value)}
                    >
                      <InputOTPGroup>
                        {Array.from({ length: 4 }).map((_, index) => (
                          <InputOTPSlot index={index} key={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                    <div className="mt-4 flex flex-col items-center justify-between px-1 py-2 text-small text-default-500">
                      <p>Didn&apos;t receive the code?</p>
                      <span
                        className="cursor-pointer select-none text-primary hover:underline"
                        onClick={resendOtp}
                      >
                        Resend Code
                      </span>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          <p className="text-center text-small">
            Already have an account?&nbsp;
            <Link href="/auth/login" size="sm">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

const IdInput = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sp = searchParams.get('id') ?? '';
    formik.setFieldValue('id', sp);
  }, []);

  const handleIdInput = (value: string) => {
    const sp = new URLSearchParams(searchParams);
    if (value.trim() === '') {
      sp.delete('id');
    } else {
      sp.set('id', value);
    }
    router.push(`${pathname}?${sp.toString()}`);
  };
  const formik = useFormik({
    initialValues: {
      id: ''
    },
    validationSchema: Yup.object({
      id: Yup.string().required('Email or Phone Number is required')
    }),
    onSubmit: async (values) => {
      try {
        const res = await axios.post('/api/auth/register/send-otp', values);
        toast.success(res.data.message);
        const sp = new URLSearchParams(searchParams);
        sp.set('otp', 'true');
        router.push(`${pathname}?${sp.toString()}`);
      } catch (error: any) {
        toast.error(error.response.data.message);
        console.error(error);
      }
    }
  });
  return (
    <>
      <form className="flex flex-col gap-3">
        <Input
          label="Email / Phone Number"
          name="id"
          variant="bordered"
          onChange={(e) => {
            handleIdInput(e.target.value);
            formik.setFieldValue('id', e.target.value);
          }}
          value={formik.values.id}
          isInvalid={formik.touched.id && formik.errors.id ? true : false}
          errorMessage={formik.errors.id}
        />
        <Button
          color="primary"
          type="submit"
          isLoading={formik.isSubmitting}
          onPress={() => formik.handleSubmit()}
        >
          Send OTP
        </Button>
      </form>
    </>
  );
};

const DetailForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const searchParams = useSearchParams();

  useEffect(() => {
    const sp = searchParams.get('id') ?? '';
    formik.setFieldValue('id', sp);
  }, []);
  const formik = useFormik({
    initialValues: {
      name: '',
      id: '',
      password: '',
      confirmPassword: '',
      isChecked: false
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Name is required')
        .min(3, "Name can't be less than 3 characters")
        .max(50, "Name can't be more than 50 characters"),
      id: Yup.string().required('Email or Phone Number is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters long')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .required('Please retype your password.')
        .oneOf([Yup.ref('password')], 'Your passwords do not match.')
    }),
    onSubmit: async (values) => {
      // call api /api/auth/register
      try {
        const res = await axios.post('/api/auth/register', values);
        await signIn('credentials', {
          id: values.id,
          password: values.password,
          redirect: true,
          callbackUrl: '/dashboard'
        });
      } catch (error: any) {
        toast.error(error.response.data.message);
        console.error(error);
      }
    }
  });
  return (
    <>
      <form className="flex flex-col gap-3" onSubmit={formik.handleSubmit}>
        <Input
          label="Email / Phone Number"
          name="id"
          variant="bordered"
          onChange={(e) => {
            formik.setFieldValue('id', e.target.value);
          }}
          value={formik.values.id}
          isInvalid={formik.touched.id && formik.errors.id ? true : false}
          errorMessage={formik.errors.id}
          isReadOnly
          isDisabled
        />
        <Input
          label="Name"
          name="name"
          placeholder="Enter your name"
          type="text"
          variant="bordered"
          onChange={formik.handleChange}
          value={formik.values.name}
          isInvalid={formik.touched.name && formik.errors.name ? true : false}
          errorMessage={formik.errors.name}
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
          placeholder="Enter your password"
          type={isVisible ? 'text' : 'password'}
          variant="bordered"
          onChange={formik.handleChange}
          value={formik.values.password}
          isInvalid={
            formik.touched.password && formik.errors.password ? true : false
          }
          errorMessage={formik.errors.password}
        />
        <Input
          endContent={
            <button type="button" onClick={toggleConfirmVisibility}>
              {isConfirmVisible ? (
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
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm your password"
          type={isConfirmVisible ? 'text' : 'password'}
          variant="bordered"
          onChange={formik.handleChange}
          value={formik.values.confirmPassword}
          isInvalid={
            formik.touched.confirmPassword && formik.errors.confirmPassword
              ? true
              : false
          }
          errorMessage={formik.errors.confirmPassword}
        />
        <Button color="primary" type="submit" isLoading={formik.isSubmitting}>
          Register
        </Button>
      </form>
    </>
  );
};

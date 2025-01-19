'use client';
import { Avatar, Button, Input } from "@heroui/react";
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import * as Yup from 'yup';
import axios from 'axios';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const ForgotPassword = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [count, setCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const formik = useFormik({
    initialValues: {
      id: '',
      otp: ''
    },
    validationSchema: Yup.object({
      id: Yup.string().required('Email or Phone Number is required')
    }),
    onSubmit: async (values) => {
      try {
        if (values.otp) {
          verifyOtp();
        } else {
          const res = await axios.post('/api/auth/forgot-password', values);
          toast.success(res.data.message);
          setIsOtpSent(true);
        }
      } catch (error: any) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }
  });

  useEffect(() => {
    const sp = searchParams.get('id') ?? '';
    formik.setFieldValue('id', sp);
  }, []);

  useEffect(() => {
    if (count > 5) {
      toast.error('Maximum attempts reached. Please try again later.');
      setIsOtpSent(false);
      setIsVerified(false);
      setCount(0);
      formik.setFieldValue('otp', '');
    }
  }, [count]);

  const resendOtp = async () => {
    try {
      const res = await axios.post('/api/auth/forgot-password', {
        id: formik.values.id
      });
      toast.success(res.data.message);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const verifyOtp = async () => {
    try {
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

  const handleIdInput = (value: string) => {
    const sp = new URLSearchParams(searchParams);
    if (value.trim() === '') {
      sp.delete('id');
    } else {
      sp.set('id', value);
    }
    router.push(`${pathname}?${sp.toString()}`);
  };

  useEffect(() => {
    if (formik.values.otp.length === 4) {
      formik.handleSubmit();
    }
  }, [formik.values.otp]);

  return (
    <>
      <div className="mt-12 flex h-full w-full flex-col items-center justify-center">
        <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
          <div className="flex flex-col items-center pb-6">
            <Avatar src="/logo.svg" className="p-2" size="lg" />
            <p className="mb-4 text-xl font-medium">
              {isVerified
                ? 'Reset Password'
                : isOtpSent
                  ? 'Enter OTP'
                  : 'Forgot Password'}
            </p>
            <p className="text-center text-small text-default-500">
              {isVerified
                ? 'Password must be atleast 8 characters'
                : isOtpSent
                  ? `We have send a verification code to ${formik.values.id}`
                  : 'Enter your email / phone number to reset your password'}
            </p>
          </div>
          {isVerified ? (
            <UpdatePassword id={formik.values.id} />
          ) : (
            <form
              className="flex flex-col gap-3"
              onSubmit={formik.handleSubmit}
            >
              {!isOtpSent && (
                <Input
                  label="Email / Phone Number"
                  name="id"
                  variant="bordered"
                  onChange={(e) => {
                    handleIdInput(e.target.value);
                    formik.setFieldValue('id', e.target.value);
                  }}
                  value={formik.values.id}
                  isInvalid={
                    formik.touched.id && formik.errors.id ? true : false
                  }
                  errorMessage={formik.errors.id}
                  isDisabled={isOtpSent}
                />
              )}

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

              <Button
                color="primary"
                type="submit"
                isLoading={formik.isSubmitting}
                isDisabled={
                  !formik.isValid || (isOtpSent && formik.values.otp.length < 4)
                }
              >
                {isOtpSent ? 'Verify Otp' : 'Send Otp'}
              </Button>
              <Link
                href="/auth/login"
                className="cursor-pointer select-none text-center text-sm text-primary hover:underline"
              >
                Back to login
              </Link>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;

interface UpdatePasswordProps {
  id: string;
}

const UpdatePassword = ({ id }: UpdatePasswordProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters long')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .required('Please retype your password.')
        .oneOf([Yup.ref('password')], 'Your passwords do not match.')
    }),
    onSubmit: async (values) => {
      try {
        await axios.post('/api/auth/update-password', {
          id: id || searchParams.get('id'),
          password: values.password
        });
        toast.success('Password updated successfully');
        router.push('/auth/login');
      } catch (error: any) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }
  });

  return (
    <>
      <form className="flex flex-col gap-3" onSubmit={formik.handleSubmit}>
        <Input
          label="New Password"
          name="password"
          type="password"
          variant="bordered"
          onChange={formik.handleChange}
          value={formik.values.password}
          isInvalid={
            formik.touched.password && formik.errors.password ? true : false
          }
          errorMessage={formik.errors.password}
        />
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
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
          Update Password
        </Button>
        <Link
          href="/auth/login"
          className="cursor-pointer select-none text-center text-sm text-primary hover:underline"
        >
          Back to login
        </Link>
      </form>
    </>
  );
};

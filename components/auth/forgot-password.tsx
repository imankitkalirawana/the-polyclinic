'use client';
import { addToast, Button, Input, InputOtp } from '@heroui/react';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '../ui/logo';
import { sendOTP, updatePassword, verifyOTP } from '@/lib/server-actions/auth';
import { useQueryState } from 'nuqs';

export default function ForgotPassword() {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [email, setEmail] = useQueryState('email');

  const formik = useFormik({
    initialValues: {
      email: email ?? '',
      otp: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Email is required'),
    }),
    onSubmit: async (values) => {
      try {
        if (values.otp) {
          const res = await verifyOTP({
            email: values.email,
            otp: parseInt(values.otp),
            type: 'forgot-password',
          });
          if (res.success) {
            setIsVerified(true);
          } else {
            formik.setFieldError('otp', res.message);
          }
        } else {
          const res = await sendOTP({
            email: values.email,
            type: 'forgot-password',
          });

          if (res.success) {
            setIsOtpSent(true);
          } else {
            formik.setFieldError('email', res.message);
          }
        }
      } catch (error: any) {
        console.error(error);
        addToast({
          title: 'Error sending OTP',
          description: error.response.data.message,
          color: 'danger',
        });
      }
    },
  });

  const resendOtp = async () => {
    setIsResendingOtp(true);
    const res = await sendOTP({
      email: formik.values.email,
      type: 'forgot-password',
    });

    if (res.success) {
      setIsOtpSent(true);
    } else {
      formik.setFieldError('email', res.message);
    }
    setIsResendingOtp(false);
  };

  return (
    <>
      <div className="mt-12 flex h-full w-full flex-col items-center justify-center">
        <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-3xl bg-content1 px-8 py-6 shadow-small">
          <div className="flex flex-col items-center pb-6">
            <Logo />
            <p className="text-center text-small text-default-500">
              {isVerified
                ? 'Password must be atleast 8 characters'
                : isOtpSent
                  ? `We have send a verification code to ${formik.values.email}`
                  : 'Enter your email to reset your password'}
            </p>
          </div>
          {isVerified ? (
            <UpdatePassword />
          ) : (
            <form
              className="flex flex-col gap-3"
              onSubmit={formik.handleSubmit}
            >
              {!isOtpSent && (
                <Input
                  label="Email"
                  name="email"
                  radius="lg"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    formik.setFieldValue('email', e.target.value);
                  }}
                  value={formik.values.email}
                  isInvalid={
                    formik.touched.email && formik.errors.email ? true : false
                  }
                  errorMessage={formik.errors.email}
                  isDisabled={isOtpSent}
                />
              )}

              {isOtpSent && (
                <>
                  <div className="mb-2 flex flex-col items-center justify-center">
                    <InputOtp
                      length={4}
                      name="otp"
                      radius="lg"
                      value={formik.values.otp}
                      onValueChange={(value) =>
                        formik.setFieldValue('otp', value)
                      }
                      autoFocus
                      onComplete={() => formik.handleSubmit()}
                      isInvalid={
                        formik.touched.otp && formik.errors.otp ? true : false
                      }
                      errorMessage={
                        <span className="line-clamp-1 max-w-[200px] text-sm">
                          {formik.errors.otp}
                        </span>
                      }
                    />
                    <div className="mt-4 flex flex-col items-center justify-between px-1 py-2 text-small text-default-500">
                      <p>Didn&apos;t receive the code?</p>
                      <Button
                        variant="light"
                        size="sm"
                        color="primary"
                        onPress={resendOtp}
                        isLoading={isResendingOtp}
                      >
                        Resend Code
                      </Button>
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
                radius="lg"
                variant="shadow"
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
}

const UpdatePassword = () => {
  const [email, setEmail] = useQueryState('email');
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: email ?? '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters long')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .required('Please retype your password.')
        .oneOf([Yup.ref('password')], 'Your passwords do not match.'),
    }),
    onSubmit: async (values) => {
      await updatePassword({
        email: email ?? '',
        password: values.password,
      })
        .then(() => {
          addToast({
            title: 'Password updated successfully',
            color: 'success',
          });
          router.push(`/auth/login?email=${email}`);
        })
        .catch((error) => {
          addToast({
            title: error.message,
            color: 'danger',
          });
        });
    },
  });

  return (
    <>
      <form className="flex flex-col gap-3" onSubmit={formik.handleSubmit}>
        <Input
          label="Email"
          name="email"
          type="email"
          value={formik.values.email}
          className="sr-only"
          isDisabled
        />
        <Input
          label="New Password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
          radius="lg"
          isInvalid={
            formik.touched.password && formik.errors.password ? true : false
          }
          errorMessage={formik.errors.password}
        />
        <Input
          label="Confirm Password"
          name="confirmPassword"
          radius="lg"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.confirmPassword}
          isInvalid={
            formik.touched.confirmPassword && formik.errors.confirmPassword
              ? true
              : false
          }
          errorMessage={formik.errors.confirmPassword}
        />
        <Button
          color="primary"
          type="submit"
          isLoading={formik.isSubmitting}
          radius="lg"
          variant="shadow"
        >
          Update Password
        </Button>
        <Link
          href={`/auth/login?email=${email}`}
          className="cursor-pointer select-none text-center text-sm text-primary hover:underline"
        >
          Back to login
        </Link>
      </form>
    </>
  );
};

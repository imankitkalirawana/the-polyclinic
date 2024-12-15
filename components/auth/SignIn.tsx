'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  Avatar,
  Badge,
  BadgeProps,
  Button,
  Divider,
  Input,
  RadioGroup,
  Tooltip
} from '@nextui-org/react';
import Link from 'next/link';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion';
import UserRadio from './user-radio';
import axios from 'axios';
import { getAllUsers } from '@/functions/server-actions';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { UserType } from '@/models/User';

const SignIn = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [[page, direction], setPage] = useState([0, 0]);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const searchParams = useSearchParams();

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 20 : -20,
      opacity: 0
    })
  };

  const paginate = (newDirection: number) => {
    console.log('newDirection', newDirection, 'page', page);
    setPage([page + newDirection, newDirection]);
  };

  const search = searchParams.get('code');

  const formik = useFormik({
    initialValues: {
      id: '',
      password: '',
      users: [] as UserType[]
    },
    onSubmit: async (values) => {
      if (page === 0) {
        await getAllUsers(values.id).then((res) => {
          if (res.length > 1) {
            formik.setValues({ ...values, users: res });
            paginate(1);
          } else if (res.length === 1) {
            paginate(2);
          } else {
            formik.setErrors({ id: 'User not found' });
          }
        });
      } else if (page === 1) {
        paginate(1);
      } else {
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
      }
    }
  });

  return (
    <div className="mt-12 flex h-full w-full flex-col items-center justify-center">
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <LazyMotion features={domAnimation}>
          <m.div layout className="flex min-h-[40px] items-center gap-2 pb-2">
            {page !== 0 && (
              <m.div>
                <Tooltip content="Go back" delay={1000}>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    onPress={() => {
                      if (formik.values?.users?.length <= 1) {
                        paginate(-2);
                      } else {
                        paginate(-1);
                      }
                    }}
                  >
                    <Icon
                      className="text-default-500"
                      icon="solar:alt-arrow-left-linear"
                      width={16}
                    />
                  </Button>
                </Tooltip>
              </m.div>
            )}
            <m.h1
              layout
              className="text-xl font-medium"
              transition={{ duration: 0.25 }}
            >
              {page === 0 ? 'Welcome Back' : 'Log In'}
            </m.h1>
          </m.div>
          <AnimatePresence custom={direction} initial={false} mode="wait">
            <m.form
              key={page}
              animate="center"
              className="flex flex-col gap-3"
              custom={direction}
              exit="exit"
              initial="enter"
              transition={{
                duration: 0.25
              }}
              variants={variants}
              onSubmit={formik.handleSubmit}
            >
              {page === 0 ? (
                <Input
                  label="Email / Phone Number"
                  name="id"
                  onChange={formik.handleChange}
                  value={formik.values.id}
                  isInvalid={
                    (formik.touched.id && formik.errors.id ? true : false) ||
                    search
                      ? true
                      : false
                  }
                  errorMessage={formik.errors.id}
                />
              ) : page === 1 ? (
                <>
                  <RadioGroup
                    aria-label="Users"
                    classNames={{ wrapper: 'gap-3' }}
                  >
                    {formik.values.users.map((user) => (
                      <UserRadio
                        key={user._id}
                        description={user.email}
                        icon={
                          <Icon
                            className="text-secondary"
                            icon="solar:user-linear"
                            width={18}
                          />
                        }
                        label={user.name}
                        value={user.email}
                        name="id"
                        onChange={(e) => {
                          formik.setFieldValue('id', e.target.value);
                        }}
                      />
                    ))}
                  </RadioGroup>
                </>
              ) : (
                <>
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
                </>
              )}
              <Button
                color="primary"
                type="submit"
                isLoading={formik.isSubmitting}
              >
                {page === 0 ? 'Continue with Email' : 'Log In'}
              </Button>
            </m.form>
          </AnimatePresence>
        </LazyMotion>

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

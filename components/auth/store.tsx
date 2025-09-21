'use client';

import { createContext, useContext, useState } from 'react';
import { addToast } from '@heroui/react';
import { useFormik } from 'formik';
import { useQueryState } from 'nuqs';
import * as Yup from 'yup';
import { AuthContextType, FlowType } from './types';
import { login } from '@/lib/auth';
import { $FixMe } from '@/types';
import { useSubdomain } from '@/hooks/useSubDomain';
import { AuthApi } from '@/services/common/auth/api';
import { useCookies } from '@/providers/cookies-provider';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Factory
export const createAuthProvider = (flowType: FlowType) =>
  function AuthProvider({ children }: { children: React.ReactNode }) {
    const [email] = useQueryState('email');
    const subdomain = useSubdomain();
    const [token, setToken] = useState<string | null>(null);
    const { setCookie } = useCookies();

    // Initial values based on flow type
    const getInitialValues = () => {
      const baseValues = {
        email: email ?? '',
        password: '',
        otp: '',
        page: token ? 4 : 0,
        direction: 1,
        submitCount: 0,
      };

      switch (flowType) {
        case 'register':
          return {
            ...baseValues,
            name: '',
            dob: null as string | null,
            gender: 'male',
            agreed: false,
            isValidation: false,
          };
        case 'login':
          return baseValues;
        case 'forgot-password':
          return {
            ...baseValues,
            newPassword: '',
            confirmPassword: '',
          };
        default:
          return baseValues;
      }
    };

    // Validation schema based on flow type
    const getValidationSchema = () => {
      switch (flowType) {
        case 'register':
          return Yup.object().shape({
            name: Yup.string().when('page', {
              is: 2,
              then: (schema) => schema.required('Name is required'),
              otherwise: (schema) => schema,
            }),
            email: Yup.string()
              .email('Invalid email')
              .when('page', {
                is: 1,
                then: (schema) => schema.required('Email is required'),
                otherwise: (schema) => schema,
              }),
            otp: Yup.string().when('page', {
              is: 3,
              then: (schema) => schema.required('OTP is required'),
              otherwise: (schema) => schema,
            }),
            password: Yup.string().when('page', {
              is: 4,
              then: (schema) =>
                schema
                  .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                  )
                  .required('Password is required'),
              otherwise: (schema) => schema,
            }),
          });
        case 'login':
          return Yup.object().shape({
            email: Yup.string()
              .email('Invalid email')
              .when('page', {
                is: 1,
                then: (schema) => schema.required('Email is required'),
                otherwise: (schema) => schema,
              }),
            password: Yup.string().when('page', {
              is: 2,
              then: (schema) => schema.required('Password is required'),
              otherwise: (schema) => schema,
            }),
          });
        case 'forgot-password':
          return Yup.object().shape({
            email: Yup.string()
              .email('Invalid email')
              .when('page', {
                is: 0,
                then: (schema) => schema.required('Email is required'),
                otherwise: (schema) => schema,
              }),
            otp: Yup.string().when('page', {
              is: 1,
              then: (schema) => schema.required('OTP is required'),
              otherwise: (schema) => schema,
            }),
            newPassword: Yup.string().when('page', {
              is: 2,
              then: (schema) =>
                schema
                  .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                  )
                  .required('New password is required'),
              otherwise: (schema) => schema,
            }),
            confirmPassword: Yup.string().when('page', {
              is: 2,
              then: (schema) =>
                schema
                  .oneOf([Yup.ref('newPassword')], 'Passwords must match')
                  .required('Confirm password is required'),
              otherwise: (schema) => schema,
            }),
          });
        default:
          return Yup.object().shape({});
      }
    };

    // Handle form submission based on flow type
    const handleSubmit = async (values: $FixMe, { setFieldError }: $FixMe) => {
      try {
        switch (flowType) {
          case 'register':
            return handleRegisterSubmit(values, { setFieldError });
          case 'login':
            return handleLoginSubmit(values, { setFieldError });
          case 'forgot-password':
            return handleForgotPasswordSubmit(values, { setFieldError });
          default:
        }
      } catch (error) {
        addToast({
          title: 'An error occurred',
          description: error instanceof Error ? error.message : 'Please try again later.',
          color: 'danger',
        });
      }
    };

    // Registration flow
    const handleRegisterSubmit = async (values: $FixMe, { setFieldError }: $FixMe) => {
      if (values.page === 0) {
        paginate(1);
      } else if (values.page === 1) {
        paginate(1);
      } else if (values.page === 2) {
        await AuthApi.sendOTP({
          email: values.email,
          type: 'register',
          subdomain,
        })
          .then(() => {
            paginate(1);
          })
          .catch((error) => {
            addToast({
              title: 'An error occurred',
              description: error instanceof Error ? error.message : 'Please try again later.',
              color: 'danger',
            });
          });
      } else if (values.page === 3) {
        //  Verify OTP here
        const res = await AuthApi.verifyOTP({
          email: values.email,
          otp: values.otp,
          type: 'register',
          subdomain,
        });

        if (res.success) {
          setToken(res.data?.token ?? null);
          paginate(1);
        } else {
          setFieldError('otp', res.message);
        }
      } else if (values.page === 4) {
        const res = await AuthApi.registerUser({
          email: values.email,
          name: values.name,
          password: values.password,
          subdomain: subdomain ?? '',
          token: token ?? '',
        });

        if (res.success) {
          // login user
          await login({
            email: values.email,
            password: values.password,
          });
        }
      }
    };

    // Login flow
    const handleLoginSubmit = async (values: $FixMe, { setFieldError }: $FixMe) => {
      if (values.page === 0) {
        paginate(1);
      }

      if (values.page === 1) {
        const res = await AuthApi.verifyEmail({ email: values.email });
        if (!res?.data?.exists) {
          setFieldError('email', 'Email does not exist');
        } else {
          paginate(1);
        }
      } else if (values.page === 2) {
        await AuthApi.login({
          email: values.email,
          password: values.password,
        }).then((res) => {
          if (res.success) {
            setCookie('connect.sid', res.data?.token ?? '', { path: '/' });
            window.location.href = '/dashboard';
          } else {
            addToast({
              title: res.message,
              color: 'danger',
            });
            setFieldError('password', res.errors?.[0] ?? res.message);
          }
        });
      }
    };

    // Forgot password flow
    const handleForgotPasswordSubmit = async (values: $FixMe, { setFieldError }: $FixMe) => {
      if (values.page === 0) {
        await AuthApi.sendOTP({
          email: values.email,
          type: 'reset-password',
          subdomain,
        })
          .then(() => {
            paginate(1);
          })
          .catch((error) => {
            addToast({
              title: 'An error occurred',
              description: error instanceof Error ? error.message : 'Please try again later.',
              color: 'danger',
            });
          });
      } else if (values.page === 1) {
        const res = await AuthApi.verifyOTP({
          email: values.email,
          otp: values.otp,
          type: 'reset-password',
          subdomain,
        });

        if (res.success) {
          setToken(res.data?.token ?? null);
          paginate(1);
        } else {
          setFieldError('otp', res.message);
        }
      } else if (values.page === 2) {
        const res = await AuthApi.resetPassword({
          email: values.email,
          password: values.newPassword,
          subdomain: subdomain ?? '',
          token: token ?? '',
        });

        if (res.success) {
          const result = await login({
            email: values.email,
            password: values.newPassword,
          });

          if (result.success) {
            window.location.href = '/dashboard';
          } else {
            addToast({
              title: result.message,
              color: 'danger',
            });
          }
        } else {
          addToast({
            title: res.message,
            description: res.errors?.[0],
            color: 'danger',
          });
        }
      }
    };

    const formik = useFormik({
      initialValues: getInitialValues(),
      validationSchema: getValidationSchema(),
      onSubmit: handleSubmit,
      validateOnBlur: false,
    });

    const paginate = (newDirection: number) => {
      formik.setFieldValue('page', formik.values.page + newDirection);
      formik.setFieldValue('direction', newDirection);
    };

    return <AuthContext.Provider value={{ formik, paginate }}>{children}</AuthContext.Provider>;
  };

// Custom hooks
export const useRegister = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useRegister must be used within a RegisterProvider');
  return context;
};

export const useLogin = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useLogin must be used within a LoginProvider');
  return context;
};

export const useForgetPassword = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useForgetPassword must be used within a ForgotPasswordProvider');
  return context;
};

// Provider component instances
export const RegisterProvider = createAuthProvider('register');
export const LoginProvider = createAuthProvider('login');
export const ForgotPasswordProvider = createAuthProvider('forgot-password');

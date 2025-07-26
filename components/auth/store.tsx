'use client';
import { addToast } from '@heroui/react';
import { useFormik } from 'formik';
import { useRouter } from 'nextjs-toploader/app';
import { useQueryState } from 'nuqs';
import { createContext, useContext } from 'react';
import * as Yup from 'yup';

import { verifyEmail } from '@/functions/server-actions/auth/verification';
import { login, register, sendOTP, verifyOTP } from '@/lib/server-actions/auth';
import { $FixMe } from '@/types';

import { AuthContextType, FlowType } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Factory
export const createAuthProvider = (flowType: FlowType) => {
  return ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [email] = useQueryState('email');

    // Initial values based on flow type
    const getInitialValues = () => {
      const baseValues = {
        email: email ?? '',
        password: '',
        otp: '',
        page: 0,
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
            return;
        }
      } catch {
        addToast({
          title: 'An error occurred',
          description: 'Please try again later.',
          color: 'danger',
        });
      }
    };

    // Registration flow
    const handleRegisterSubmit = async (
      values: $FixMe,
      { setFieldError }: $FixMe
    ) => {
      if (values.page === 0) {
        paginate(1);
      } else if (values.page === 1) {
        // Check if email exists
        if (await verifyEmail(values.email)) {
          setFieldError('email', 'Email already exists');
          return;
        } else {
          paginate(1);
        }
      } else if (values.page === 2) {
        // Send OTP
        const res = await sendOTP({ email: values.email });
        if (!res.success) {
          setFieldError('email', res.message);
        } else {
          addToast({
            title: res.message,
            color: 'success',
          });
          paginate(1);
        }
      } else if (values.page === 3) {
        // Verify OTP
        const res = await verifyOTP({
          email: values.email,
          otp: parseInt(values.otp),
        });
        if (!res.success) {
          setFieldError('otp', res.message);
        } else {
          paginate(1);
        }
      } else if (values.page === 4) {
        // Register user
        const res = await register({
          email: values.email,
          password: values.password,
          name: values.name,
          dob: values.dob ?? undefined,
          gender: values.gender,
        });
        if (res.success) {
          await login({
            email: values.email,
            password: values.password,
          });
          window.location.href = '/';
        } else {
          addToast({
            title: res.message,
            color: 'danger',
          });
        }
      }
    };

    // Login flow
    const handleLoginSubmit = async (
      values: $FixMe,
      { setFieldError }: $FixMe
    ) => {
      if (values.page === 0) {
        paginate(1);
      }
      if (values.page === 1) {
        // Check if email exists
        if (!(await verifyEmail(values.email))) {
          setFieldError('email', 'Email not found');
          return;
        } else {
          paginate(1);
        }
      } else if (values.page === 2) {
        const res = await login({
          email: values.email,
          password: values.password,
        });

        if (res?.error) {
          setFieldError('password', res.message);
        } else {
          window.location.href = '/dashboard';
        }
      }
    };

    // Forgot password flow
    const handleForgotPasswordSubmit = async (
      values: $FixMe,
      { setFieldError }: $FixMe
    ) => {
      if (values.page === 0) {
        // Send OTP
        const res = await sendOTP({
          email: values.email,
          type: 'forgot-password',
        });

        if (!res.success) {
          setFieldError('email', res.message);
        } else {
          addToast({
            title: res.message,
            color: 'success',
          });
          paginate(1);
        }
      } else if (values.page === 1) {
        // Verify OTP
        const res = await verifyOTP({
          email: values.email,
          otp: parseInt(values.otp),
        });

        if (!res.success) {
          setFieldError('otp', res.message);
        } else {
          paginate(1);
        }
      } else if (values.page === 2) {
        // Reset password
        // Since resetPassword function is not available, use fetch API directly
        try {
          const res = await fetch('/api/auth/reset-password', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: values.email,
              password: values.newPassword,
              otp: parseInt(values.otp),
            }),
          });

          const data = await res.json();

          addToast({
            title: data.message,
            description: 'You can now login with your new password.',
            color: 'success',
          });
          router.push('/auth/login?email=' + values.email);
        } catch {
          addToast({
            title: 'An error occurred',
            description: 'Please try again later.',
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

    return (
      <AuthContext.Provider value={{ formik, paginate }}>
        {children}
      </AuthContext.Provider>
    );
  };
};

// Custom hooks
export const useRegister = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error('useRegister must be used within a RegisterProvider');
  return context;
};

export const useLogin = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useLogin must be used within a LoginProvider');
  return context;
};

export const useForgetPassword = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error(
      'useForgetPassword must be used within a ForgotPasswordProvider'
    );
  return context;
};

// Provider component instances
export const RegisterProvider = createAuthProvider('register');
export const LoginProvider = createAuthProvider('login');
export const ForgotPasswordProvider = createAuthProvider('forgot-password');

'use client';

import { createContext, useContext } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { addToast } from '@heroui/react';
import { useFormik } from 'formik';
import { useQueryState } from 'nuqs';
import * as Yup from 'yup';

import { AuthContextType, FlowType } from './types';

import { verifyEmail } from '@/functions/server-actions/auth/verification';
import { $FixMe } from '@/types';
import { authClient } from '@/lib/auth-client';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Factory
export const createAuthProvider = (flowType: FlowType) =>
  function AuthProvider({ children }: { children: React.ReactNode }) {
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
              // .email('Invalid email')
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
      } catch {
        addToast({
          title: 'An error occurred',
          description: 'Please try again later.',
          color: 'danger',
        });
      }
    };

    // Registration flow
    const handleRegisterSubmit = async (values: $FixMe, { setFieldError }: $FixMe) => {
      if (values.page === 0) {
        paginate(1);
      } else if (values.page === 1) {
        // Check if email exists
        if (await verifyEmail(values.email)) {
          setFieldError('email', 'Email already exists');
        } else {
          paginate(1);
        }
      } else if (values.page === 2) {
        // Send OTP using Better Auth
        try {
          await authClient.emailOtp.sendVerificationOtp({
            email: values.email,
            type: 'email-verification',
          });
          addToast({
            title: 'OTP sent successfully',
            color: 'success',
          });
          paginate(1);
        } catch (error) {
          setFieldError('email', 'Failed to send OTP. Please try again.');
        }
      } else if (values.page === 3) {
        // Verify OTP using Better Auth
        try {
          await authClient.emailOtp.verifyEmail({
            email: values.email,
            otp: values.otp,
          });
          paginate(1);
        } catch (error) {
          setFieldError('otp', 'Invalid OTP. Please try again.');
        }
      } else if (values.page === 4) {
        // Register user using Better Auth
        try {
          await authClient.signIn.phoneNumber({
            phoneNumber: values.email,
            password: values.password,
          });

          addToast({
            title: 'Registration successful',
            description: 'Welcome to our platform!',
            color: 'success',
          });

          router.push('/dashboard');
        } catch (error) {
          setFieldError('password', 'Registration failed. Please try again.');
        }
      }
    };

    // Login flow
    const handleLoginSubmit = async (values: $FixMe, { setFieldError }: $FixMe) => {
      if (values.page === 0) {
        paginate(1);
      }
      if (values.page === 1) {
        // Check if email exists
        if (!(await verifyEmail(values.email))) {
          setFieldError('email', 'Email not found');
        } else {
          paginate(1);
        }
      } else if (values.page === 2) {
        try {
          await authClient.signIn.email({
            email: values.email,
            password: values.password,
            callbackURL: '/dashboard',
          });

          addToast({
            title: 'Login successful',
            color: 'success',
          });

          router.push('/dashboard');
        } catch (error) {
          setFieldError('password', 'Invalid email or password');
        }
      }
    };

    // Forgot password flow
    const handleForgotPasswordSubmit = async (values: $FixMe, { setFieldError }: $FixMe) => {
      if (values.page === 0) {
        // Send OTP using Better Auth
        try {
          await authClient.emailOtp.sendVerificationOtp({
            email: values.email,
            type: 'forget-password',
          });

          addToast({
            title: 'OTP sent successfully',
            color: 'success',
          });
          paginate(1);
        } catch (error) {
          setFieldError('email', 'Failed to send OTP. Please try again.');
        }
      } else if (values.page === 1) {
        // Verify OTP using Better Auth
        try {
          await authClient.emailOtp.verifyEmail({
            email: values.email,
            otp: values.otp,
          });
          paginate(1);
        } catch (error) {
          setFieldError('otp', 'Invalid OTP. Please try again.');
        }
      } else if (values.page === 2) {
        // Reset password using Better Auth
        try {
          await authClient.resetPassword({
            newPassword: values.newPassword,
            token: values.otp,
          });

          addToast({
            title: 'Password reset successful',
            description: 'You can now login with your new password.',
            color: 'success',
          });
          router.push(`/auth/login?email=${values.email}`);
        } catch (error) {
          setFieldError('newPassword', 'Password reset failed. Please try again.');
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

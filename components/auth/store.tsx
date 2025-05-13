'use client';
import { createContext, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQueryState } from 'nuqs';
import { useRouter } from 'nextjs-toploader/app';
import { addToast } from '@heroui/react';
import { signIn } from 'next-auth/react';
import { Gender } from '@/lib/interface';
import { register, sendOTP, verifyOTP } from '@/lib/server-actions/auth';
import { verifyEmail } from '@/functions/server-actions/auth/verification';

// Auth Flow Types
export type FlowType = 'register' | 'login' | 'forgot-password';

export interface AuthFlowContextType {
  formik: ReturnType<typeof useFormik<any>>;
  paginate: (newDirection: number) => void;
}

// Base validation schema
const baseValidationSchema = {
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  otp: Yup.string().required('OTP is required'),
};

// Context
const AuthFlowContext = createContext<AuthFlowContextType | undefined>(
  undefined
);

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
            gender: Gender.male,
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
                is: 0,
                then: (schema) => schema.required('Email is required'),
                otherwise: (schema) => schema,
              }),
            password: Yup.string().when('page', {
              is: 1,
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
    const handleSubmit = async (values: any, { setFieldError }: any) => {
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
      } catch (error) {
        addToast({
          title: 'An error occurred',
          description: 'Please try again later.',
          color: 'danger',
        });
      }
    };

    // Registration flow
    const handleRegisterSubmit = async (
      values: any,
      { setFieldError }: any
    ) => {
      if (values.page === 0) {
        paginate(1);
      } else if (values.page === 1) {
        // Check if email exists
        if (await verifyEmail(values.email)) {
          addToast({
            title: 'Email already exists',
            description: 'Please try a different email.',
            color: 'danger',
          });
          return;
        } else {
          paginate(1);
        }
      } else if (values.page === 2) {
        // Send OTP
        const res = await sendOTP({ email: values.email });
        if (!res.success) {
          addToast({
            title: res.message,
            description: 'Please try again after some time.',
            color: 'danger',
          });
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
          await signIn('credentials', {
            email: values.email,
            password: values.password,
            redirect: false,
          });
          router.push('/');
        } else {
          addToast({
            title: res.message,
            color: 'danger',
          });
        }
      }
    };

    // Login flow
    const handleLoginSubmit = async (values: any, { setFieldError }: any) => {
      if (values.page === 0) {
        // Check if email exists
        if (!(await verifyEmail(values.email))) {
          addToast({
            title: 'Email not found',
            description: 'Please try a different email.',
            color: 'danger',
          });
          return;
        } else {
          paginate(1);
        }
      } else if (values.page === 1) {
        const res = await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (res?.error) {
          setFieldError('password', res.error);
        } else {
          router.push('/dashboard');
        }
      }
    };

    // Forgot password flow
    const handleForgotPasswordSubmit = async (
      values: any,
      { setFieldError }: any
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
        } catch (error) {
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
      <AuthFlowContext.Provider value={{ formik, paginate }}>
        {children}
      </AuthFlowContext.Provider>
    );
  };
};

// Custom hooks
export const useRegisterFlow = () => {
  const context = useContext(AuthFlowContext);
  if (!context)
    throw new Error('useRegisterFlow must be used within a RegisterProvider');
  return context;
};

export const useLoginFlow = () => {
  const context = useContext(AuthFlowContext);
  if (!context)
    throw new Error('useLoginFlow must be used within a LoginProvider');
  return context;
};

export const useForgotPasswordFlow = () => {
  const context = useContext(AuthFlowContext);
  if (!context)
    throw new Error(
      'useForgotPasswordFlow must be used within a ForgotPasswordProvider'
    );
  return context;
};

// Provider component instances
export const RegisterProvider = createAuthProvider('register');
export const LoginProvider = createAuthProvider('login');
export const ForgotPasswordProvider = createAuthProvider('forgot-password');

'use client';
import { useFormik } from 'formik';
import React, { createContext, useContext } from 'react';
import { RegisterContextType, RegisterProps } from './types';
import { useQueryState } from 'nuqs';
import { register, sendOTP, verifyOTP } from '@/lib/server-actions/auth';
import { addToast } from '@heroui/react';
import { registerSchema } from './schema';
import {
  sendMailWithOTP,
  verifyEmail,
} from '@/functions/server-actions/auth/verification';
import { Gender } from '@/lib/interface';
import { signIn } from 'next-auth/react';
import { useRouter } from 'nextjs-toploader/app';

const RegisterContext = createContext<RegisterContextType | undefined>(
  undefined
);

export const RegisterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [email] = useQueryState('email');

  const formik = useFormik<RegisterProps>({
    initialValues: {
      name: '',
      dob: null,
      gender: Gender.male,
      email: email ?? '',
      otp: '',
      password: '',
      agreed: false,
      isValidation: false,
      page: 0,
      direction: 1,
      submitCount: 0,
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setValues, setFieldError, setFieldValue }) => {
      if (values.page === 0) {
        paginate(1);
      } else if (values.page === 1) {
        if (!(await verifyEmail(values.email))) {
          paginate(1);
        } else {
          setFieldError('email', 'Email already exists');
        }
      } else if (values.page === 2) {
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
        if (values.submitCount <= 3) {
          setFieldValue('submitCount', values.submitCount + 1);
          const res = await verifyOTP({
            email: values.email,
            otp: parseInt(values.otp),
          });
          if (!res.success) {
            formik.setFieldError('otp', res.message);
          } else {
            paginate(1);
          }
        } else {
          paginate(-2);
        }
      } else if (values.page === 4) {
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
    },
  });

  const paginate = (newDirection: number) => {
    formik.setFieldValue('page', formik.values.page + newDirection);
    formik.setFieldValue('direction', newDirection);
  };

  return (
    <RegisterContext.Provider value={{ formik, paginate }}>
      {children}
    </RegisterContext.Provider>
  );
};

export const useRegister = () => {
  const context = useContext(RegisterContext);
  if (!context)
    throw new Error('useRegister must be used within a RegisterProvider');
  return context;
};

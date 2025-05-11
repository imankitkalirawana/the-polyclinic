'use client';
import { useFormik } from 'formik';
import React, { createContext, useContext } from 'react';
import { RegisterContextType, RegisterProps } from './types';
import { useQueryState } from 'nuqs';
import { sendOTP, verifyOTP } from '@/lib/server-actions/auth';
import { addToast } from '@heroui/react';
import { registerSchema } from './schema';
import {
  sendMailWithOTP,
  verifyEmail,
} from '@/functions/server-actions/auth/verification';
import { Gender } from '@/lib/interface';

const RegisterContext = createContext<RegisterContextType | undefined>(
  undefined
);

export const RegisterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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
      page: 1,
      direction: 1,
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
          setFieldError('email', res.message);
        } else {
          paginate(1);
        }
      } else if (values.page === 3) {
        paginate(1);
      } else if (values.page === 4) {
        paginate(1);
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

'use client';
import { useFormik } from 'formik';
import React, { createContext, useContext } from 'react';
import { RegisterContextType, RegisterProps } from './types';
import { useQueryState } from 'nuqs';
import { sendOTP, verifyOTP } from '@/lib/server-actions/auth';
import { addToast } from '@heroui/react';
import { registerSchema } from './schema';
import { verifyEmail } from '@/functions/server-actions/auth/verification';
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
    // validationSchema: registerSchema,
    onSubmit: async (values, { setValues, setFieldError, setFieldValue }) => {
      paginate(1);
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

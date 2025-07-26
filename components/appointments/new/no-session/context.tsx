'use client';

import React, { createContext, useContext } from 'react';
import { signIn } from 'next-auth/react';
import { addToast } from '@heroui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import registerUser from '@/functions/server-actions/auth/register';
import {
  sendMailWithOTP,
  verifyEmail,
  verifyOTP,
} from '@/functions/server-actions/auth/verification';

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required('Enter your first name.')
    .min(3, 'Too short')
    .max(50, 'Too long'),
  dob: Yup.object({
    day: Yup.string().required('Enter a valid day'),
    month: Yup.string().required('Enter a valid month'),
    year: Yup.string().required('Enter a valid year'),
  }),
  id: Yup.string().required('Enter a valid email / phone. OTP will be sent to this.'),
  password: Yup.string()
    .required('Enter a password')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Password must contain at least one number and one special character'
    ),
  confirmPassword: Yup.string().when('password', {
    is: (password: string) => password && password.length > 0,
    then: (schema) =>
      schema.required('Confirm your password').oneOf([Yup.ref('password')], 'Passwords must match'),
  }),
});

interface RegisterFormType {
  firstName: string;
  lastName: string;
  dob: { day: string; month: string; year: string };
  id: string;
  otp: string;
  password: string;
  confirmPassword: string;
  step: number;
}

interface FormContextType {
  formik: ReturnType<typeof useFormik<RegisterFormType>>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: React.ReactNode }) {
  const formik = useFormik<RegisterFormType>({
    initialValues: {
      firstName: '',
      lastName: '',
      dob: { day: '', month: '', year: '' },
      id: '',
      otp: '',
      password: '',
      confirmPassword: '',
      step: 1,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (values.step === 1) {
        await handeVerification();
      }
      if (values.step === 2) {
        if (values.otp.length < 4) {
          formik.setFieldError('otp', 'Enter a valid OTP');
          return;
        }
        await verifyOTP(values.id, parseInt(values.otp))
          .then(async () => {
            await handleRegister();
            formik.setValues({ ...values, step: 3 });
          })
          .catch(() => {
            formik.setFieldError('otp', 'Invalid OTP');
          });
        return;
      }
      if (values.step === 3) {
        await handleRegister();
      }
    },
  });

  const handeVerification = async () => {
    if (formik.values.id?.includes('@')) {
      await verifyEmail(formik.values.id).then(async (res) => {
        if (res) {
          formik.setFieldError('id', 'Email already exists');
        } else {
          formik.setFieldError('id', '');
          await sendMailWithOTP(formik.values.id)
            .then(() => {
              formik.setValues({ ...formik.values, step: 2 });
            })
            .catch((err) => {
              formik.setFieldError('id', err.message);
            });
        }
      });
    } else {
      formik.setFieldError('id', 'Phone number not supported yet, use email instead.');
    }
  };

  const handleRegister = async () => {
    const data = {
      name: `${formik.values.firstName} ${formik.values.lastName}`,
      dob: formik.values.dob,
      id: formik.values.id,
      password: formik.values.password,
    };
    await registerUser(data)
      .then(async () => {
        await signIn('credentials', {
          id: formik.values.id,
          password: formik.values.password,
          redirect: true,
          redirectTo: '/appointments/new',
        }).catch((err) => {
          console.error(err);
          addToast({
            title: 'Error',
            description: err.message,
            color: 'danger',
          });
        });
      })
      .catch((err) => {
        console.error(err);
        addToast({
          title: 'Error',
          description: err.message,
          color: 'danger',
        });
      });
  };

  return <FormContext.Provider value={{ formik }}>{children}</FormContext.Provider>;
}

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};

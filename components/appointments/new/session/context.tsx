'use client';
import React, { createContext, useContext } from 'react';
import axios from 'axios';
import { subYears } from 'date-fns';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addToast } from '@heroui/react';

import registerUser from '@/functions/server-actions/auth/register';
import { verifyEmail } from '@/functions/server-actions/auth/verification';
import { AppointmentType } from '@/models/Appointment';
import { DoctorType } from '@/models/Doctor';
import { UserType } from '@/models/User';

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required('Enter your first name.')
    .min(3, 'Too short')
    .max(50, 'Too long'),
  age: Yup.number().max(120, 'Max age can be 120.'),
  id: Yup.string().required(
    'Enter a valid email / phone. OTP will be sent to this.'
  ),
});

interface AppointmentForm {
  patient: UserType;
  doctor: DoctorType;
  date: Date;
  additionalInfo: {
    notes?: string;
    type: 'online' | 'offline';
    symptoms?: string;
  };
  step: number;
  appointment: AppointmentType;
}

interface RegisterFormType {
  firstName: string;
  lastName: string;
  age: number;
  dob: { day: string; month: string; year: string };
  gender: 'male' | 'female' | 'other';
  id: string;
  otp: string;
  step: number;
}

interface FormContextType {
  formik: ReturnType<typeof useFormik<AppointmentForm>>;
  register: ReturnType<typeof useFormik<RegisterFormType>>;
  session: any;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) => {
  const formik = useFormik<AppointmentForm>({
    initialValues: {
      patient: {
        uid: session?.user?.uid,
        name: session?.user?.name,
        email: session?.user?.email,
        image: session?.user?.image,
      } as UserType,
      doctor: {} as DoctorType,
      appointment: {} as AppointmentType,
      date: new Date(),
      additionalInfo: {
        notes: '',
        type: 'online',
        symptoms: '',
      },
      step: 2,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      await axios
        .post('/api/v1/appointments', {
          date: values.date.toISOString(),
          patient: {
            uid: values.patient.uid,
            name: values.patient.name,
            phone: values.patient.phone,
            email: values.patient.email,
          },
          doctor: {
            uid: values.doctor.uid,
            name: values.doctor.name,
            email: values.doctor.email,
            sitting: values.doctor?.sitting,
          },
          additionalInfo: {
            notes: values.additionalInfo.notes,
            symptoms: values.additionalInfo.symptoms,
            type: values.additionalInfo.type,
          },
        })
        .then((res) => {
          values.appointment = res.data;
          values.step = 6;
        })
        .catch((error) => {
          addToast({
            title: 'Error',
            description: 'Failed to create appointment',
            color: 'danger',
          });
          console.error(error);
        });
    },
  });

  const register = useFormik<RegisterFormType>({
    initialValues: {
      firstName: '',
      lastName: '',
      age: 1,
      dob: { day: '', month: '', year: '' },
      gender: 'other',
      id: '',
      otp: '',
      step: 1,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (values.step === 1) {
        await handeVerification();
      }
    },
  });

  const handeVerification = async () => {
    if (register.values.id?.includes('@')) {
      await verifyEmail(register.values.id).then(async (res) => {
        if (res) {
          register.setFieldError('id', 'Email already exists');
          return;
        } else {
          register.setFieldError('id', '');
          await handleRegister();
        }
      });
    } else {
      register.setFieldError(
        'id',
        'Phone number not supported yet, use email instead.'
      );
      return;
    }
  };

  const handleRegister = async () => {
    const calculatedAge = subYears(new Date(), register.values.age);
    const day = calculatedAge.getDate().toString();
    const month = (calculatedAge.getMonth() + 1).toString();
    const year = calculatedAge.getFullYear().toString();

    const data = {
      ...register.values,
      name: register.values.firstName + ' ' + register.values.lastName,
      dob: {
        day: day.length === 1 ? '0' + day : day,
        month: month.length === 1 ? '0' + month : month,
        year,
      },
    };
    await registerUser(data)
      .then(async (user) => {
        addToast({
          title: 'Please choose date and time for appointment',
          color: 'success',
        });
        formik.setValues(
          {
            ...formik.values,
            patient: user,
            step: 2,
          },
          true
        );
      })
      .catch((err) => {
        console.log(err);
        addToast({
          title: 'Error',
          description: err.message,
          color: 'danger',
        });
      });
  };

  return (
    <FormContext.Provider value={{ formik, session, register }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};

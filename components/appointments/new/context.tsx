'use client';
import React, { createContext, useContext } from 'react';
import { useFormik } from 'formik';
import { UserType } from '@/models/User';
import { DoctorType } from '@/models/Doctor';
import { AppointmentType } from '@/models/Appointment';
import axios from 'axios';
import { toast } from 'sonner';

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

interface FormContextType {
  formik: ReturnType<typeof useFormik<AppointmentForm>>;
  session: any;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({
  children,
  session
}: {
  children: React.ReactNode;
  session: any;
}) => {
  const formik = useFormik<AppointmentForm>({
    initialValues: {
      patient: {} as UserType,
      doctor: {} as DoctorType,
      appointment: {} as AppointmentType,
      date: new Date(),
      additionalInfo: {
        notes: '',
        type: 'online',
        symptoms: ''
      },
      step: 1
    },
    onSubmit: async (values) => {
      await axios
        .post('/api/appointments', {
          date: values.date,
          patient: {
            uid: values.patient.uid,
            name: values.patient.name,
            phone: values.patient.phone,
            email: values.patient.email
          },
          doctor: {
            uid: values.doctor.uid,
            name: values.doctor.name,
            email: values.doctor.email,
            sitting: values.doctor?.sitting
          },
          additionalInfo: {
            notes: values.additionalInfo.notes,
            symptoms: values.additionalInfo.symptoms,
            type: values.additionalInfo.type
          }
        })
        .then((res) => {
          values.appointment = res.data;
          values.step = 6;
        })
        .catch((error) => {
          toast.error('Failed to create appointment');
          console.error(error);
        });
    }
  });

  console.log('Formik:', formik.values);

  return (
    <FormContext.Provider value={{ formik, session }}>
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

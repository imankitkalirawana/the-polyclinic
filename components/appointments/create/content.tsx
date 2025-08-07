'use client';

import { createContext, useContext } from 'react';
import { addToast, Button } from '@heroui/react';
import { format } from 'date-fns';
import { useFormik } from 'formik';

import DoctorSelection from './doctor';
import { useAppointmentDate } from './hooks';
import PatientSelection from './patient';

import { useCreateAppointment as useCreateAppointmentService } from '@/services/appointment';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { $FixMe } from '@/types';
import { CreateAppointmentType } from '@/types/appointment';

const contentMap: Record<number, React.ReactNode> = {
  0: <PatientSelection />,
  1: <DoctorSelection />,
};

export default function AppointmentContent() {
  const { currentStep } = useAppointmentDate();
  return contentMap[currentStep];
}

interface CreateAppointmentTypes {
  appointment: CreateAppointmentType;
  meta: {
    currentStep: number;
  };
}

interface CreateAppointmentContextType {
  appointment: ReturnType<typeof useFormik<CreateAppointmentTypes>>;
}

const CreateAppointmentContext = createContext<CreateAppointmentContextType | undefined>(undefined);

export function CreateAppointmentProvider({ children }: { children: React.ReactNode }) {
  const createAppointment = useCreateAppointmentService();

  const appointment = useFormik<CreateAppointmentType>({
    initialValues: {
      date: new Date(),
      type: 'consultation',
      additionalInfo: {
        notes: '',
        type: 'online',
        symptoms: '',
      },
    },
    onSubmit: async (values) => {
      try {
        await createAppointment.mutateAsync(values);
        addToast({
          title: 'Appointment created',
          description: `Your appointment is scheduled for ${format(new Date(values.date), 'PPp')}`,
          color: 'success',
          endContent: (
            <Button size="sm" variant="flat" color="primary" onPress={() => {}}>
              View
            </Button>
          ),
        });
        appointment.resetForm();
      } catch (error: $FixMe) {
        console.error(error);
        addToast({
          title: 'Failed to create appointment',
          description: `${error.message}`,
          color: 'danger',
        });
      }
    },
  });

  return (
    <CreateAppointmentContext.Provider value={{ appointment }}>
      {children}
    </CreateAppointmentContext.Provider>
  );
}

export const useCreateAppointment = () => {
  const context = useContext(CreateAppointmentContext);
  if (!context) {
    throw new Error('useCreateAppointment must be used within a CreateAppointmentProvider');
  }
  return context.appointment;
};

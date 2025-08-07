import { addToast, Button } from '@heroui/react';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import { create } from 'zustand';

import { useCreateAppointment as useCreateAppointmentService } from '@/services/appointment';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { $FixMe } from '@/types';
import { CreateAppointmentType } from '@/types/appointment';

export const useCreateAppointment = () => {
  const createAppointment = useCreateAppointmentService();

  const formik = useFormik<CreateAppointmentType>({
    initialValues: {
      date: new Date(),
      type: 'consultation',
      additionalInfo: {
        notes: '',
        type: 'online',
        symptoms: '',
      },
      previousAppointment: undefined,
      knowYourDoctor: false,
    },
    onSubmit: async (values, { resetForm }) => {
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
        resetForm();
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

  console.log(formik.values);

  return {
    formik,
  };
};

type DateType = Date | null;

interface AppointmentStore {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  selectedDate: DateType;
  setSelectedDate: (date: DateType) => void;
}

export const useAppointmentDate = create<AppointmentStore>((set) => ({
  currentStep: 0,
  setCurrentStep: (step: number) => set({ currentStep: step }),
  selectedDate: null,
  setSelectedDate: (date: DateType) => set({ selectedDate: date }),
}));

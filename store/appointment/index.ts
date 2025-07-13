import { create } from 'zustand';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AppointmentType, ActionType } from '@/types/appointment';
import { Selection } from '@heroui/react';

interface AppointmentStoreState {
  selected: AppointmentType | null;
  action: ActionType | null;
  keys: Selection | undefined;
  setSelected: (selected: AppointmentType | null) => void;
  setAction: (action: ActionType | null) => void;
  setKeys: (keys: Selection) => void;
  resetState: () => void;
}

// Zustand store for appointment state
export const useAppointmentStore = create<AppointmentStoreState>((set) => ({
  selected: null,
  action: null,
  keys: undefined,
  setSelected: (selected) => set({ selected }),
  setAction: (action) => set({ action }),
  setKeys: (keys) => set({ keys }),
  resetState: () => set({ selected: null, action: null, keys: undefined }),
}));

// Custom hook to handle appointment form logic with formik
export const useAppointmentForm = () => {
  const { selected, action, setSelected, setAction, resetState } =
    useAppointmentStore();

  const formik = useFormik({
    initialValues: {
      selected,
      action,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      selected: Yup.object()
        .shape({
          title: Yup.string().required('Title is required'),
          date: Yup.date().required('Date is required'),
        })
        .nullable(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (values.action === 'reschedule' && values.selected) {
          // await rescheduleAppointment(values.selected);
          console.log('Rescheduling appointment:', values.selected);
        }
        resetState();
      } catch (error) {
        console.error('Submission failed:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return { formik, setSelected, setAction, resetState };
};

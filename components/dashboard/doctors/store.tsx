import { Selection } from '@heroui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { create } from 'zustand';

import { ActionType } from './types';
import { DoctorType } from '@/services/client/doctor';

interface DoctorStoreState {
  selected: DoctorType | null;
  action: ActionType | null;
  keys: Selection | undefined;
  setSelected: (selected: DoctorType | null) => void;
  setAction: (action: ActionType | null) => void;
  setKeys: (keys: Selection) => void;
  resetState: () => void;
}
export const useDoctorStore = create<DoctorStoreState>((set) => ({
  selected: null,
  action: null,
  keys: undefined,
  setSelected: (selected) => set({ selected }),
  setAction: (action) => set({ action }),
  setKeys: (keys) => set({ keys }),
  resetState: () => set({ selected: null, action: null, keys: undefined }),
}));

export const useDoctorForm = () => {
  const { selected, action, setSelected, setAction, resetState } = useDoctorStore();

  const formik = useFormik({
    initialValues: {
      selected,
      action,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      selected: Yup.object()
        .shape({
          name: Yup.string().required('Name is required'),
          email: Yup.string().email('Invalid email').required('Email is required'),
          phone: Yup.string().required('Phone is required'),
          designation: Yup.string().required('Designation is required'),
          image: Yup.string().required('Image is required'),
        })
        .nullable(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
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

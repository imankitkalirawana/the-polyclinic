import { Selection } from '@heroui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { create } from 'zustand';

import { ActionType } from './types';

import { EmailType } from '@/services/client/email/email.types';

interface EmailStoreState {
  selected: EmailType | null;
  action: ActionType | null;
  keys: Selection | undefined;
  setSelected: (selected: EmailType | null) => void;
  setAction: (action: ActionType | null) => void;
  setKeys: (keys: Selection) => void;
  resetState: () => void;
}
export const useEmailStore = create<EmailStoreState>((set) => ({
  selected: null,
  action: null,
  keys: undefined,
  setSelected: (selected) => set({ selected }),
  setAction: (action) => set({ action }),
  setKeys: (keys) => set({ keys }),
  resetState: () => set({ selected: null, action: null, keys: undefined }),
}));
export const useEmailForm = () => {
  const { selected, action, setSelected, setAction, resetState } = useEmailStore();

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

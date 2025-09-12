import { create } from 'zustand';
import { QueryClient, useQuery, UseQueryResult } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { EmailType } from '@/models/Email';
import { getAllEmails } from '@/app/dashboard/emails/helper';
import { Selection } from '@heroui/react';
import { ActionType } from './types';

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
  const { selected, action, setSelected, setAction, resetState } =
    useEmailStore();

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

export const useEmailData = (): UseQueryResult<Array<EmailType>> => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => getAllEmails(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

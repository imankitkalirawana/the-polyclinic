import { create } from 'zustand';
import { QueryClient, useQuery, UseQueryResult } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { DrugType } from '@/models/Drug';
import { getAllDrugs } from '@/app/dashboard/drugs/helper';
import { Selection } from '@heroui/react';
import { ActionType } from './types';

interface DrugStoreState {
  selected: DrugType | null;
  action: ActionType | null;
  keys: Selection | undefined;
  setSelected: (selected: DrugType | null) => void;
  setAction: (action: ActionType | null) => void;
  setKeys: (keys: Selection) => void;
  resetState: () => void;
}
export const useDrugStore = create<DrugStoreState>((set) => ({
  selected: null,
  action: null,
  keys: undefined,
  setSelected: (selected) => set({ selected }),
  setAction: (action) => set({ action }),
  setKeys: (keys) => set({ keys }),
  resetState: () => set({ selected: null, action: null, keys: undefined }),
}));
export const useDrugForm = () => {
  const { selected, action, setSelected, setAction, resetState } =
    useDrugStore();

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

export const useDrugData = (): UseQueryResult<Array<DrugType>> => {
  return useQuery({
    queryKey: ['Drugs'],
    queryFn: () => getAllDrugs(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

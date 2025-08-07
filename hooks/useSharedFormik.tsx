import React, { createContext, useContext } from 'react';
import { FormikConfig, FormikContextType, FormikValues, useFormik } from 'formik';

import { $FixMe } from '@/types';

const FormikContext = createContext<FormikContextType<$FixMe> | null>(null);

export function FormikProvider<T extends FormikValues>({
  children,
  formikConfig,
}: {
  children: React.ReactNode;
  formikConfig: FormikConfig<T>;
}) {
  const formik = useFormik<T>(formikConfig);
  return <FormikContext.Provider value={formik}>{children}</FormikContext.Provider>;
}

export function useSharedFormik<T extends FormikValues>() {
  const ctx = useContext(FormikContext);
  if (!ctx) throw new Error('useSharedFormik must be used within FormikProvider');
  return ctx as FormikContextType<T>;
}

'use client';

import { FormikConfig } from 'formik';

import { FormikProvider, useSharedFormik } from '@/hooks/useSharedFormik';

type FormikValues = {
  name: string;
};
export default async function TestPage() {
  const formikConfig: FormikConfig<FormikValues> = {
    initialValues: {
      name: 'Ankit',
    },
    onSubmit: () => {},
  };

  return (
    <FormikProvider<FormikValues> formikConfig={formikConfig}>
      <Test />
    </FormikProvider>
  );
}

const Test = () => {
  const formik = useSharedFormik<FormikValues>();
  return <div>Test {JSON.stringify(formik.values.name)}</div>;
};

import React from 'react';
import DatePicker from './date-picker';
import AppointmentsTimeline from './appointments';
import { FormProvider } from './context';
import { auth } from '@/auth';

export default async function CompactView() {
  const session = await auth();

  return (
    <>
      <FormProvider session={session as any}>
        <DatePicker />
        <AppointmentsTimeline />
      </FormProvider>
    </>
  );
}

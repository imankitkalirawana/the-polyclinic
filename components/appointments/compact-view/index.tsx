import React from 'react';

import AsideRight from './aside/right';
import AppointmentsTimeline from './appointments';
import { FormProvider } from './context';
import DatePicker from './date-picker';

import { auth } from '@/auth';

export default async function CompactView() {
  const session = await auth();

  return (
    <>
      <FormProvider session={session as any}>
        <div className="flex w-full justify-center">
          <div className="h-[90vh] w-96 bg-red-200"></div>
          <div className="flex flex-col">
            <DatePicker />
            <AppointmentsTimeline />
          </div>
          <AsideRight />
        </div>
      </FormProvider>
    </>
  );
}

import React from 'react';
import DatePicker from './date-picker';
import AppointmentsTimeline from './appointments';
import { FormProvider } from './context';

export default function CompactView() {
  return (
    <>
      <FormProvider>
        <DatePicker />
        <AppointmentsTimeline />
      </FormProvider>
    </>
  );
}

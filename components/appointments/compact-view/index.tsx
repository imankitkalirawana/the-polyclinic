'use client';
import axios from 'axios';
import React from 'react';
import DatePicker from './date-picker';
import AppointmentsTimeline from './appointments';
import { FormProvider } from './context';

export default function CompactView({ session }: { session: any }) {
  // const { data } = useQuery<AppointmentType[]>({
  //   queryKey: ['appointments'],
  //   queryFn: async () => {
  //     const response = await axios.get('/api/v1/appointments');
  //     return response.data;
  //   }
  // });

  // const appointments = data || [];

  return (
    <>
      <FormProvider>
        <DatePicker />
        <AppointmentsTimeline />
      </FormProvider>
    </>
  );
}

'use client';
import { Calendar } from '@/components/ui/calendar';
import { getAllAppointments } from '@/app/appointments/helper';
import { AppointmentType } from '@/types/appointment';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function Appointments() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => getAllAppointments(),
  });

  const appointments: AppointmentType[] = data || [];

  return (
    <Calendar
      appointments={appointments}
      currentDate={currentDate}
      onDateChange={setCurrentDate}
    />
  );
}

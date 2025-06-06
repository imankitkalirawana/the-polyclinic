'use client';
import { Calendar } from '@/components/ui/calendar';
import { getAllAppointments } from '@/app/appointments/helper';
import { AppointmentType } from '@/models/Appointment';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function Appointments() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => getAllAppointments(),
  });

  const appointments: AppointmentType[] = data || [];

  const handleCreateAppointment = (date: Date, time?: string) => {
    console.log(date, time);
  };

  return (
    <div>
      <Calendar
        appointments={appointments}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onCreateAppointment={handleCreateAppointment}
      />
    </div>
  );
}

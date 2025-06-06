'use client';
import { Calendar } from '@/components/ui/calendar';
import { getAllAppointments } from './appointments/helper';
import { AppointmentType } from '@/models/Appointment';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<
    'month' | 'week' | 'day' | 'schedule' | 'year'
  >('schedule');

  const { data, isError } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const res = await axios.get(`/api/v1/appointments`);
      return res.data;
    },
  });

  const appointments: AppointmentType[] = data || [];

  const handleCreateAppointment = (date: Date, time?: string) => {
    const newAppointment = {
      _id: `new-${Date.now()}`,
      aid: Date.now(),
      date: time ? new Date(`${date.toDateString()} ${time}`) : date,
      patient: {
        uid: 0,
        name: 'New Patient',
        email: 'patient@example.com',
      },
      doctor: {
        uid: 1000,
        name: 'Dr. Smith',
        email: 'doctor@example.com',
      },
      status: 'booked',
      type: 'consultation',
      additionalInfo: {
        type: 'online',
        notes: '',
        symptoms: '',
      },
      previousAppointments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    };
  };

  return (
    <div>
      <Calendar
        appointments={appointments}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        view={view}
        onViewChange={setView}
        onCreateAppointment={handleCreateAppointment}
      />
    </div>
  );
}

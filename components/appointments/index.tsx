'use client';
import { Appointment } from '@/lib/interface';
import { useEffect, useState } from 'react';
import AppointmentCard from './appointment-card';
import HoverDevCards from './hover-cards';
import axios from 'axios';

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      await axios.get('/api/appointments').then((res) => {
        setAppointments(res.data);
      });
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4">
        <HoverDevCards />
        <div className="grid grid-cols-4 gap-4">
          {appointments.map((appointment) => (
            <AppointmentCard appointment={appointment} />
          ))}
        </div>
      </div>
    </>
  );
}

'use client';
import { Appointment } from '@/lib/interface';
import { useEffect, useState } from 'react';
import HoverDevCards from '../hover-cards';
import axios from 'axios';
import Skeleton from '../../ui/skeleton';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import Heading from '../../ui/heading';
import AppointmentCard from '../appointment-card';

export default function DoctorAppointments({ session }: any) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get('/api/appointments/doctor/self')
        .then((res) => {
          setAppointments(res.data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    fetchData();
  }, []);

  return (
    <>
      <Heading
        title="Appointments"
        subtitle={
          <>
            Welcome back,{' '}
            <span className="font-medium text-foreground">
              {session?.user?.name}
            </span>
          </>
        }
      />
      <HoverDevCards />
      <div className="grid-cols-auto-fill mt-12 grid grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <LoadingSkeleton key={i} />)
          : appointments
              .sort((a, b) => {
                const statusOrder = [
                  'in-progress',
                  'confirmed',
                  'booked',
                  'completed',
                  'overdue',
                  'cancelled'
                ];
                return (
                  statusOrder.indexOf(a.status) -
                    statusOrder.indexOf(b.status) ||
                  new Date(a.date).getTime() - new Date(b.date).getTime()
                );
              })
              .map((appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  session={session}
                />
              ))}
      </div>
    </>
  );
}

const LoadingSkeleton = () => {
  return (
    <>
      <Card className="min-w-72 rounded-3xl p-4">
        <CardHeader className="items-center justify-between p-0">
          <Skeleton className="flex h-8 w-32" />
          <Skeleton className="flex h-4 w-16" />
        </CardHeader>
        <CardBody className="mt-6 space-y-2 p-0">
          <Skeleton className="flex h-4 w-24" />
          <Skeleton className="flex h-4 w-full" />
          <Skeleton className="flex h-4 w-32" />
          <Skeleton className="flex h-4 w-24" />
        </CardBody>
      </Card>
    </>
  );
};

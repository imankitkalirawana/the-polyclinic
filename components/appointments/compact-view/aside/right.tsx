'use client';
import { Card, CardBody, CardFooter } from '@heroui/react';
import Calendar from './calendar';
import { Subtitle, Title } from '../appointment-details-modal';
import { AppointmentType } from '@/models/Appointment';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PendingAppointments from './pending-appointments';

export default function AsideRight() {
  const { data } = useQuery<AppointmentType[]>({
    queryKey: ['appointments'],
    queryFn: async () => {
      const response = await axios.get(`/api/v1/appointments`);
      return response.data;
    }
  });

  const appointments = data || [];

  return (
    <>
      <div className="h-full w-fit px-4">
        <Card className="mt-4 w-full border border-divider bg-default-50 shadow-none">
          <CardBody className="flex flex-col gap-4 p-0">
            <Calendar appointments={appointments} />
            {appointments.filter(
              (appointment) => appointment.status === 'booked'
            ).length > 1 && (
              <>
                <div className="h-[1px] w-full bg-gradient-to-r from-divider/20 via-divider to-divider/20"></div>
                <PendingAppointments
                  appointments={appointments
                    .filter((appointment) => appointment.status === 'booked')
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )}
                />
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}

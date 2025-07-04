'use client';
import { Card, CardBody } from '@heroui/react';

import Calendar from './calendar';
import PendingAppointments from './pending-appointments';

import { useAllAppointments } from '@/services/appointment';
import { castData } from '@/lib/utils';
import { AppointmentType } from '@/types/appointment';

export default function AsideRight() {
  const { data } = useAllAppointments();

  const appointments = castData<AppointmentType[]>(data);

  return (
    <>
      <div className="h-full w-fit px-4">
        <Card className="mt-4 w-full border-small border-divider bg-default-50 shadow-none">
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

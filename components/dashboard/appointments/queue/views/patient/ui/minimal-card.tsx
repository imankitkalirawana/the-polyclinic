'use client';

import { Card, CardBody, Chip, cn } from '@heroui/react';
import { formatDate } from 'date-fns';
import { AppointmentQueueResponse } from '@/services/client/appointment/queue/queue.types';
import Avatar from 'boring-avatars';

export default function MinimalCard({ appointment }: { appointment: AppointmentQueueResponse }) {
  return (
    <Card className={cn('transition-a w-full rounded-large')} shadow="md">
      <CardBody className="gap-0 p-4">
        <div>
          <div className="flex items-center justify-between pt-1">
            <p className="line-clamp-1 text-default-700 text-large">
              {formatDate(new Date(appointment.appointmentDate), 'EEEE, PP')}
            </p>
            <Chip color="primary" variant="flat" size="sm">
              {appointment.status}
            </Chip>
          </div>
          <div className="flex items-center justify-between gap-6 pt-2">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 flex-shrink-0" name={appointment.doctor.name} />
              <div className="flex gap-2 divide-x divide-divider">
                <div className="flex flex-col pr-2">
                  <h3 className="font-medium text-large">{appointment.doctor.name}</h3>
                  <p className="text-default-500">{appointment.doctor.specialization}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

'use client';

import { AppointmentQueueResponse } from '@/services/client/appointment/queue/queue.types';
import { Card, CardBody, Chip, Button, cn } from '@heroui/react';
import { Icon } from '@iconify/react';
import { formatDate } from 'date-fns';
import Avatar from 'boring-avatars';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { renderChip } from '@/components/ui/static-data-table/cell-renderers';

export default function AppointmentCard({
  appointment,
}: {
  appointment: AppointmentQueueResponse;
}) {
  const [isHidden] = useLocalStorage('isDashboardSidebarHidden', true);
  return (
    <Card
      className={cn(
        'w-full rounded-large transition-all',
        isHidden ? 'min-w-[65%]' : 'min-w-[60%]'
      )}
      shadow="md"
    >
      <CardBody className="gap-0 p-4">
        <div className="flex items-start justify-between gap-6 pb-6">
          <div className="flex items-start gap-5">
            <div className="flex w-20 flex-col overflow-hidden rounded-medium border border-primary">
              <div className="flex aspect-video items-center justify-center bg-primary text-primary-foreground">
                {formatDate(new Date(appointment.appointmentDate), 'd')}
              </div>
              <div className="flex aspect-video items-center justify-center bg-primary-50 uppercase">
                {formatDate(new Date(appointment.appointmentDate), 'MMM')}
              </div>
            </div>
            <div className="flex flex-col pt-1">
              <p className="text-xl text-default-700">
                {formatDate(new Date(appointment.appointmentDate), 'EEEE, PP | p')}
              </p>
              <h2 className="text-2xl font-medium text-gray-900">{appointment.patient.name}</h2>
              <p className="text-default-500">{appointment.patient.phone}</p>
            </div>
          </div>
          <div>{renderChip({ item: appointment.status })}</div>
        </div>
        <div className="border-t border-gray-200" />
        <div className="flex items-center justify-between gap-6 pt-6">
          <div className="flex items-center gap-4">
            <Avatar
              variant="beam"
              className="h-16 w-16 flex-shrink-0"
              name={appointment.doctor.name}
            />
            <div className="flex gap-2 divide-x divide-divider">
              <div className="flex flex-col pr-2">
                <h3 className="text-xl font-medium">{appointment.doctor.name}</h3>
                <p className="text-default-500">{appointment.doctor.specialization}</p>
              </div>
              <div className="flex flex-col gap-1.5 pl-4 pt-1">
                <div className="flex items-center gap-3 text-sm">
                  <Icon icon="mdi:phone" className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span>{appointment.doctor.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Icon icon="mdi:email" className="h-5 w-5 text-primary" />
                  <span>{appointment.doctor.email}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-shrink-0 items-center gap-5">
            <Chip variant="flat">Room {appointment.doctor.seating}</Chip>
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <Button color="primary">View Details</Button>
        </div>
      </CardBody>
    </Card>
  );
}

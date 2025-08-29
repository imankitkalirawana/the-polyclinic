'use client';

import { useState } from 'react';
import { addToast, Button, Card, CardBody, CardFooter, Chip, ScrollShadow } from '@heroui/react';
import { format } from 'date-fns';
import { Icon } from '@iconify/react/dist/iconify.js';

import { Subtitle } from '../appointment-details-modal';
import { useForm } from '../context';

import { AppointmentType } from '@/services/client/appointment';

export default function PendingAppointments({ appointments }: { appointments: AppointmentType[] }) {
  const { refetch } = useForm();

  const [isLoading, setIsLoading] = useState({
    confirm: false,
    cancel: false,
  });

  const handleSubmit = async (aid: number, status: 'confirmed' | 'cancelled') => {
    // await axios
    //   .post(`/api/v1/appointments/${aid}/status`, { status })
    //   .then(() => {
    //     toast.success('Appointment status updated successfully');
    //     refetch();
    //   });
    // dummy 3 seconds delay
    setIsLoading({ ...isLoading, [status]: true });
    await new Promise((resolve) => setTimeout(resolve, 3000)).then(() => {
      addToast({
        title: 'Appointment status updated successfully',
        description: 'The appointment status has been updated',
        color: 'success',
      });
      refetch();
    });
    setIsLoading({ ...isLoading, [status]: false });
  };

  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      <Subtitle title="Pending Appointments" />
      <ScrollShadow className="flex max-h-[25vh] flex-col gap-4 py-4 pb-8 scrollbar-hide">
        {appointments.map((appointment) => (
          <Card
            key={appointment.aid}
            className="min-h-[106px] w-full rounded-medium border-small border-divider bg-default-100 shadow-none"
          >
            <CardBody className="flex flex-row items-start justify-between gap-4 pb-0 text-small">
              <div className="flex flex-col">
                <span className="line-clamp-1 font-semibold capitalize text-default-900">
                  {appointment.patient.name}
                </span>
                <span className="text-tiny text-default-500">
                  {format(new Date(appointment.date), 'PPp')}
                </span>
              </div>
              <Chip size="sm">#{appointment.aid}</Chip>
            </CardBody>
            <CardFooter className="justify-end gap-1">
              <Button
                size="sm"
                variant="flat"
                color="danger"
                isIconOnly
                onPress={() => handleSubmit(appointment.aid, 'cancelled')}
                isLoading={isLoading.cancel}
              >
                <Icon icon="tabler:x" width={16} />
              </Button>
              <Button size="sm" variant="solid" color="primary" isIconOnly>
                <Icon icon="tabler:check" width={16} />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </ScrollShadow>
    </div>
  );
}

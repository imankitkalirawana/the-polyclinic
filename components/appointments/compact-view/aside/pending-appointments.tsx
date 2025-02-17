'use client';
import { AppointmentType } from '@/models/Appointment';
import { Subtitle } from '../appointment-details-modal';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  cn,
  ScrollShadow
} from '@heroui/react';
import { format } from 'date-fns';
import { getAppointmentStyles } from '../appointments';
import { motion, useAnimation } from 'framer-motion';
import { Icon } from '@iconify/react/dist/iconify.js';

export default function PendingAppointments({
  appointments
}: {
  appointments: AppointmentType[];
}) {
  return (
    <>
      <div className="flex flex-col gap-4 px-4 pb-4">
        <Subtitle title="Pending Appointments" />
        <ScrollShadow className="flex max-h-[25vh] flex-col gap-4 py-4 pb-8 scrollbar-hide">
          {appointments.map((appointment) => {
            return (
              <Card
                key={appointment.aid}
                className="min-h-[106px] w-full rounded-medium border border-divider bg-default-100 shadow-none"
              >
                <CardBody className="flex flex-row items-start justify-between gap-4 pb-0 text-sm">
                  <div className="flex flex-col">
                    <span className="line-clamp-1 font-semibold capitalize text-default-900">
                      {appointment.patient.name}
                    </span>
                    <span className="text-xs text-default-500">
                      {format(new Date(appointment.date), 'PPp')}
                    </span>
                  </div>
                  <Chip size="sm">#{appointment.aid}</Chip>
                </CardBody>
                <CardFooter className="justify-end gap-1">
                  <Button
                    size="sm"
                    variant="bordered"
                    color="danger"
                    isIconOnly
                  >
                    <Icon icon="tabler:x" width={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="bordered"
                    color="success"
                    isIconOnly
                  >
                    <Icon icon="tabler:check" width={16} />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </ScrollShadow>
      </div>
    </>
  );
}

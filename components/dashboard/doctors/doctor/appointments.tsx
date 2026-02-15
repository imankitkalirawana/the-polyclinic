'use client';

import { useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, cn } from '@heroui/react';
import { format } from 'date-fns';
import { Icon } from '@iconify/react/dist/iconify.js';

import { renderChip } from '@/components/ui/static-data-table/cell-renderers';
import Skeleton from '@/components/ui/skeleton';
import { castData } from '@/libs/utils';
import { useAllAppointments } from '@/services/client/appointment/appointment.query';
import { APPOINTMENT_TYPES, AppointmentType } from '@/services/client/appointment';

const APPOINTMENTS_PER_PAGE = 6;

export default function Appointments() {
  const { data: appointmentsData, isLoading: isAppointmentsLoading } = useAllAppointments();

  const appointments = castData<AppointmentType[]>(appointmentsData) || [];

  const [page, setPage] = useState(1);
  return (
    <Card className="col-span-full row-span-2">
      <CardHeader className="justify-between">
        <h3 className="text-lg font-medium">Today&apos;s Schedules</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-default-500 text-tiny">
            <span className="h-2 w-2 rounded-full bg-default" />
            <span>Consultation</span>
          </div>
          <div className="flex items-center gap-1 text-default-500 text-tiny">
            <span className="h-2 w-2 rounded-full bg-blue-300" />
            <span>Follow-up</span>
          </div>
          <div className="flex items-center gap-1 text-default-500 text-tiny">
            <span className="h-2 w-2 rounded-full bg-danger-300" />
            <span>Emergency</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p>
            {APPOINTMENTS_PER_PAGE > appointments.length
              ? appointments.length
              : APPOINTMENTS_PER_PAGE}
            <span className="text-default-500 text-tiny">/{appointments.length}</span>
          </p>
          <ButtonGroup isIconOnly size="sm" variant="flat">
            <Button isDisabled={page === 1} onPress={() => setPage(page - 1)}>
              <Icon icon="solar:alt-arrow-left-line-duotone" width={18} />
            </Button>
            <Button
              isDisabled={page === Math.ceil(appointments.length / APPOINTMENTS_PER_PAGE)}
              onPress={() => setPage(page + 1)}
            >
              <Icon icon="solar:alt-arrow-right-line-duotone" width={18} />
            </Button>
          </ButtonGroup>
        </div>
      </CardHeader>
      {isAppointmentsLoading ? (
        <AppointmentSkeleton />
      ) : appointments.length > 0 ? (
        <CardBody className="grid grid-cols-3 grid-rows-2 gap-2">
          {appointments
            ?.slice((page - 1) * APPOINTMENTS_PER_PAGE, page * APPOINTMENTS_PER_PAGE)
            .map((appointment) => (
              <Card
                isPressable
                key={appointment.aid}
                className={cn('flex flex-col gap-2 p-4', {
                  'border border-danger-100 bg-danger-50':
                    appointment.type === APPOINTMENT_TYPES.emergency.value,
                  'border border-blue-100 bg-blue-50':
                    appointment.type === APPOINTMENT_TYPES.follow_up.value,
                })}
              >
                <CardHeader className="justify-between p-0">
                  <p className="whitespace-nowrap font-medium">
                    {format(appointment.date, 'hh:mm a')}
                  </p>
                  {renderChip({
                    item: appointment.status,
                    size: 'sm',
                  })}
                </CardHeader>
                <CardBody className="overflow-hidden p-0">
                  <p className="capitalize">{appointment.additionalInfo.type}</p>
                </CardBody>
                <CardFooter className="overflow-visible p-0">
                  <p className="text-default-500 text-tiny">{appointment.patient.name}</p>
                </CardFooter>
              </Card>
            ))}
        </CardBody>
      ) : (
        <CardBody className="flex items-center justify-center">
          <p className="text-default-500 text-small">No appointments today</p>
        </CardBody>
      )}
    </Card>
  );
}

function AppointmentSkeleton() {
  return (
    <CardBody className="grid grid-cols-3 grid-rows-2 gap-2">
      {Array.from({ length: APPOINTMENTS_PER_PAGE }).map((_, index) => (
        <Card key={index} className="flex flex-col gap-2 p-4">
          <CardHeader className="justify-between gap-4 p-0">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-16" />
          </CardHeader>
          <CardBody className="overflow-hidden p-0">
            <Skeleton className="h-4 w-full" />
          </CardBody>
          <CardFooter className="overflow-visible p-0">
            <Skeleton className="h-4 w-full" />
          </CardFooter>
        </Card>
      ))}
    </CardBody>
  );
}

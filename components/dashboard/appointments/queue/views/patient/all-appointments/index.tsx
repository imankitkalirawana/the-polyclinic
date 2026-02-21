'use client';
import { Button } from '@heroui/react';
import AppointmentCard from '../ui/appointment-card';
import MinimalCard from '../ui/minimal-card';
import { useGroupedAppointmentQueuesForPatient } from '@/services/client/appointment/queue/queue.query';
import { Icon } from '@iconify/react/dist/iconify.js';
import Link from 'next/link';

export default function AllAppointments() {
  const { data: appointments } = useGroupedAppointmentQueuesForPatient();

  const { previous = [], current, next = [] } = appointments ?? {};

  return (
    <div>
      <div className="flex gap-4">
        {current && <AppointmentCard appointment={current} />}

        <div className="flex w-full flex-col gap-2 transition-all">
          {next?.length > 0 && (
            <div className="flex items-center justify-between">
              <h1>All Upcoming Appointments</h1>
              <Button
                isIconOnly
                variant="flat"
                size="sm"
                as={Link}
                href="/dashboard/queues?status=upcoming"
              >
                <Icon icon="mdi:chevron-left" className="h-5 w-5" />
              </Button>
            </div>
          )}
          {next
            ?.slice(0, 2)
            .map((appointment) => <MinimalCard key={appointment.id} appointment={appointment} />)}
        </div>
      </div>
      {/* /*previous appointments 3 at the row*/}
      <div className="flex flex-col gap-4 pt-4">
        {previous?.length > 0 && (
          <div className="flex max-w-md items-center justify-between">
            <h1>Previous Appointments</h1>
            <Button
              isIconOnly
              variant="flat"
              size="sm"
              as={Link}
              href="/dashboard/queues?status=previous"
            >
              <Icon icon="mdi:chevron-right" className="h-5 w-5" />
            </Button>
          </div>
        )}
        <div className="grid grid-cols-3 gap-4">
          {previous
            ?.slice(0, 3)
            .map((appointment) => <MinimalCard key={appointment.id} appointment={appointment} />)}
        </div>
      </div>
    </div>
  );
}

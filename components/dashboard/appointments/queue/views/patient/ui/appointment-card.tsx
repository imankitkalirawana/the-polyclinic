'use client';

import { AppointmentQueueType } from '@/services/client/appointment/queue/queue.types';
import {
  Card,
  CardBody,
  Chip,
  Button,
  cn,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { formatDate } from 'date-fns';
import Avatar from 'boring-avatars';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { renderChip } from '@/components/ui/static-data-table/cell-renderers';
import { useRouter } from 'nextjs-toploader/app';

export default function AppointmentCard({ appointment }: { appointment: AppointmentQueueType }) {
  const [isHidden] = useLocalStorage('isDashboardSidebarHidden', true);
  const router = useRouter();
  return (
    <Card
      className={cn(
        'rounded-large w-full transition-all',
        isHidden ? 'min-w-[65%]' : 'min-w-[60%]'
      )}
      shadow="md"
    >
      <CardBody className="gap-0 p-4">
        <div className="flex items-start justify-between gap-6 pb-6">
          <div className="flex items-start gap-5">
            <div className="rounded-medium border-primary flex w-20 flex-col overflow-hidden border">
              <div className="bg-primary text-primary-foreground flex aspect-video items-center justify-center">
                {formatDate(new Date(appointment.appointmentDate), 'd')}
              </div>
              <div className="bg-primary-50 flex aspect-video items-center justify-center uppercase">
                {formatDate(new Date(appointment.appointmentDate), 'MMM')}
              </div>
            </div>
            <div className="flex flex-col pt-1">
              <p className="text-default-700 flex gap-5 text-xl">
                {formatDate(new Date(appointment.appointmentDate), 'EEEE, PP | p')}
                <span className="ml-2">{renderChip({ item: appointment.status })}</span>
              </p>

              <h2 className="text-2xl font-medium text-gray-900">{appointment.patient.name}</h2>
              <p className="text-default-500">{appointment.patient.phone}</p>
            </div>
          </div>
          <div>
            <Dropdown aria-label="Patient actions" placement="bottom-end">
              <DropdownTrigger>
                <Button size="sm" isIconOnly variant="flat" radius="full">
                  <Icon icon="solar:menu-dots-bold-duotone" className="rotate-90" width={18} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="view">View</DropdownItem>

                <DropdownItem color="warning" key="edit">
                  Edit
                </DropdownItem>
                <DropdownItem key="delete" className="text-danger" color="danger">
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="border-t border-gray-200" />
        <div className="flex items-center justify-between gap-6 pt-6">
          <div className="flex items-center gap-4">
            <Avatar variant="beam" className="h-16 w-16 shrink-0" name={appointment.doctor.name} />
            <div className="divide-divider flex gap-2 divide-x">
              <div className="flex flex-col pr-2">
                <h3 className="text-xl font-medium">{appointment.doctor.name}</h3>
                <p className="text-default-500">{appointment.doctor.specialization}</p>
              </div>
              <div className="flex flex-col gap-1.5 pt-1 pl-4">
                <div className="flex items-center gap-3 text-sm">
                  <Icon icon="mdi:phone" className="text-primary h-5 w-5 shrink-0" />
                  <span>{appointment.doctor.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Icon icon="mdi:email" className="text-primary h-5 w-5" />
                  <span>{appointment.doctor.email}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-5">
            <Chip variant="flat">Room {appointment.doctor.seating}</Chip>
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <Button
            color="primary"
            onPress={() => router.push(`/dashboard/queues/${appointment.aid}`)}
          >
            View Details
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

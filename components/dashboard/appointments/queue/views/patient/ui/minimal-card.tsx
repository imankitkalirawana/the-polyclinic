'use client';

import {
  Card,
  CardBody,
  CardHeader,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  cn,
  Button,
  DropdownItem,
} from '@heroui/react';
import { formatDate } from 'date-fns';
import { AppointmentQueueResponse } from '@/services/client/appointment/queue/queue.types';
import Avatar from 'boring-avatars';
import { renderChip } from '@/components/ui/static-data-table/cell-renderers';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useRouter } from 'nextjs-toploader/app';

export default function MinimalCard({ appointment }: { appointment: AppointmentQueueResponse }) {
  const router = useRouter();
  return (
    <Card
      isPressable
      onPress={() => router.push(`/dashboard/queues/${appointment.aid}`)}
      className={cn('transition-a w-full rounded-large')}
      shadow="md"
    >
      <CardBody className="gap-0 p-4">
        <div>
          <CardHeader className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <p className="line-clamp-1 text-default-700 text-large">
                {formatDate(new Date(appointment.appointmentDate), 'EEEE, PP')}
              </p>
              <div>{renderChip({ item: appointment.status })}</div>
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
          </CardHeader>
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

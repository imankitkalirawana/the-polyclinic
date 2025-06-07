import React from 'react';
import {
  Card,
  CardBody,
  Button,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Link,
  Divider,
  CardHeader,
  Tooltip,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { AppointmentType } from '@/models/Appointment';
import StatusDot from './status-dot';
import { formatTime } from '../helper';
import { format } from 'date-fns';

export default function MeetingEventCard({
  appointment,
}: {
  appointment: AppointmentType;
}) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="w-[512px] shadow-none">
      <CardHeader className="flex flex-row items-center justify-end gap-1">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          radius="full"
          onPress={() => {
            console.log('edit');
          }}
        >
          <Icon icon="solar:pen-line-duotone" width={18} />
        </Button>
        <Tooltip content="Delete Appointment">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            radius="full"
            onPress={() => {
              console.log('delete');
            }}
          >
            <Icon icon="solar:trash-bin-2-line-duotone" width={18} />
          </Button>
        </Tooltip>

        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light" radius="full">
              <Icon
                icon="solar:menu-dots-bold"
                className="rotate-90"
                width={18}
              />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key="duplicate">Duplicate</DropdownItem>
            <DropdownItem key="share">Share</DropdownItem>
            <DropdownItem key="export">Export</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </CardHeader>
      <CardBody>
        <div className="flex items-start gap-2">
          <div className="mt-2 flex">
            <StatusDot status={appointment.status} />
          </div>
          <div>
            <h2 className="text-lg font-medium">
              {appointment.patient.name}{' '}
              {appointment.doctor?.name ? `/ ${appointment.doctor.name}` : ''}
            </h2>
            <div className="text-sm text-default-600">
              {format(new Date(appointment.date), 'EEEE, MMMM d ⋅ hh:mm a')}
            </div>
          </div>
        </div>
        <div className="mt-4">
          {appointment.additionalInfo.type === 'offline' ? (
            <div className="flex items-start gap-4">
              <Icon icon="logos:google-meet" className="mt-2" width={20} />
              <div className="flex w-full flex-col">
                <div className="flex items-center justify-between">
                  <Button
                    color="primary"
                    onPress={() => {
                      console.log('join meeting');
                    }}
                  >
                    Join with Google Meet
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    radius="full"
                    onPress={() => copyToClipboard('Hello')}
                  >
                    <Icon icon="solar:copy-linear" width={18} />
                  </Button>
                </div>
                <div className="mt-1">
                  <Link href="#" size="sm" className="text-xs text-default-500">
                    meet.google.com/yzg-fdrq-sga
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4">
              <Icon icon="logos:google-maps" className="mt-1" width={20} />
              <div className="flex w-full flex-col">
                <div className="flex items-center justify-between">
                  <Button
                    color="primary"
                    onPress={() => {
                      console.log('get directions');
                    }}
                  >
                    Get Directions to Clinic
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    radius="full"
                    onPress={() => copyToClipboard('Hello')}
                  >
                    <Icon icon="solar:copy-linear" width={18} />
                  </Button>
                </div>
                <div className="mt-1">
                  <Link href="#" size="sm" className="text-xs text-default-500">
                    meet.google.com/yzg-fdrq-sga
                  </Link>
                </div>
              </div>
            </div>
          )}

          <Button
            variant="light"
            size="sm"
            className="text-primary"
            onPress={() => {
              console.log('more phone numbers');
            }}
          >
            More phone numbers
          </Button>
        </div>

        <Divider />

        {/* Guests */}
        <div className="p-4">
          <div className="mb-3 flex items-center gap-3">
            <Icon
              icon="solar:users-group-linear"
              className="h-5 w-5 text-default-600"
            />
            <div>
              <div className="font-medium">1 guests</div>
              <div className="text-sm text-default-600">1 yes</div>
              <div className="text-sm text-default-600">1 no, 0 awaiting</div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button isIconOnly size="sm" variant="light">
                <Icon icon="solar:copy-linear" className="h-4 w-4" />
              </Button>
              <Button isIconOnly size="sm" variant="light">
                <Icon icon="solar:pen-new-square-linear" className="h-4 w-4" />
              </Button>
              <Button isIconOnly size="sm" variant="light">
                <Icon icon="solar:chevron-down-linear" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Divider />

        {/* Notifications */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Icon
              icon="solar:bell-linear"
              className="h-5 w-5 text-default-600"
            />
            <div>
              <div className="font-medium">When event starts</div>
              <div className="text-sm text-default-600">10 minutes before</div>
            </div>
          </div>
        </div>

        <Divider />

        {/* Organizer */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Icon
              icon="solar:calendar-linear"
              className="h-5 w-5 text-default-600"
            />
            <div className="text-default-900">Ankit Kalirawana</div>
          </div>
        </div>

        <Divider />

        {/* Response Options */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <span className="font-medium text-default-900">Going?</span>
            <div className="flex gap-2">
              <Chip>✓ Yes</Chip>
              <Chip>No</Chip>
              <Chip>Maybe</Chip>
            </div>
            <Button isIconOnly size="sm" variant="light">
              <Icon icon="solar:chevron-down-linear" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// Example usage

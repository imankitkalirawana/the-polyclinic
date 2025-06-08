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
  Divider,
  CardHeader,
  Tooltip,
  ButtonGroup,
  User,
  divider,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { AppointmentType } from '@/models/Appointment';
import StatusRenderer from './status-renderer';
import { format } from 'date-fns';
import { CLINIC_INFO } from '@/lib/config';

export default function MeetingEventCard({
  appointment,
}: {
  appointment: AppointmentType;
}) {
  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between gap-1 border-b border-divider bg-primary-500 text-primary-foreground">
        <div>
          <h2 className="text-large font-medium capitalize text-primary-foreground">
            {appointment.type}
          </h2>
          <div className="flex items-center gap-1">
            <StatusRenderer status={appointment.status} />
            &middot;
            <span className="text-xs text-primary-foreground/90">
              {format(new Date(appointment.date), 'EEEE, MMMM d · hh:mm a')}
            </span>
          </div>
        </div>

        <div>
          <Tooltip content="Open in new Tab">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              radius="full"
              className="text-primary-foreground"
            >
              <Icon icon="solar:arrow-right-up-line-duotone" width={18} />
            </Button>
          </Tooltip>
          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                radius="full"
                className="text-primary-foreground"
              >
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
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col items-start gap-1">
          <AppointmentHeading title="PEOPLE" />
          <User
            name={appointment.patient.name}
            avatarProps={{
              src: appointment.patient.image,
              size: 'sm',
              name: appointment.patient.name,
            }}
            classNames={{
              description: 'text-default-400 text-xs',
            }}
            description={[
              `Patient • #${appointment.patient.uid}`,
              appointment.patient.gender || appointment.patient.age
                ? [appointment.patient.gender, appointment.patient.age]
                    .filter(Boolean)
                    .join(', ')
                : null,
            ]
              .filter(Boolean)
              .join(' • ')}
          />
          {appointment.doctor && (
            <User
              name={appointment.doctor.name}
              avatarProps={{
                src: appointment.doctor.image,
                size: 'sm',
                name: appointment.doctor.name,
              }}
              classNames={{
                description: 'text-default-400 text-xs',
              }}
              description={[
                `Doctor • #${appointment.doctor.uid}`,
                appointment.doctor.sitting,
              ]
                .filter(Boolean)
                .join(' • ')}
            />
          )}
        </div>
        <Divider className="my-2" />
        <div className="flex flex-col items-start gap-1">
          <AppointmentHeading
            title="Appointment Mode"
            description={
              appointment.additionalInfo.type === 'online' ? (
                <div className="flex items-center gap-1">
                  <Icon
                    icon="solar:videocamera-bold-duotone"
                    className="text-primary-500"
                    width={12}
                  />
                  <span className="capitalize">Online</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Icon icon="solar:map-bold-duotone" width={12} />
                  <span className="capitalize">In-Person</span>
                </div>
              )
            }
          />
          {appointment.additionalInfo.type === 'online' ? (
            <MeetDirections
              icon="logos:google-meet"
              label="Join with Google Meet"
              description="meet.google.com/yzg-fdrq-sga"
            />
          ) : (
            <MeetDirections
              icon="logos:google-maps"
              label="Get Directions to Clinic"
              description={CLINIC_INFO.location.address}
            />
          )}
        </div>

        <div className="flex flex-col items-start gap-1">
          <AppointmentHeading title="Additional Information" />
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

function AppointmentHeading({
  title,
  description,
}: {
  title: string;
  description?: string | React.ReactNode;
}) {
  return (
    <div className="flex w-full items-center justify-between gap-2 text-[10px] font-medium uppercase tracking-wide text-default-500">
      <h2>{title}</h2>
      {description}
    </div>
  );
}

function MeetDirections({
  icon,
  label,
  description,
  onGetDirections,
  onCopy,
}: {
  icon: string;
  label: string;
  description: string;
  onGetDirections?: () => void;
  onCopy?: () => void;
}) {
  return (
    <div className="mb-2 flex w-full items-start gap-4">
      <div className="flex w-full flex-col gap-1">
        <ButtonGroup className="justify-start">
          <Button
            color="primary"
            onPress={onGetDirections}
            startContent={<Icon icon={icon} width={12} />}
            fullWidth
          >
            {label}
          </Button>
          <Button isIconOnly color="primary" variant="flat" onPress={onCopy}>
            <Icon icon="solar:copy-linear" width={18} />
          </Button>
        </ButtonGroup>
        <span className="text-xs text-default-500">{description}</span>
      </div>
    </div>
  );
}

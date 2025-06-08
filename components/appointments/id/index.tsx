'use client';

import {
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Chip,
  Divider,
  Progress,
  ProgressProps,
  Button,
  Calendar,
  Image,
  CardFooter,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useQuery } from '@tanstack/react-query';

import NoResults from '@/components/ui/no-results';
import { getAppointmentWithAID } from '@/functions/server-actions/appointment';
import { AppointmentType } from '@/models/Appointment';
import { renderChip } from '@/components/ui/data-table/cell-renderers';
import { CellRenderer } from '@/components/ui/cell-renderer';
import { format } from 'date-fns';

interface AppointmentProps {
  aid: number;
  session: any;
}

export default function Appointment({ aid, session }: AppointmentProps) {
  const {
    data: appointment,
    isError,
    error,
  } = useQuery<AppointmentType>({
    queryKey: ['appointment', aid],
    queryFn: () => getAppointmentWithAID(aid),
  });

  if (isError) {
    return (
      <NoResults message="Appointment Not Found" description={error.message} />
    );
  }

  if (!appointment) {
    return <NoResults message="Appointment Not Found" />;
  }
  const progress: Record<
    string,
    {
      value: number;
      color: ProgressProps['color'];
    }
  > = {
    booked: {
      value: 10,
      color: 'primary',
    },
    confirmed: {
      value: 50,
      color: 'success',
    },
  };

  return (
    <div className="container mx-auto p-8">
      <nav className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl">Appointment Details</h1>
            <p>
              <span className="">#{appointment.aid}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {renderChip({ item: appointment.status })}
            <CellRenderer
              icon="solar:calendar-bold-duotone"
              value={format(new Date(appointment.date), 'EEEE, MMM d, yyyy ')}
              classNames={{ icon: 'text-gray-500 bg-gray-100' }}
              iconSize={18}
              className="rounded-lg bg-gray-100 px-2 py-1"
            />
            <CellRenderer
              icon="mdi:clock-outline"
              value={format(new Date(appointment.date), 'h:mm a')}
              classNames={{ icon: 'text-gray-500 bg-gray-100' }}
              iconSize={18}
              className="rounded-lg bg-gray-100 px-2 py-1"
            />
            <CellRenderer
              icon="mynaui:label-solid"
              iconSize={18}
              value={appointment.type}
              classNames={{
                icon: 'text-primary bg-primary-50',
                value: 'text-primary',
              }}
              className="rounded-lg bg-gray-100 px-2 py-1"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            color="primary"
            variant="light"
            startContent={
              <Icon icon="material-symbols:print-outline" width="18" />
            }
          >
            Print
          </Button>
          <Button
            color="primary"
            variant="light"
            startContent={<Icon icon="material-symbols:share" width="18" />}
          >
            Share
          </Button>
          <Dropdown>
            <DropdownTrigger>
              <Icon icon="entypo:dots-three-vertical" width="18" />
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="new">New file</DropdownItem>
              <DropdownItem key="copy">Copy link</DropdownItem>
              <DropdownItem key="edit">Edit file</DropdownItem>
              <DropdownItem key="delete" className="text-danger" color="danger">
                Delete file
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </nav>
      <div className="grid md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Card className="mx-auto w-full max-w-md">
            <CardHeader className="flex flex-row justify-between text-center">
              <h2 className="text-default-500">Pateint Details</h2>
              <Icon
                icon="tabler:edit"
                width="24"
                height="24"
                className="text-gray-400"
              />
            </CardHeader>
            <Divider className="my-2 border-dashed border-divider" />

            <CardBody className="">
              {/* Patient Avatar and Name */}
              <div className="flex items-start gap-4 pb-4">
                <div className="flex-shrink-0">
                  <Image
                    src={'/assets/placeholder-avatar.jpeg'}
                    alt={appointment.patient.name}
                    width={100}
                    height={100}
                    className="rounded-full text-slate-300"
                  />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-xl text-default-500">
                    {appointment.patient.name}
                  </h2>
                  <CellRenderer
                    label="Patient ID"
                    icon="tabler:hash"
                    value={appointment.patient.uid}
                    classNames={{
                      icon: 'text-yellow-600 bg-yellow-50',
                      label: 'text-xs',
                      value: ' text-gray-500',
                    }}
                  />

                  {/* Patient Details using CellRenderer */}
                  <div className="">
                    <CellRenderer
                      icon="iconamoon:profile"
                      value={`${appointment.patient.gender}, ${appointment.patient.age} years`}
                      classNames={{
                        icon: 'text-pink-600 bg-pink-50',
                        value: 'text-gray-600',
                      }}
                    />

                    <CellRenderer
                      icon="ic:baseline-phone"
                      value={appointment.patient.phone}
                      classNames={{
                        icon: 'text-green-600 bg-green-50',
                        value: 'text-gray-600',
                      }}
                    />

                    <CellRenderer
                      icon="material-symbols:mail"
                      value={appointment.patient.email}
                      classNames={{
                        icon: 'text-blue-600 bg-blue-50',
                        value: 'text-gray-600',
                      }}
                    />
                  </div>
                </div>
              </div>
              <Divider className="my-2 border-dashed border-divider" />

              {/* View Full Profile Link */}
              <div className="flex justify-end">
                <Button variant="flat" color="warning">
                  View full Profile
                </Button>
              </div>
            </CardBody>
          </Card>
          <Card className="mx-auto w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <h2 className="text-default-500">Doctor Details</h2>
              <Icon
                icon="tabler:edit"
                width="24"
                height="24"
                className="text-gray-400"
              />
            </CardHeader>
            <Divider className="my-2 border-dashed border-divider" />

            <CardBody className="">
              {/* Patient Avatar and Name */}
              <div className="flex items-start gap-4 pb-4">
                <div className="flex-shrink-0">
                  <Image
                    src={'/assets/placeholder-avatar.jpeg'}
                    alt={appointment.doctor?.name}
                    width={100}
                    height={100}
                    className="rounded-full text-slate-300"
                  />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-xl text-default-500">
                    {appointment.doctor?.name}
                  </h2>
                  <CellRenderer
                    label="Patient ID"
                    icon="tabler:hash"
                    value={appointment.doctor?.uid}
                    classNames={{
                      icon: 'text-yellow-600 bg-yellow-50',
                      label: 'text-xs',
                      value: ' text-gray-500',
                    }}
                  />

                  {/* Patient Details using CellRenderer */}
                  <div className="">
                    <CellRenderer
                      icon="ic:baseline-phone"
                      value={appointment.doctor?.phone}
                      classNames={{
                        icon: 'text-green-600 bg-green-50',
                        value: 'text-gray-600',
                      }}
                    />

                    <CellRenderer
                      icon="material-symbols:mail"
                      value={appointment.doctor?.email}
                      classNames={{
                        icon: 'text-blue-600 bg-blue-50',
                        value: 'text-gray-600',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* View Full Profile Link */}
              <div className="flex justify-end">
                <Button variant="flat" color="success">
                  Contact Doctor
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>
            {/* <CardTitle>Appointment Details</CardTitle>
            <CardDescription>Type: {appointment.type}</CardDescription> */}
          </CardHeader>
          <CardBody className="space-y-4">
            {
              <div className="flex items-start gap-4 py-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Icon
                      icon="uil:calender"
                      width="24"
                      height="24"
                      className="text-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                    DATE & TIME
                  </p>
                  <CellRenderer
                    label="Date & Time"
                    icon="solar:calendar-bold-duotone"
                    value={(new Date(appointment.date), 'MMM d, yyyy - h:mm a')}
                    classNames={{ icon: 'text-yellow-500 bg-yellow-50' }}
                  />
                </div>
              </div>
            }

            <div className="flex items-center gap-2">
              {appointment.additionalInfo.type === 'online' ? (
                <Icon icon="solar:video-chat-bold" />
              ) : (
                <Icon icon="solar:map-pin-bold" />
              )}
              <div>
                <p className="text-sm font-medium">Appointment Type</p>
                <p className="text-sm capitalize">
                  {appointment.additionalInfo.type}
                </p>
              </div>
            </div>

            <Divider />

            {appointment.data && Object.keys(appointment.data).length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium">Additional Data</h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {Object.entries(appointment.data).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm font-medium capitalize">{key}</p>
                      <p className="text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

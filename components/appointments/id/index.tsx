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
    <div className="container mx-auto py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <nav className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
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
                className="items-center rounded-lg bg-gray-100 px-2 py-1 text-tiny text-gray-500"
              />
              <CellRenderer
                icon="mdi:clock-outline"
                value={format(new Date(appointment.date), 'h:mm a')}
                classNames={{ icon: 'text-gray-500 bg-gray-100' }}
                iconSize={18}
                className="items-center rounded-lg bg-gray-100 px-2 py-1 text-tiny text-gray-500"
              />
            </div>
          </div>
        </nav>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="w-full">
            <CardHeader>
              <h2 className="text-default-500">Pateint Details</h2>
            </CardHeader>
            <CardBody>
              <div className="flex items-center">
                <div>
                  <Image
                    src={'/assets/placeholder-avatar.jpeg'}
                    alt={appointment.patient.name}
                    width={100}
                    height={100}
                    className="rounded-full text-slate-300"
                  />
                </div>
                <div className="">
                  <CellRenderer
                    label="Patient ID"
                    icon="solar:hashtag-circle-bold-duotone"
                    value={appointment.patient.uid}
                    classNames={{ icon: 'text-yellow-500 bg-yellow-50' }}
                    className="text-large text-black"
                  />
                  <CellRenderer
                    label="Name"
                    icon="cbi:abc"
                    value={appointment.patient.name}
                    classNames={{ icon: 'text-pink-500 bg-pink-50' }}
                    className="text-large text-black"
                  />
                  <CellRenderer
                    label="Email"
                    icon="material-symbols:mail"
                    value={appointment.patient.email}
                    classNames={{ icon: 'text-blue-500 bg-blue-50' }}
                    className="text-large text-black"
                  />
                  <CellRenderer
                    label="Phone Number"
                    icon="ic:baseline-phone"
                    value={appointment.patient.phone}
                    classNames={{ icon: 'text-green-500 bg-green-50' }}
                    className="text-large text-black"
                  />
                </div>
              </div>
              <CardFooter>
                <Button variant="flat" color="warning">
                  <Icon icon="solar:calendar-bold-duotone" width="20" />
                  Reschedule appointment
                </Button>
              </CardFooter>
            </CardBody>
          </Card>
          <Card className="w-full">
            <CardHeader className="">
              <h2 className="text-default-500">Doctor Details</h2>
            </CardHeader>
            <CardBody>
              <div className="flex items-center">
                <div>
                  <Image
                    src={'/assets/placeholder-avatar.jpeg'}
                    alt={appointment.patient.name}
                    width={100}
                    height={100}
                    className="rounded-full text-slate-300"
                  />
                </div>
                <div className="">
                  <CellRenderer
                    label="Name"
                    icon="cbi:abc"
                    value={appointment.doctor?.name}
                    classNames={{ icon: 'text-pink-500 bg-pink-50' }}
                    className="text-large text-black"
                  />
                  <CellRenderer
                    label="Email"
                    icon="material-symbols:mail"
                    value={appointment.doctor?.email}
                    classNames={{ icon: 'text-blue-500 bg-blue-50' }}
                    className="text-large text-black"
                  />
                  <CellRenderer
                    label="Phone Number"
                    icon="ic:baseline-phone"
                    value={appointment.doctor?.phone}
                    classNames={{ icon: 'text-green-500 bg-green-50' }}
                    className="text-large text-black"
                  />
                  <CellRenderer
                    label="Sitting"
                    icon="fluent:status-20-filled"
                    value={appointment.doctor?.sitting}
                    classNames={{ icon: 'text-purple-500 bg-purple-50' }}
                    className="text-large text-black"
                  />
                </div>
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
                  <p className="mb-1 text-tiny font-medium uppercase tracking-wide text-gray-500">
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
                <p className="text-small font-medium">Appointment Type</p>
                <p className="text-small capitalize">
                  {appointment.additionalInfo.type}
                </p>
              </div>
            </div>

            <Divider />

            {appointment.data && Object.keys(appointment.data).length > 0 && (
              <div>
                <h3 className="mb-2 text-small font-medium">Additional Data</h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {Object.entries(appointment.data).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-small font-medium capitalize">{key}</p>
                      <p className="text-small">{value}</p>
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

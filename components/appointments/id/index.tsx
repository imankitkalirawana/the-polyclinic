'use client';

import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Progress,
  ProgressProps,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useQuery } from '@tanstack/react-query';

import NoResults from '@/components/ui/no-results';
import { getAppointmentWithAID } from '@/functions/server-actions/appointment';
import { AppointmentType } from '@/models/Appointment';

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

  function getStatusColor(status: string) {
    switch (status) {
      case 'booked':
        return 'bg-blue-500';
      case 'confirmed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
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
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Appointment Details</h1>
            <p className="text-muted-foreground">
              Appointment #{appointment.aid}
            </p>
          </div>
          <Chip className={`capitalize ${getStatusColor(appointment.status)}`}>
            {appointment.status}
          </Chip>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg">Appointment Progress</h3>
          </CardHeader>
          <CardBody>
            <Progress value={40} className="h-2" />
            <p className="text-muted-foreground mt-1 text-right text-sm">
              {/* {appointment.progress}% Complete */}
            </p>
          </CardBody>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <h3>Patient Information</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <h3 className="font-medium">{appointment.patient.name}</h3>
                <p className="text-muted-foreground text-sm">
                  ID: {appointment.patient.uid}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {appointment.patient.age && (
                  <div>
                    <p className="text-sm font-medium">Age</p>
                    <p className="text-sm">{appointment.patient.age} years</p>
                  </div>
                )}

                {appointment.patient.gender && (
                  <div>
                    <p className="text-sm font-medium">Gender</p>
                    <p className="text-sm capitalize">
                      {appointment.patient.gender}
                    </p>
                  </div>
                )}
              </div>

              <Divider />

              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm">{appointment.patient.email}</p>
                </div>

                {appointment.patient.phone && (
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm">{appointment.patient.phone}</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {appointment.doctor && (
            <Card>
              <CardHeader>
                <h2>Doctor Information</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <h3 className="font-medium">{appointment.doctor.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    ID: {appointment.doctor.uid}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm">{appointment.doctor.email}</p>
                </div>

                {appointment.doctor.sitting && (
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm">{appointment.doctor.sitting}</p>
                  </div>
                )}
              </CardBody>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            {/* <CardTitle>Appointment Details</CardTitle>
            <CardDescription>Type: {appointment.type}</CardDescription> */}
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
              <div className="flex items-center gap-2">
                {/* <Calendar className="text-muted-foreground h-5 w-5" /> */}
                <div>
                  <p className="text-sm font-medium">Date</p>
                  {/* <p className="text-sm">{formatDate(appointment.date)}</p> */}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* <Clock className="text-muted-foreground h-5 w-5" /> */}
                <div>
                  <p className="text-sm font-medium">Time</p>
                  {/* <p className="text-sm">{formatTime(appointment.date)}</p> */}
                </div>
              </div>

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

        <Card>
          <CardHeader>
            <h1>Additional Information</h1>
          </CardHeader>
          <CardBody className="space-y-4">
            {appointment.additionalInfo.description && (
              <div>
                <h3 className="text-sm font-medium">Description</h3>
                <p className="text-sm">
                  {appointment.additionalInfo.description}
                </p>
              </div>
            )}

            {appointment.additionalInfo.symptoms && (
              <div>
                <h3 className="text-sm font-medium">Symptoms</h3>
                <p className="text-sm">{appointment.additionalInfo.symptoms}</p>
              </div>
            )}

            {appointment.additionalInfo.notes && (
              <div>
                <h3 className="text-sm font-medium">Notes</h3>
                <p className="text-sm">{appointment.additionalInfo.notes}</p>
              </div>
            )}

            {appointment.additionalInfo.instructions && (
              <div>
                <h3 className="text-sm font-medium">Instructions</h3>
                <p className="text-sm">
                  {appointment.additionalInfo.instructions}
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

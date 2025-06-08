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
import { format, formatDate } from 'date-fns';

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
      <nav className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl">Appointment Details</h1>
            <p>
              <span>#{appointment.aid}</span>
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
              icon="solar:clock-circle-linear"
              value={format(new Date(appointment.date), 'h:mm a')}
              classNames={{ icon: 'text-gray-500 bg-gray-100' }}
              iconSize={18}
              className="rounded-lg bg-gray-100 px-2 py-1"
            />
            <CellRenderer
              icon="solar:tag-bold"
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
        <div className="flex items-center">
          <Button
            color="primary"
            variant="light"
            startContent={<Icon icon="solar:printer-outline" width="18" />}
          >
            Print
          </Button>
          <Button
            color="primary"
            variant="light"
            startContent={<Icon icon="solar:share-bold" width="18" />}
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
      <div className="flex w-full gap-6">
        <div className="flex flex-1 flex-col gap-4">
          {/* {pateint card} */}
          <Card className="mx-auto w-full max-w-md">
            <CardHeader className="flex flex-row justify-between text-center">
              <h2 className="pl-6 text-xl text-black">Pateint Details</h2>
              <Icon
                icon="tabler:edit"
                width="24"
                height="24"
                className="text-gray-400"
              />
            </CardHeader>
            <Divider className="border-dashed border-divider" />

            <CardBody>
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
                  <h3 className="pl-8 text-xl text-black">
                    {appointment.patient.name}
                  </h3>
                  <p className="pl-8 text-sm text-gray-500">
                    <span className="text-gray-500">Patient ID: </span>
                    {appointment.patient.uid}
                  </p>

                  {/* Patient Details using CellRenderer */}
                  <div>
                    {(appointment.patient.gender ||
                      appointment.patient.age) && (
                      <CellRenderer
                        icon="solar:user-line-duotone"
                        value={[
                          appointment.patient.gender || appointment.patient.age
                            ? [
                                appointment.patient.gender,
                                appointment.patient.age,
                              ]
                                .filter(Boolean)
                                .join(', ')
                            : '',
                        ]}
                        classNames={{
                          icon: 'text-default-500 ',
                          value: 'text-black',
                        }}
                        iconSize={18}
                      />
                    )}
                    {appointment.patient.phone && (
                      <CellRenderer
                        icon="solar:phone-linear"
                        value={[
                          appointment.patient.phone
                            ? appointment.patient.phone
                            : '',
                        ]}
                        classNames={{
                          icon: 'text-default-500 ',
                          value: 'text-black',
                        }}
                        iconSize={18}
                      />
                    )}

                    <CellRenderer
                      icon="solar:letter-bold"
                      value={appointment.patient.email}
                      classNames={{
                        icon: 'text-default-500 ',
                        value: 'text-black lowercase',
                      }}
                      iconSize={18}
                    />
                  </div>
                </div>
              </div>
              <Divider className="border-dashed border-divider" />

              {/* View Full Profile Link */}
              <div className="mt-2 flex justify-end">
                <Button variant="flat" color="warning">
                  View full Profile
                </Button>
              </div>
            </CardBody>
          </Card>
          {/* {doctor card} */}
          {!!appointment.doctor && (
            <Card className="mx-auto w-full max-w-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="pl-6 text-xl text-black">Doctor Details</h2>
              </CardHeader>
              <Divider className="border-dashed border-divider" />

              <CardBody>
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
                    <h3 className="pl-6 text-xl text-black">
                      {appointment.doctor?.name}
                    </h3>
                    <p className="pl-6 text-sm text-gray-500">
                      <span className="text-gray-500">Doctor ID: </span>
                      {appointment.doctor?.uid}
                    </p>

                    {/* Patient Details using CellRenderer */}
                    <div>
                      {appointment.doctor.phone && (
                        <CellRenderer
                          icon="solar:map-point-bold"
                          value={[
                            appointment.doctor.phone
                              ? appointment.doctor.phone
                              : '',
                          ]}
                          classNames={{
                            icon: 'text-default-500 ',
                            value: 'text-black',
                          }}
                          iconSize={18}
                        />
                      )}

                      <CellRenderer
                        icon="solar:letter-bold"
                        value={appointment.doctor?.email}
                        classNames={{
                          icon: 'text-default-500 ',
                          value: 'text-black lowercase',
                        }}
                        iconSize={18}
                      />
                      {appointment.doctor.sitting && (
                        <CellRenderer
                          icon="mdi:location"
                          value={[
                            appointment.doctor.sitting
                              ? appointment.doctor.sitting
                              : '',
                          ]}
                          classNames={{
                            icon: 'text-default-500 ',
                            value: 'text-black',
                          }}
                          iconSize={18}
                        />
                      )}
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
          )}
        </div>
        <div className="flex flex-[2] flex-col gap-4">
          {/* first card  second column*/}
          <Card>
            <CardHeader>
              <h2 className="pl-6 text-xl text-black">
                Appointment Information
              </h2>
            </CardHeader>
            <Divider className="border-dashed border-divider" />
            <CardBody className="space-y-4 p-6">
              <div className="flex max-w-xl items-center justify-between">
                <div>
                  <CellRenderer
                    label="Date & Time"
                    icon="solar:calendar-bold-duotone"
                    value={format(
                      new Date(appointment.date),
                      'MMM d, yyyy - h:mm a'
                    )}
                    classNames={{ icon: 'text-yellow-500 bg-yellow-50' }}
                  />
                  <CellRenderer
                    label="Appointment Type"
                    icon="solar:stethoscope-bold"
                    value={appointment.type}
                    classNames={{
                      icon: 'text-primary bg-primary-50',
                    }}
                  />
                </div>
                <div>
                  <CellRenderer
                    label="Mode"
                    icon="solar:hospital-bold"
                    value={appointment.additionalInfo.type}
                    classNames={{ icon: 'text-blue-500 bg-blue-50' }}
                  />
                  <CellRenderer
                    label="Created At"
                    icon="solar:clock-circle-linear"
                    value={
                      appointment.createdAt
                        ? formatDate(new Date(appointment.createdAt), 'PPP')
                        : 'N/A'
                    }
                    classNames={{ icon: 'text-pink-500 bg-pink-50' }}
                  />
                </div>
              </div>
              <div>
                <Progress
                  aria-label="Loading..."
                  label="Appointment Progress"
                  className="max-w-2xl"
                  value={60}
                />
                <div className="grid grid-cols-4 gap-8">
                  <div>Booked</div>
                  <div>Confirmed</div>
                  <div>In Progress</div>
                  <div>Completed</div>
                </div>
              </div>
              <Divider className="border-dashed border-divider" />
              <div>
                <CellRenderer
                  label="Symptoms"
                  icon="solar:clipboard-list-bold-duotone"
                  value={
                    appointment.additionalInfo.symptoms ||
                    'No symptoms provided.'
                  }
                  classNames={{ icon: 'text-blue-500 bg-blue-50' }}
                />
                <CellRenderer
                  label="Description"
                  icon="solar:list-up-outline"
                  value={
                    appointment.additionalInfo.description ||
                    'No description provided.'
                  }
                  classNames={{ icon: 'text-primary-500 bg-primary-50' }}
                />
              </div>
            </CardBody>
          </Card>
          {/* last card */}
          <Card>
            <CardHeader className="pl-8 text-xl text-black">
              Additional Information
            </CardHeader>
            <Divider className="border-dashed border-divider" />
            <CardBody className="space-y-4 p-6">
              <div>
                <CellRenderer
                  label="Symptoms"
                  icon="solar:notes-bold"
                  value={
                    appointment.additionalInfo.notes ||
                    'No additional information provided.'
                  }
                  classNames={{ icon: 'text-purple-500 bg-purple-50' }}
                />
                <CellRenderer
                  label=" Pre-appointment Instructions"
                  icon="solar:list-check-minimalistic-bold"
                  value={
                    appointment.additionalInfo.instructions ||
                    'No additional information provided.'
                  }
                  classNames={{ icon: 'text-orange-500 bg-orange-50' }}
                />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

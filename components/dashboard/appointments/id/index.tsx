'use client';

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Progress,
  Tooltip,
} from '@heroui/react';
import { format } from 'date-fns';
import { Icon } from '@iconify/react/dist/iconify.js';

import RescheduleAppointment from '@/services/client/appointment/components/reschedule-modal'; // Ensure this path is correct
import ActivityTimeline from '@/components/ui/activity/timeline';
import AddToCalendar from '@/components/ui/appointments/add-to-calendar';
import { CellRenderer } from '@/components/ui/cell/rich-color/cell-renderer';
import { renderChip } from '@/components/ui/static-data-table/cell-renderers';
import NoResults from '@/components/ui/no-results';
import { useAppointmentWithAID } from '@/services/client/appointment/appointment.query';
import { useAppointmentStore } from '@/services/client/appointment/appointment.store';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';

export default function Appointment({ aid }: { aid: string }) {
  const { action, setAction, setAid } = useAppointmentStore();
  const { data: appointment, isLoading, isError, error } = useAppointmentWithAID(aid);

  if (isLoading) {
    return <MinimalPlaceholder message="Loading appointment..." />;
  }

  if (isError) {
    return <NoResults message="Appointment Not Found" description={error.message} />;
  }

  if (!appointment) {
    return <NoResults message="Appointment Not Found" />;
  }

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
          <div className="flex flex-wrap items-center gap-2">
            {renderChip({ item: appointment.status })}
            <Chip
              color="default"
              radius="sm"
              startContent={<Icon icon="solar:calendar-bold-duotone" width={18} />}
              variant="flat"
            >
              {format(new Date(appointment.date), 'EEEE, MMM d, yyyy ')}
            </Chip>
            <Chip
              color="default"
              radius="sm"
              startContent={<Icon icon="solar:clock-circle-bold-duotone" width={18} />}
              variant="flat"
            >
              {format(new Date(appointment.date), 'h:mm a')}
            </Chip>
            <Chip
              color="success"
              radius="sm"
              startContent={<Icon icon="solar:tag-bold-duotone" width={18} />}
              variant="flat"
            >
              {appointment.type}
            </Chip>
          </div>
        </div>
        <div className="flex items-center">
          <Button
            color="primary"
            variant="light"
            startContent={<Icon icon="solar:printer-2-bold-duotone" width="18" />}
          >
            Print
          </Button>
          <Button
            color="primary"
            variant="light"
            startContent={<Icon icon="solar:share-bold-duotone" width="18" />}
          >
            Share
          </Button>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button variant="light" size="sm" isIconOnly>
                <Icon icon="entypo:dots-three-vertical" width="18" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="copy">Copy link</DropdownItem>
              <DropdownItem key="edit">Edit Appointment</DropdownItem>
              <DropdownItem key="delete" className="text-danger" color="danger">
                Delete Appointment
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </nav>
      <div className="mb-20 flex w-full flex-col gap-8 lg:flex-row">
        <div className="flex flex-1 flex-col gap-4">
          {/* {patient card} */}
          <Card className="mx-auto w-full max-w-md">
            <CustomCardHeader
              title="Patient Details"
              endContent={
                <Button variant="light" color="default" isIconOnly size="sm">
                  <Icon
                    icon="solar:pen-new-square-line-duotone"
                    width="20"
                    className="text-default-400"
                  />
                </Button>
              }
            />
            <Divider className="border-divider border-dashed" />

            <CardBody>
              {/* Patient Avatar and Name */}
              <div className="flex items-start gap-4 pb-4">
                <div className="shrink-0">
                  <Avatar
                    src={appointment.patient.image}
                    name={appointment.patient.name}
                    size="lg"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="pl-8 text-xl">{appointment.patient.name}</h3>
                  <p className="text-default-400 pl-8 text-sm">
                    <span className="text-gray-500">Patient ID: </span>
                    {appointment.patient.uid}
                  </p>

                  {/* Patient Details using CellRenderer */}
                  <div>
                    {(appointment.patient.gender || appointment.patient.age) && (
                      <CellRenderer
                        icon="solar:user-bold-duotone"
                        value={[
                          appointment.patient.gender || appointment.patient.age
                            ? [appointment.patient.gender, appointment.patient.age]
                                .filter(Boolean)
                                .join(', ')
                            : '',
                        ]}
                        classNames={{
                          icon: 'text-default-500 ',
                          value: 'text-default-foreground',
                        }}
                        iconSize={18}
                      />
                    )}
                    {appointment.patient.phone && (
                      <CellRenderer
                        icon="solar:phone-bold-duotone"
                        value={[appointment.patient.phone ? appointment.patient.phone : '']}
                        classNames={{
                          icon: 'text-default-500 ',
                          value: 'text-default-foreground',
                        }}
                        iconSize={18}
                      />
                    )}

                    <CellRenderer
                      icon="solar:letter-bold-duotone"
                      value={appointment.patient.email}
                      classNames={{
                        icon: 'text-default-500 ',
                        value: 'text-default-foreground lowercase',
                      }}
                      iconSize={18}
                    />
                  </div>
                </div>
              </div>
              <Divider className="border-divider border-dashed" />

              {/* View Full Profile Link */}
              <div className="mt-2 flex justify-end">
                <Button color="default" variant="light">
                  View full profile
                </Button>
              </div>
            </CardBody>
          </Card>
          {/* {doctor card} */}
          {!!appointment.doctor && (
            <Card className="mx-auto w-full max-w-md">
              <CustomCardHeader title="Doctor Details" endContent="" />
              <Divider className="border-divider border-dashed" />

              <CardBody>
                {/* Patient Avatar and Name */}
                <div className="flex items-start gap-4 pb-4">
                  <div className="shrink-0">
                    <Avatar
                      src={appointment.doctor.image}
                      name={appointment.doctor?.name}
                      size="lg"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-large pl-6">{appointment.doctor?.name}</h3>
                    <p className="text-default-400 pl-6 text-sm">
                      <span className="text-default-400">Doctor ID: </span>
                      {appointment.doctor?.uid}
                    </p>

                    {/* Patient Details using CellRenderer */}
                    <div>
                      {appointment.doctor.phone && (
                        <CellRenderer
                          icon="solar:phone-bold-duotone"
                          value={[appointment.doctor.phone ? appointment.doctor.phone : '']}
                          classNames={{
                            icon: 'text-default-500 ',
                            value: 'text-black',
                          }}
                          iconSize={18}
                        />
                      )}

                      <CellRenderer
                        icon="solar:letter-bold-duotone"
                        value={appointment.doctor?.email}
                        classNames={{
                          icon: 'text-default-500 ',
                          value: 'text-black lowercase truncate line-clamp-1',
                        }}
                        iconSize={18}
                      />
                      {appointment.doctor.seating && (
                        <CellRenderer
                          icon="solar:map-point-bold-duotone"
                          value={[appointment.doctor.seating ? appointment.doctor.seating : '']}
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
          <Card>
            <CustomCardHeader title="Activity" endContent="" />
            <Divider className="border-divider border-dashed" />
            <CardBody className="p-6">
              <div>
                <ActivityTimeline activities={[]} />
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="flex flex-2 flex-col gap-4">
          {/* first card  second column */}
          <Card>
            <CustomCardHeader title="Appointment Details" endContent="" />
            <Divider className="border-divider border-dashed" />
            <CardBody className="space-y-4 p-6">
              <div className="flex max-w-xl items-center justify-between">
                <div>
                  <CellRenderer
                    label="Date & Time"
                    icon="solar:calendar-bold-duotone"
                    value={format(new Date(appointment.date), 'MMM d, yyyy - h:mm a')}
                    classNames={{ icon: 'text-yellow-500 bg-yellow-50' }}
                  />
                  <CellRenderer
                    label="Appointment Type"
                    icon="solar:stethoscope-bold-duotone"
                    value={appointment.type}
                    classNames={{
                      icon: 'text-primary bg-primary-50',
                    }}
                  />
                </div>
                <div>
                  <CellRenderer
                    label="Mode"
                    icon="solar:hospital-bold-duotone"
                    value={appointment.additionalInfo.type}
                    classNames={{ icon: 'text-blue-500 bg-blue-50' }}
                  />
                  <CellRenderer
                    label="Created At"
                    icon="solar:clock-circle-bold-duotone"
                    value={
                      appointment.createdAt ? format(new Date(appointment.createdAt), 'PPP') : 'N/A'
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
              <Divider className="border-divider border-dashed" />
              <div>
                <CellRenderer
                  label="Symptoms"
                  icon="solar:clipboard-list-bold-duotone"
                  value={appointment.additionalInfo.symptoms || 'No symptoms provided.'}
                  classNames={{ icon: 'text-blue-500 bg-blue-50' }}
                />
                <CellRenderer
                  label="Description"
                  icon="solar:list-up-bold-duotone"
                  value={appointment.additionalInfo.description || 'No description provided.'}
                  classNames={{ icon: 'text-primary-500 bg-primary-50' }}
                />
              </div>
            </CardBody>
          </Card>
          {/* last card */}
          <Card>
            <CustomCardHeader title="Additional Information" endContent="" />
            <Divider className="border-divider border-dashed" />
            <CardBody className="space-y-4 p-6">
              <div>
                <CellRenderer
                  label=" Notes"
                  icon="solar:notes-bold-duotone"
                  value={appointment.additionalInfo.notes || 'No additional information provided.'}
                  classNames={{ icon: 'text-purple-500 bg-purple-50' }}
                />
                <CellRenderer
                  label=" Pre-appointment Instructions"
                  icon="solar:list-check-minimalistic-bold-duotone"
                  value={
                    appointment.additionalInfo.instructions || 'No additional information provided.'
                  }
                  classNames={{ icon: 'text-orange-500 bg-orange-50' }}
                />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
      <footer className="bg-background/30 fixed bottom-0 left-0 z-20 w-full border-t px-8 shadow-md backdrop-blur-sm">
        <div className="m-4 flex justify-between">
          <Button
            color="default"
            variant="flat"
            startContent={<Icon icon="solar:calendar-add-bold-duotone" width="24" />}
            onPress={() => setAction('add-to-calendar')}
          >
            Add to Calender
          </Button>

          <div className="flex items-center">
            <div>
              <Tooltip content="Cancel Appointment" color="danger">
                <Button
                  color="danger"
                  variant="flat"
                  isIconOnly
                  className="mr-2"
                  onPress={() => {
                    setAid(appointment.aid);
                    setAction('cancel');
                  }}
                >
                  <Icon icon="solar:close-circle-bold-duotone" width="24" />
                </Button>
              </Tooltip>
            </div>

            <Tooltip content="Send a Reminder">
              <Button color="default" variant="flat" isIconOnly className="mr-2">
                <Icon icon="solar:bell-bing-bold-duotone" width="24" />
              </Button>
            </Tooltip>
            <div>
              <Button
                color="warning"
                variant="flat"
                startContent={<Icon icon="solar:calendar-bold-duotone" width="24" />}
                onPress={() => setAction('reschedule')}
              >
                Reschedule
              </Button>
              {action === 'reschedule' && <RescheduleAppointment />}

              {action === 'add-to-calendar' && (
                <AddToCalendar appointment={appointment} onClose={() => setAction(null)} />
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
function CustomCardHeader({ title, endContent }: { title: string; endContent?: React.ReactNode }) {
  return (
    <CardHeader className="flex flex-row justify-between text-center">
      <h2 className="pl-2 text-xl text-black">{title}</h2>
      {endContent}
    </CardHeader>
  );
}

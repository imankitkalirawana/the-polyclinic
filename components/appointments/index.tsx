'use client';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  type CalendarDate,
  DateValue,
  getLocalTimeZone,
  getWeeksInMonth,
  today
} from '@internationalized/date';
import { useLocale } from '@react-aria/i18n';
import {
  Accordion,
  AccordionItem,
  Alert,
  Avatar,
  Button,
  ButtonGroup,
  ButtonProps,
  Card,
  Chip,
  ChipProps,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure
} from '@nextui-org/react';
import Skeleton from '../ui/skeleton';
import Heading from '../ui/heading';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useQueryState } from 'nuqs';
import React from 'react';
import { DoctorType } from '@/models/Doctor';
import {
  changeAppointmentStatus,
  getDoctorWithUID,
  getUserWithUID,
  rescheduleAppointment
} from '@/functions/server-actions';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Calendar } from '../calendar';
import { RightPanel } from './new/calendar/right-panel';
import NoResults from '../ui/no-results';
import { AppointmentType } from '@/models/Appointment';
import { UserType } from '@/models/User';
import {
  addToGoogleCalendar,
  addToOutlookCalendar,
  handleAddToCalendar
} from '@/lib/client-functions';
import { EventType } from '@/lib/interface';
import { capitalize } from '@/lib/utility';

export default function Appointments({ session }: { session: any }) {
  const [status, setStatus] = useQueryState('status', {
    defaultValue: 'upcoming'
  });
  const [sort, setSort] = useQueryState('sort', {
    defaultValue: 'upcoming'
  });
  const [aid, setAid] = useQueryState('aid');
  const [searchQuery, setSearchQuery] = useQueryState('query');

  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await axios
        .get(`/api/appointments?status=${status}`)
        .then((res) => {
          setAppointments(res.data);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    fetchData();
  }, [status]);

  const ChipColorMap: Record<string, ChipProps['color']> = {
    booked: 'default',
    confirmed: 'success',
    'in-progress': 'warning',
    overdue: 'danger',
    completed: 'success',
    cancelled: 'danger'
  };

  const filteredAppointment = useMemo(() => {
    let filteredItems = [...appointments];

    if (searchQuery) {
      filteredItems = filteredItems.filter((item) => {
        const searchValue = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(searchValue) ||
          item.email.toLowerCase().includes(searchValue) ||
          item.phone.toLowerCase().includes(searchValue)
        );
      });
    }

    return filteredItems;
  }, [appointments, searchQuery]);

  const sortedItems = useMemo(() => {
    return [...filteredAppointment].sort((a, b) => {
      const statusOrder = [
        'confirmed',
        'booked',
        'overdue',
        'in-progress',
        'completed',
        'cancelled'
      ];

      if (sort === 'date') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sort === 'createdAt') {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      if (sort === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sort === 'status') {
        return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      }
      if (sort === 'upcoming') {
        // For "upcoming", prioritize by status order and then by appointment date
        const statusComparison =
          statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        if (statusComparison !== 0) return statusComparison;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return 0; // Default case
    });
  }, [filteredAppointment, sort]);

  const noAppointmentMap: Record<string, string> = {
    all: 'There are no appointments to show. Create a new appointment to get started.',
    upcoming: 'There are no upcoming appointments to show.',
    overdue: 'There are no overdue appointments.',
    past: 'There are no past appointments.'
  };

  return (
    <>
      <div>
        <Heading
          title="My Schedules"
          button={
            <Button
              color="primary"
              as={Link}
              href="/appointments/new"
              startContent={<Icon icon="tabler:plus" />}
            >
              Create Appointment
            </Button>
          }
        />
        <div className="flex items-center gap-2">
          <Button
            color={status === 'all' ? 'primary' : 'default'}
            variant={status === 'all' ? 'flat' : 'bordered'}
            onPress={() => setStatus('all')}
          >
            All
          </Button>
          <Button
            color={status === 'upcoming' ? 'primary' : 'default'}
            variant={status === 'upcoming' ? 'flat' : 'bordered'}
            onPress={() => setStatus('upcoming')}
          >
            Upcoming
          </Button>
          <Button
            color={status === 'overdue' ? 'primary' : 'default'}
            variant={status === 'overdue' ? 'flat' : 'bordered'}
            onPress={() => setStatus('overdue')}
          >
            Overdue
          </Button>
          <Button
            color={status === 'past' ? 'primary' : 'default'}
            variant={status === 'past' ? 'flat' : 'bordered'}
            onPress={() => setStatus('past')}
          >
            Past
          </Button>
        </div>
        <div className="my-12">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <LoadingSkeleton key={`skeleton-${index}`} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <Input
                  placeholder="Search by name, email, phone"
                  value={searchQuery || ''}
                  onChange={(e) => {
                    if (e.target.value === '') {
                      setSearchQuery(null);
                    } else {
                      setSearchQuery(e.target.value);
                    }
                  }}
                  isClearable
                  onClear={() => setSearchQuery(null)}
                  className="max-w-md"
                  startContent={<Icon icon="fluent:search-24-regular" />}
                />
                <Dropdown>
                  <DropdownTrigger className="hidden sm:flex">
                    <Button
                      variant="flat"
                      endContent={
                        <Icon icon={'tabler:chevron-down'} fontSize={16} />
                      }
                    >
                      Sort By
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    aria-label="Sort Appointments"
                    closeOnSelect={false}
                    selectionMode="single"
                    selectedKeys={new Set([sort])}
                    onSelectionChange={(selectedKeys) => {
                      const selectedValue = String(Array.from(selectedKeys)[0]);
                      setSort(selectedValue);
                    }}
                  >
                    {sortOptions.map((sort) => (
                      <DropdownItem key={sort.uid} className="capitalize">
                        {capitalize(sort.name)}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
              {appointments.length === 0 ? (
                <NoResults description={noAppointmentMap[status]} />
              ) : (
                <>
                  {sortedItems.length === 0 ? (
                    <NoResults />
                  ) : (
                    <div className="flex flex-col gap-2">
                      <p className="pl-2 text-xs text-default-500">
                        Total {sortedItems.length} Appointments
                      </p>
                      <Accordion
                        motionProps={{
                          variants: {
                            enter: {
                              y: 0,
                              opacity: 1,
                              height: 'auto',
                              overflowY: 'unset',
                              transition: {
                                height: {
                                  type: 'spring',
                                  stiffness: 500,
                                  damping: 30,
                                  duration: 1
                                },
                                opacity: {
                                  easings: 'ease',
                                  duration: 1,
                                  delay: 0.2
                                }
                              }
                            },
                            exit: {
                              y: -10,
                              opacity: 0,
                              height: 0,
                              overflowY: 'hidden',
                              transition: {
                                height: {
                                  easings: 'ease',
                                  duration: 0.25
                                },
                                opacity: {
                                  easings: 'ease',
                                  duration: 0.3
                                }
                              }
                            }
                          }
                        }}
                        variant="splitted"
                        defaultSelectedKeys={[aid || appointments[0]?.aid]}
                        onSelectionChange={(selectedKeys) => {
                          const selectedValue = String(
                            Array.from(selectedKeys)[0]
                          );
                          if (selectedValue !== 'undefined') {
                            setAid(selectedValue);
                          } else {
                            setAid(null);
                          }
                        }}
                      >
                        {sortedItems.map((appointment) => {
                          const appointmentDate = new Date(appointment.date);
                          appointmentDate.setMinutes(
                            appointmentDate.getMinutes() + 15
                          );

                          return (
                            <AccordionItem
                              key={appointment.aid}
                              aria-label="Appointments"
                              title={
                                <div className="flex w-full gap-4">
                                  <div className="flex flex-col gap-2">
                                    <div className="flex min-w-24 max-w-24 flex-col gap-4 sm:min-w-40 sm:max-w-40">
                                      <div className="flex-col gap-4">
                                        <h4 className="text-xs text-default-500">
                                          On
                                        </h4>
                                        <p className="whitespace-nowrap font-semibold">
                                          {format(appointmentDate, 'PP')}
                                        </p>
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <h4 className="text-xs text-default-500">
                                          At
                                        </h4>
                                        <p className="whitespace-nowrap font-semibold">
                                          {format(appointment.date, 'p')}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex w-full flex-col gap-2 border-l-1 border-l-divider pl-4">
                                    <div className="flex items-center gap-2">
                                      {/* avatar for future use */}
                                      {/* <Avatar
                                      size="sm"
                                      radius="lg"
                                      src="https://i.pravatar.cc/150?u=a04258114e29026302d"
                                    /> */}

                                      <h4 className="text-default-500">
                                        {appointment.name}
                                      </h4>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      <h3 className="line-clamp-1 font-semibold">
                                        <span>
                                          {format(appointment.date, 'PP')}
                                        </span>
                                      </h3>
                                      <div className="flex items-center gap-2">
                                        <Tooltip
                                          showArrow
                                          content="Appointment ID"
                                          delay={500}
                                        >
                                          <Chip variant="bordered" radius="sm">
                                            #{appointment.aid}
                                          </Chip>
                                        </Tooltip>
                                        <Tooltip
                                          showArrow
                                          color={
                                            ChipColorMap[appointment.status]
                                          }
                                          content="Appointment Status"
                                          delay={500}
                                        >
                                          <Chip
                                            color={
                                              ChipColorMap[appointment.status]
                                            }
                                            radius="sm"
                                            variant="flat"
                                            className="capitalize"
                                          >
                                            {appointment.status}
                                          </Chip>
                                        </Tooltip>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              }
                              classNames={{
                                base: 'bg-background shadow-none border-divider border'
                              }}
                            >
                              <AccordionValue
                                appointment={appointment}
                                setAppointments={setAppointments}
                                session={session}
                              />
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function AccordionValue({
  appointment,
  setAppointments,
  session
}: {
  appointment: AppointmentType;
  setAppointments: any;
  session: any;
}) {
  const modal = useDisclosure();

  const [doctor, setDoctor] = useState<DoctorType>();
  const [user, setUser] = useState<UserType>();
  const [selectedModal, setSelectedModal] = useState<string>('');
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (appointment?.doctor) {
        await getDoctorWithUID(appointment?.doctor).then((doctor) => {
          setDoctor(doctor as DoctorType);
        });
      }
      if (appointment?.uid) {
        await getUserWithUID(appointment?.uid).then((user) => {
          setUser(user as UserType);
        });
      }
    };
    fetchData();
  }, []);

  const buttonColorMap: Record<string, ButtonProps['color']> = {
    cancel: 'danger',
    reschedule: 'warning',
    download: 'default',
    complete: 'success',
    accept: 'success'
  };
  const modalMap: Record<string, JSX.Element> = {
    cancel: (
      <CancelAppointment
        appointment={appointment}
        modal={modal}
        setAppointments={setAppointments}
      />
    ),
    download: <div>Download</div>,
    reschedule: (
      <RescheduleAppointment
        appointment={appointment}
        modal={modal}
        setAppointments={setAppointments}
      />
    ),
    addToCalendar: <AddtoCalendar appointment={appointment} />
  };

  function handleButtonClick(action: string) {
    if (action === 'download') {
      toast.success('Downloading reports');
      return;
    }

    setSelectedModal(action);
    modal.onOpen();
  }

  const genderMap: Record<string, string> = {
    male: 'fluent-emoji:male-sign',
    female: 'fluent-emoji:female-sign',
    other: 'fluent-emoji:transgender-symbol'
  };

  return (
    <>
      <div className="flex w-full gap-4">
        <div className="flex min-w-24 max-w-24 flex-col justify-between gap-8 sm:min-w-40 sm:max-w-40">
          <CellValue label="Indian Standard Time" value="UTC +05:30" />
          {['booked', 'confirmed', 'in-progress'].includes(
            appointment.status
          ) &&
            ['doctor', 'user'].includes(session.user.role) && (
              <Button
                color="secondary"
                variant="bordered"
                onPress={() => handleButtonClick('addToCalendar')}
                startContent={<Icon icon="solar:calendar-bold" />}
              >
                Add to Calendar
              </Button>
            )}
        </div>
        <div className="flex w-full flex-col border-l-1 border-l-divider pl-4">
          <div className="flex flex-col sm:flex-row sm:gap-8">
            <CellValue
              label="Gender"
              value={
                <div className="flex items-center gap-1">
                  <Icon icon={genderMap[user?.gender || 'male']} />
                  <span className="capitalize">{user?.gender}</span>
                </div>
              }
            />
            <CellValue label="Phone" value={`+91 ${appointment.phone}`} />
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-8">
            <CellValue label="Email" value={appointment.email} />
            <CellValue label="Phone" value={`+91 ${appointment.phone}`} />
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-8">
            <CellValue label="Doctor" value={doctor?.name} />
            <CellValue
              label="Location"
              value={<p className="capitalize">{appointment.type}</p>}
            />
          </div>
          {appointment.notes && (
            <CellValue label="Appointment Notes" value={appointment?.notes} />
          )}
          <CellValue
            label={`Created at: ${format(appointment?.createdAt as Date, 'PPp')}`}
            value={null}
          />
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <div className="flex w-full items-center gap-2">
              {['booked', 'confirmed', 'overdue'].includes(
                appointment.status
              ) && (
                <Button
                  color={buttonColorMap['reschedule']}
                  onPress={() => handleButtonClick('reschedule')}
                  variant="flat"
                  className="w-full sm:w-fit"
                  startContent={<Icon icon="solar:calendar-bold" />}
                >
                  Reschedule
                </Button>
              )}
            </div>
            <div className="flex w-full items-center gap-2 sm:w-fit">
              {['completed'].includes(appointment.status) && (
                <Button
                  className="w-full sm:w-fit"
                  variant="bordered"
                  color={buttonColorMap['download']}
                >
                  <Icon icon="solar:download-minimalistic-bold" />
                  Download
                </Button>
              )}
              {[
                'booked',
                'overdue',
                'confirmed',
                'in-progress',
                'on-hold'
              ].includes(appointment.status) && (
                <Button
                  className="w-full sm:w-fit"
                  color={buttonColorMap['cancel']}
                  onPress={() => handleButtonClick('cancel')}
                  variant="bordered"
                  startContent={<Icon icon="tabler:x" />}
                >
                  Cancel
                </Button>
              )}
              {['in-progress', 'confirmed', 'on-hold'].includes(
                appointment.status
              ) &&
                ['doctor', 'admin'].includes(session.user.role) && (
                  <Button
                    className="w-full sm:w-fit"
                    color={buttonColorMap['complete']}
                    variant="flat"
                    as={Link}
                    href={`/appointments/${appointment.uid}/complete`}
                    endContent={<Icon icon="tabler:arrow-right" />}
                  >
                    Proceed
                  </Button>
                )}

              {['booked'].includes(appointment.status) &&
                ['doctor', 'admin'].includes(session.user.role) && (
                  <Button
                    className="w-full sm:w-fit"
                    color={buttonColorMap['accept']}
                    variant="flat"
                    isLoading={isConfirming}
                    startContent={<Icon icon="tabler:check" />}
                    onPress={async () => {
                      setIsConfirming(true);
                      await changeAppointmentStatus(
                        appointment._id,
                        'confirmed'
                      )
                        .then(() => {
                          toast.success('Appointment confirmed');
                          setAppointments((prev: AppointmentType[]) => {
                            const updatedAppointments = prev.map((item) => {
                              if (item._id === appointment._id) {
                                return {
                                  ...item,
                                  status: 'confirmed'
                                };
                              }
                              return item;
                            });
                            return updatedAppointments;
                          });
                        })
                        .catch((error) => {
                          console.error(error);
                          toast.error('An error occurred');
                        })
                        .finally(() => {
                          setIsConfirming(false);
                        });
                    }}
                  >
                    Accept
                  </Button>
                )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        scrollBehavior="inside"
        backdrop="blur"
        isOpen={modal.isOpen}
        onOpenChange={modal.onOpenChange}
        size={selectedModal === 'reschedule' ? '3xl' : undefined}
      >
        <ModalContent className="w-full">
          {modalMap[selectedModal] || <></>}
        </ModalContent>
      </Modal>
    </>
  );
}

const LoadingSkeleton = () => {
  return (
    <>
      <Card className="w-full flex-row gap-4 p-4 sm:gap-8">
        <div className="flex flex-col items-start justify-start gap-4">
          <Skeleton className="h-6 w-36" />
          <div className="flex gap-2">
            <div className="flex flex-col items-start gap-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="hidden flex-col items-start gap-2 sm:flex">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-6 w-full max-w-lg" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </Card>
    </>
  );
};

export type CellValueProps = React.HTMLAttributes<HTMLDivElement> & {
  label: string;
  value: React.ReactNode;
};

const CellValue = React.forwardRef<HTMLDivElement, CellValueProps>(
  ({ label, value, children, ...props }, ref) => (
    <div ref={ref} className="flex flex-col py-1 sm:py-2" {...props}>
      <div className="text-xs text-default-500">{label}</div>
      <div className="text-small font-medium">{value || children}</div>
    </div>
  )
);

CellValue.displayName = 'CellValue';

function CancelAppointment({
  appointment,
  modal,
  setAppointments
}: {
  appointment: AppointmentType;
  modal: any;
  setAppointments: any;
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <ModalHeader className="flex-col items-start gap-4">
        <h2 className="mt-4 max-w-xs text-center text-base">
          Cancel Appointment
        </h2>
        <p className="text-sm font-light">
          This appointment will be cancelled and the patient will be notified.
        </p>
      </ModalHeader>
      <ModalBody>
        <Alert
          color="danger"
          title={<p>This action is not reversible. Please be certain.</p>}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          fullWidth
          color="default"
          onPress={() => {
            modal.onClose();
          }}
        >
          Cancel
        </Button>
        <Button
          fullWidth
          color="danger"
          variant="flat"
          isLoading={isLoading}
          onPress={async () => {
            setIsLoading(true);
            await changeAppointmentStatus(appointment._id, 'cancelled')
              .then(() => {
                setAppointments((prev: AppointmentType[]) => {
                  const updatedAppointments = prev.filter(
                    (item) => item._id !== appointment._id
                  );
                  return updatedAppointments;
                });
                toast.success('Appointment cancelled');
                modal.onClose();
              })
              .catch((error) => {
                console.error(error);
                toast.error('An error occurred');
              })
              .finally(() => {
                setIsLoading(false);
              });
          }}
        >
          Confirm
        </Button>
      </ModalFooter>
    </>
  );
}

function RescheduleAppointment({
  appointment,
  modal,
  setAppointments
}: {
  appointment: AppointmentType;
  modal: any;
  setAppointments: any;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { locale } = useLocale();

  const [date, setDate] = useState(today(getLocalTimeZone()));
  const [focusedDate, setFocusedDate] = useState<CalendarDate | null>(date);

  // const slotParam = searchParams.get('slot');
  const [slotParam, setSlotParam] = useQueryState('slot');
  const [dateParam, setDateParam] = useQueryState('date');

  const timeZone = getLocalTimeZone();
  const weeksInMonth = getWeeksInMonth(focusedDate as DateValue, locale);

  const handleChangeDate = (date: DateValue) => {
    setDate(date as CalendarDate);
    const formattedDate = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;

    setDateParam(formattedDate);
  };

  const handleChangeAvailableTime = (time: string) => {
    const timeValue = time.split(':').join(' ');

    const match = timeValue.match(/^(\d{1,2}) (\d{2})([ap]m)?$/i);
    if (!match) {
      console.error('Invalid time format');
      return null;
    }

    let hours = Number.parseInt(match[1]);
    const minutes = Number.parseInt(match[2]);
    const isPM = match[3] && match[3].toLowerCase() === 'pm';

    if (isPM && (hours < 1 || hours > 12)) {
      console.error('Time out of range (1-12) in 12-hour format');
      return null;
    }

    if (isPM && hours !== 12) {
      hours += 12;
    } else if (!isPM && hours === 12) {
      hours = 0;
    }

    const currentDate = date.toDate(timeZone);
    currentDate.setHours(hours, minutes);

    if (currentDate.toISOString() < new Date().toISOString()) {
      toast.error('Cannot book appointments in the past');
      return;
    }

    setSlotParam(currentDate.toISOString());
  };

  return (
    <>
      <ModalHeader className="flex-col items-start gap-4">
        <h2 className="mt-4 max-w-xs text-center text-base">
          Reschedule Appointment
        </h2>
        <p className="text-sm font-light">
          This appointment will be rescheduled and the patient will be notified.
        </p>
      </ModalHeader>
      <ModalBody className="flex w-full flex-col items-center lg:flex-row">
        <Calendar
          minValue={today(getLocalTimeZone())}
          defaultValue={today(getLocalTimeZone())}
          value={date}
          onChange={handleChangeDate}
          onFocusChange={(focused) => setFocusedDate(focused)}
        />
        <RightPanel
          {...{ date, timeZone, weeksInMonth, handleChangeAvailableTime }}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          fullWidth
          color="default"
          onPress={() => {
            modal.onClose();
          }}
        >
          Cancel
        </Button>
        <Button
          fullWidth
          color="warning"
          variant="flat"
          isLoading={isLoading}
          onPress={async () => {
            if (!slotParam) {
              toast.error('Please select a time slot');
              return;
            }
            setIsLoading(true);
            await rescheduleAppointment(appointment.aid, slotParam)
              .then(() => {
                setAppointments((prev: AppointmentType[]) => {
                  const updatedAppointments = prev.map((item) => {
                    if (item._id === appointment._id) {
                      return {
                        ...item,
                        date: new Date(slotParam),
                        status: 'booked'
                      };
                    }
                    return item;
                  });
                  return updatedAppointments;
                });
                // remove query params
                setSlotParam(null);
                setDateParam(null);
                toast(
                  `Appointment Rescheduled to ${format(new Date(slotParam), 'PPp')}`
                );
                modal.onClose();
              })
              .catch((error) => {
                console.error(error);
                toast.error('An error occurred');
              });
          }}
          isDisabled={!slotParam}
        >
          Reschedule
        </Button>
      </ModalFooter>
    </>
  );
}

function AddtoCalendar({ appointment }: { appointment: AppointmentType }) {
  type ActionType = 'google' | 'outlook' | 'download';

  const [selectedOption, setSelectedOption] = useState(new Set(['google']));
  const selectedOptionValue = Array.from(selectedOption)[0] as ActionType;

  const labelsMap = {
    google: 'Add to Google Calendar',
    outlook: 'Add to Outlook Calendar',
    download: 'Download ICS File'
  };

  const buttonIconMap = {
    google: 'logos:google-calendar',
    outlook: 'vscode-icons:file-type-outlook',
    download: 'solar:download-square-bold'
  };

  const appointmentDate = new Date(appointment.date);
  appointmentDate.setMinutes(appointmentDate.getMinutes() + 15);

  const event: EventType = {
    title: 'Appointment with ' + appointment.name,
    description: 'Appointment with ' + appointment.name,
    location: appointment.type === 'online' ? 'Online' : 'Clinic',
    start: new Date(appointment.date),
    end: new Date(appointmentDate),
    duration: [1, 'hour'],
    busy: true
  };

  const handleSubmit = (action: ActionType) => {
    switch (action) {
      case 'google':
        addToGoogleCalendar(event);
        break;
      case 'outlook':
        addToOutlookCalendar(event);
        break;
      case 'download':
        handleAddToCalendar(event);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <ModalHeader className="flex-col items-start gap-2">
        <h2 className="max-w-xs text-center text-base">Add to Calendar</h2>
        <p className="text-sm font-normal text-default-500">
          Add this appointment to your calendar by downloading the{' '}
          <span className="font-medium text-foreground">event file</span> or
          adding it to your{' '}
          <span className="font-medium text-foreground">Google</span> or{' '}
          <span className="font-medium text-foreground">Outlook</span> calendar
        </p>
      </ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-4">
          <ButtonGroup fullWidth variant="flat">
            <Button
              onPress={() => handleSubmit(selectedOptionValue)}
              startContent={<Icon icon={buttonIconMap[selectedOptionValue]} />}
              color="primary"
              variant="flat"
            >
              {labelsMap[selectedOptionValue]}
            </Button>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button variant="solid" color="primary" isIconOnly>
                  <Icon icon="mynaui:chevron-down-solid" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                autoFocus={false}
                aria-label="Appointment Options"
                className="max-w-[300px]"
                selectedKeys={selectedOption}
                selectionMode="single"
                onSelectionChange={(keys) =>
                  setSelectedOption(keys as Set<string>)
                }
              >
                <DropdownItem key="google">{labelsMap['google']}</DropdownItem>
                <DropdownItem key="outlook">
                  {labelsMap['outlook']}
                </DropdownItem>
                <DropdownItem key="download">
                  {labelsMap['download']}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </ButtonGroup>
        </div>
      </ModalBody>
    </>
  );
}

const sortOptions = [
  { name: 'UPCOMING', uid: 'upcoming' },
  { name: 'APPOINTMENT DATE', uid: 'date' },
  { name: 'NAME', uid: 'name' },
  { name: 'STATUS', uid: 'status' },
  { name: 'BOOKING DATE', uid: 'createdAt' }
];

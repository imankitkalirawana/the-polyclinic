'use client';
import { useEffect, useState } from 'react';
import React from 'react';
import {
  type CalendarDate,
  DateValue,
  getLocalTimeZone,
  getWeeksInMonth,
  today
} from '@internationalized/date';
import { useLocale } from '@react-aria/i18n';

import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Appointment } from '@/lib/interface';
import { humanReadableDate, humanReadableTime } from '@/lib/utility';
import {
  Alert,
  Button,
  ButtonGroup,
  ButtonProps,
  Card,
  CardFooter,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure
} from '@nextui-org/react';
import {
  changeAppointmentStatus,
  getDoctorWithUID,
  rescheduleAppointment
} from '@/functions/server-actions';
import { DoctorType } from '@/models/Doctor';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar } from '../calendar';
import { RightPanel } from './new/calendar/right-panel';

interface AppointmentCardProps {
  appointment: Appointment;
  session: any;
}

export default function AppointmentCard({
  appointment,
  session
}: AppointmentCardProps) {
  const role = session?.user?.role;

  const [adjustedProgress, setAdjustedProgress] = useState(0);
  const [doctor, setDoctor] = useState<DoctorType | null>({} as DoctorType);

  useEffect(() => {
    const fetchData = async () => {
      if (appointment?.doctor) {
        await getDoctorWithUID(appointment?.doctor).then((doctor) => {
          setDoctor(doctor as DoctorType);
        });
      }
    };
    fetchData();
  }, []);

  const totalTime =
    (new Date(appointment?.date) as any) -
    (new Date(appointment?.createdAt) as any);

  const timePassed =
    (new Date() as any) - (new Date(appointment?.createdAt) as any);

  const timeLeft = totalTime - timePassed;

  useEffect(() => {
    const progress = (timePassed / totalTime) * 100;
    if (appointment.status === 'completed') {
      setAdjustedProgress(100);
      return;
    }
    if (appointment.status === 'cancelled') {
      setAdjustedProgress(0);
      return;
    }
    if (appointment.status === 'overdue') {
      setAdjustedProgress(101);
      return;
    }

    if (progress < 100) {
      setAdjustedProgress(progress);
    }
  }, []);

  if (!appointment) return null;

  return (
    <Card className="relative w-full min-w-72 overflow-hidden rounded-3xl">
      <div
        className={cn(
          'absolute right-2 z-10 h-16 w-5 bg-default-500',
          getStatusStripBackgroundClass(appointment.status)
        )}
      >
        <div className="absolute -bottom-2 z-0 h-4 w-full rotate-45 bg-background"></div>
      </div>

      <div className="flex h-full flex-col justify-start">
        <div
          className={cn(
            'relative w-full bg-default-200 px-4 pb-2 pt-4',
            getStatusBackgroundClass(appointment.status)
          )}
        >
          <div className="absolute right-2 top-0 flex h-full w-5 justify-center"></div>
          <p className="flex items-center justify-between gap-2 pr-4 text-xl font-bold">
            <span>{humanReadableDate(appointment.date)}</span>
            <span className="text-sm font-normal">
              {humanReadableTime(appointment.date)}
            </span>
          </p>
        </div>

        <div className="px-4 pt-2">
          <p
            className={cn(
              'w-full capitalize',
              getStatusTextColorClass(appointment.status)
            )}
          >
            {appointment.status}
          </p>
          <div className="relative mx-0.5 mb-6 mt-5 bg-default-400">
            <div
              className={cn(
                'absolute left-0 top-1/2 z-20 size-3 -translate-y-1/2 rounded-full',
                getProgressColorClass(adjustedProgress)
              )}
            ></div>
            <div className="absolute right-0 top-1/2 z-10 size-3 -translate-y-1/2 rounded-full bg-default-400"></div>
            <div
              className={cn(
                'relative h-0.5 transition-all ease-in-out [transition-duration:500ms]',
                getProgressColorClass(adjustedProgress)
              )}
              style={{
                width: `${adjustedProgress}%`
              }}
            >
              <Tooltip
                color={
                  adjustedProgress <= 30
                    ? 'default'
                    : adjustedProgress > 30
                      ? 'warning'
                      : adjustedProgress >= 80
                        ? 'warning'
                        : adjustedProgress >= 100
                          ? 'success'
                          : adjustedProgress == 101
                            ? 'danger'
                            : adjustedProgress == 102
                              ? 'danger'
                              : 'default'
                }
                isDisabled={adjustedProgress > 100}
                content={`${parseInt(adjustedProgress as any)}%`}
              >
                <Icon
                  icon="solar:test-tube-broken"
                  className={cn(
                    'absolute right-0 top-1/2 z-50 size-8 -translate-y-1/2 translate-x-1/2 rounded-full p-1.5 transition-all duration-500',
                    getProgressColorClass(adjustedProgress, true)
                  )}
                />
              </Tooltip>
            </div>
          </div>

          <div className="my-1 flex flex-col gap-1 tracking-tight text-default-400">
            {doctor && session.user.role === 'user' ? (
              <div className="flex items-center gap-1">
                <Icon icon="maki:doctor" />
                <span className="line-clamp-1 text-sm leading-none">
                  {doctor?.name}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Icon icon="maki:patient" />
                <span className="line-clamp-1 text-sm leading-none">
                  {appointment.name} #{appointment.uid}
                </span>
              </div>
            )}
            {timeLeft > 0 &&
              !(
                appointment.status === 'cancelled' ||
                appointment.status === 'completed'
              ) && (
                <div className="flex items-center gap-1">
                  <Icon icon="solar:clock-circle-broken" />
                  <span className="text-sm leading-none">
                    {showTimeLeft(timeLeft)}
                  </span>
                </div>
              )}
          </div>
        </div>
      </div>
      <CardFooterWrapper appointment={appointment} session={session} />
    </Card>
  );
}

function CardFooterWrapper({
  appointment,
  session
}: {
  appointment: Appointment;
  session: any;
}) {
  const modal = useDisclosure();
  const router = useRouter();

  type ActionType = 'cancel' | 'reschedule' | 'download' | 'complete';

  const [selectedModal, setSelectedModal] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState(new Set(['cancel']));
  const selectedOptionValue = Array.from(selectedOption)[0] as ActionType;

  const labelsMap = {
    cancel: 'Cancel Appointment',
    reschedule: 'Reschedule Appointment',
    download: 'Download Reports',
    complete: 'Complete Appointment'
  };
  const buttonColorMap: Record<string, ButtonProps['color']> = {
    cancel: 'danger',
    reschedule: 'warning',
    download: 'default',
    complete: 'success'
  };
  const modalMap: Record<string, JSX.Element> = {
    cancel: <CancelAppointment appointment={appointment} modal={modal} />,
    download: <div>Download</div>,
    reschedule: (
      <RescheduleAppointment appointment={appointment} modal={modal} />
    )
  };

  function handleButtonClick(action: string) {
    if (action === 'download') {
      toast.success('Downloading reports');
      return;
    }
    if (action === 'complete') {
      router.push(`/appointments/${appointment._id}/complete`);
      return;
    }
    setSelectedModal(action);
    modal.onOpen();
  }

  const allowedRolesForComplete = ['admin', 'doctor', 'receptionist'];

  return (
    appointment.status !== 'cancelled' && (
      <>
        <CardFooter className="gap-2">
          <ButtonGroup fullWidth variant="flat">
            <Button
              color={buttonColorMap[selectedOptionValue]}
              onPress={() => handleButtonClick(selectedOptionValue)}
            >
              {labelsMap[selectedOptionValue]}
            </Button>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  color={buttonColorMap[selectedOptionValue]}
                  variant="solid"
                  isIconOnly
                >
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
                {['booked', 'overdue', 'confirmed'].includes(
                  appointment.status
                ) ? (
                  <DropdownItem key="cancel" color={buttonColorMap['cancel']}>
                    {labelsMap['cancel']}
                  </DropdownItem>
                ) : null}
                {['booked', 'overdue'].includes(appointment.status) ? (
                  <DropdownItem
                    key="reschedule"
                    color={buttonColorMap['reschedule']}
                  >
                    {labelsMap['reschedule']}
                  </DropdownItem>
                ) : null}
                {['completed'].includes(appointment.status) ? (
                  <DropdownItem
                    key="download"
                    color={buttonColorMap['download']}
                  >
                    {labelsMap['download']}
                  </DropdownItem>
                ) : null}
                {['in-progress', 'booked', 'on-hold'].includes(
                  appointment.status
                ) && allowedRolesForComplete.includes(session.user.role) ? (
                  <DropdownItem
                    key="complete"
                    color={buttonColorMap['complete']}
                  >
                    {labelsMap['complete']}
                  </DropdownItem>
                ) : null}
              </DropdownMenu>
            </Dropdown>
          </ButtonGroup>
        </CardFooter>
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
    )
  );
}

function CancelAppointment({
  appointment,
  modal
}: {
  appointment: Appointment;
  modal: any;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
                toast.success('Appointment cancelled');
                modal.onClose();
                router.refresh();
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
  modal
}: {
  appointment: Appointment;
  modal: any;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLocale();

  const [date, setDate] = useState(today(getLocalTimeZone()));
  const [focusedDate, setFocusedDate] = useState<CalendarDate | null>(date);

  const slotParam = searchParams.get('slot');

  const timeZone = getLocalTimeZone();
  const weeksInMonth = getWeeksInMonth(focusedDate as DateValue, locale);

  const handleChangeDate = (date: DateValue) => {
    setDate(date as CalendarDate);
    const formattedDate = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;

    const url = new URL(window.location.href);
    url.searchParams.set('date', formattedDate);
    router.push(url.toString());
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

    const url = new URL(window.location.href);
    url.searchParams.set('slot', currentDate.toISOString());
    router.push(url.toString());
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
            await rescheduleAppointment(appointment._id, slotParam).then(() => {
              toast.success('Appointment rescheduled');
              modal.onClose();
              router.push('/appointments');
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

// Utility Functions
const getStatusBackgroundClass = (status: string) => {
  switch (status) {
    case 'cancelled':
      return `bg-danger-200`;
    case 'on-hold':
      return `bg-warning-200`;
    case 'completed':
      return `bg-success-200`;
    case 'booked':
      return `bg-default-200`;
    case 'in-progress':
      return `bg-blue-200`;
    case 'overdue':
      return `bg-danger-200`;
    default:
      return `bg-default-200`;
  }
};

const getStatusStripBackgroundClass = (status: string) => {
  switch (status) {
    case 'cancelled':
      return `bg-danger-500`;
    case 'on-hold':
      return `bg-warning-500`;
    case 'completed':
      return `bg-success-500`;
    case 'booked':
      return `bg-default-500`;
    case 'in-progress':
      return `bg-blue-500`;
    case 'overdue':
      return `bg-danger-500`;
    default:
      return `bg-default-500`;
  }
};

const getStatusTextColorClass = (status: string) => {
  switch (status) {
    case 'cancelled':
      return 'text-red-500';
    case 'on-hold':
      return 'text-warning-500';
    case 'completed':
      return 'text-success-500';
    case 'booked':
      return 'text-default-500';
    case 'in-progress':
      return 'text-blue-500';
    case 'overdue':
      return 'text-danger-500';
    default:
      return 'text-default-500';
  }
};

const getProgressColorClass = (
  progress: number,
  isForeground = false
): string => {
  const styles = [
    {
      range: [0, 30],
      background: 'bg-default-200',
      foreground: 'bg-default-200 text-default-foreground'
    },
    {
      range: [30, 60],
      background: 'bg-warning-500',
      foreground: 'bg-warning-500 text-warning-foreground'
    },
    {
      range: [60, 80],
      background: 'bg-warning-500',
      foreground: 'bg-warning-500 text-warning-foreground'
    },
    {
      range: [80, 100],
      background: 'bg-success-500',
      foreground: 'bg-success-500 text-success-foreground'
    },
    {
      range: [100, 101],
      background: 'bg-success-300',
      foreground: 'bg-success-300 text-success-foreground'
    },
    {
      range: [101, 102],
      background: 'bg-danger-400',
      foreground: 'bg-danger-400 text-danger-foreground'
    },
    {
      range: [102, Infinity],
      background: 'bg-danger-500',
      foreground: 'bg-danger-500 text-danger-foreground'
    }
  ];

  const style = styles.find(
    ({ range }) => progress >= range[0] && progress < range[1]
  );
  return style ? (isForeground ? style.foreground : style.background) : '';
};

const showTimeLeft = (timeLeft: number) => {
  // display time left in human readable format like 30 minutes left || 1 hour left || 1 day left

  const seconds = Math.floor(timeLeft / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} left`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} left`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} left`;
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''} left`;
  }
};

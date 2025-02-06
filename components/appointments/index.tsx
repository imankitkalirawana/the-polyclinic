'use client';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Link,
  Tooltip
} from '@heroui/react';
import Skeleton from '../ui/skeleton';
import Heading from '../ui/heading';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useQueryState } from 'nuqs';
import React from 'react';
import { format } from 'date-fns';
import NoResults from '../ui/no-results';
import { AppointmentType } from '@/models/Appointment';
import { capitalize } from '@/lib/utility';
import { ChipColorMap } from '@/lib/maps';
import AppointmentDetail from './appointment-detail';
import AsyncComponent from '@/hooks/useAsyncLoading';
import { getDoctorWithUID } from '@/functions/server-actions';
import { useSession } from 'next-auth/react';

export default function Appointments({ session }: { session: any }) {
  // useSession({
  //   required: true
  // });

  const [status, setStatus] = useQueryState('status', {
    defaultValue: 'upcoming'
  });
  const [sort, setSort] = useQueryState('sort', {
    defaultValue: 'upcoming'
  });
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

  const filteredAppointment = useMemo(() => {
    let filteredItems = [...appointments];

    if (searchQuery) {
      filteredItems = filteredItems.filter((item) => {
        const searchValue = searchQuery.toLowerCase();
        return (
          item.patient?.name?.toLowerCase().includes(searchValue) ||
          item.patient?.email?.toLowerCase().includes(searchValue) ||
          item.patient?.phone?.toLowerCase().includes(searchValue)
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
          new Date(a.createdAt as string).getTime() -
          new Date(b.createdAt as string).getTime()
        );
      }
      if (sort === 'name') {
        return a.patient?.name.localeCompare(b.patient?.name);
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
                      >
                        {sortedItems.map((appointment) => {
                          return (
                            <AccordionItem
                              key={appointment.aid}
                              aria-label="Appointments"
                              title={
                                <div className="flex w-full gap-4">
                                  <div className="hidden flex-col gap-2 sm:flex">
                                    <div className="flex min-w-24 max-w-24 flex-col gap-4 sm:min-w-40 sm:max-w-40">
                                      <div className="flex-col gap-4">
                                        <h4 className="text-xs text-default-500">
                                          On
                                        </h4>
                                        <p className="whitespace-nowrap font-semibold">
                                          {format(appointment.date, 'PP')}
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

                                  <div className="flex w-full flex-col gap-2 border-l-divider sm:border-l sm:pl-4">
                                    <div className="flex items-center gap-2">
                                      {/* avatar for future use */}
                                      {/* <Avatar
                                      size="sm"
                                      radius="lg"
                                      // src="https://i.pravatar.cc/150?u=a04258114e29026302d"
                                    /> */}

                                      <h4 className="line-clamp-1 text-default-500">
                                        {appointment.patient?.name}
                                        {appointment.doctor && (
                                          <span className="text-default-500">
                                            {' '}
                                            {appointment.doctor?.name &&
                                              ` with  ${appointment.doctor?.name}`}
                                          </span>
                                        )}
                                      </h4>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      <h3 className="line-clamp-1 font-semibold">
                                        <span className="hidden sm:block">
                                          Booked on{' '}
                                          {format(appointment.createdAt, 'PP')}
                                        </span>
                                        <span className="sm:hidden">
                                          On {format(appointment.date, 'PPp')}
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
                              <AppointmentDetail
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

const sortOptions = [
  { name: 'UPCOMING', uid: 'upcoming' },
  { name: 'APPOINTMENT DATE', uid: 'date' },
  { name: 'NAME', uid: 'name' },
  { name: 'STATUS', uid: 'status' },
  { name: 'BOOKING DATE', uid: 'createdAt' }
];

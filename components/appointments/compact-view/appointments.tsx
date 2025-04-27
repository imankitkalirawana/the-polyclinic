'use client';

import { useEffect, useRef } from 'react';
import { format, subMinutes } from 'date-fns';
import { useQueryState } from 'nuqs';
import {
  Avatar,
  Button,
  Card,
  cn,
  Link,
  ScrollShadow,
  Spinner,
  Tooltip,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

import AppointmentDetailsModal from './appointment-details-modal';
import { useForm } from './context';
import StatusReferences from './status-references';

import CalendarWidget from '@/components/ui/calendar-widget';
import { AppointmentType, AType } from '@/models/Appointment';

// Get background and icon colors based on appointment type
export const getAppointmentStyles = (status: AppointmentType['status']) => {
  switch (status) {
    case 'booked':
      return {
        background: 'bg-orange-50',
        avatarBg: 'bg-orange-100',
        avatar: 'text-orange-500',
        iconBg: 'bg-orange-500',
        icon: 'text-white',
      };
    case 'confirmed':
      return {
        background: 'bg-cyan-50',
        avatarBg: 'bg-cyan-100',
        avatar: 'text-cyan-500',
        iconBg: 'bg-cyan-500',
        icon: 'text-white',
      };
    case 'in-progress':
      return {
        background: 'bg-blue-50',
        avatarBg: 'bg-blue-100',
        avatar: 'text-blue-500',
        iconBg: 'bg-blue-500',
        icon: 'text-white',
      };
    case 'completed':
      return {
        background: 'bg-success-50',
        avatarBg: 'bg-success-100',
        avatar: 'text-success-500',
        iconBg: 'bg-success-500',
        icon: 'text-white',
      };
    case 'cancelled':
      return {
        background: 'bg-red-50',
        avatarBg: 'bg-red-100',
        avatar: 'text-red-500',
        iconBg: 'bg-red-500',
        icon: 'text-white',
      };
    case 'overdue':
      return {
        background: 'bg-pink-50',
        avatarBg: 'bg-pink-100',
        avatar: 'text-pink-500',
        iconBg: 'bg-pink-500',
        icon: 'text-white',
      };
    case 'on-hold':
      return {
        background: 'bg-yellow-50',
        avatarBg: 'bg-yellow-100',
        avatar: 'text-yellow-500',
        iconBg: 'bg-yellow-500',
        icon: 'text-white',
      };
    default:
      return {
        background: 'bg-default-50',
        avatarBg: 'bg-default-100',
        avatar: 'text-default-500',
        iconBg: 'bg-default-500',
        icon: 'text-white',
      };
  }
};

const TypeIcon: Record<AType, string> = {
  consultation: 'solar:stethoscope-bold',
  'follow-up': 'solar:clipboard-check-linear',
  emergency: 'solar:adhesive-plaster-linear',
};

export default function AppointmentsTimeline() {
  const { formik, appointments, isLoading } = useForm();
  const [date] = useQueryState('date', {
    defaultValue: new Date().toISOString().split('T')[0],
  });

  // Time slots for the timeline
  const timeSlots = Array.from(
    { length: 19 },
    (_, i) => `${Math.floor(i / 2) + 8}:${i % 2 === 0 ? '00' : '30'}`
  );

  const getCurrentTimePosition = () => {
    const now = new Date();
    // now.setHours(14, 0, 0);
    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = 8 * 60;
    const timelineHeight = 18 * 70;
    return Math.max(
      0,
      Math.min(
        ((totalMinutes - startMinutes) / (9 * 60)) * timelineHeight,
        timelineHeight
      )
    );
  };

  const convertISOTimetoTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const hours = d.getHours();
    const minutes = d.getMinutes();
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  // Ref for the scrollable container and first appointment element
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstAppointmentRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to the first appointment after appointments load
  useEffect(() => {
    // Only scroll if there is at least one appointment and the ref exists.
    if (
      appointments?.length &&
      scrollRef.current &&
      firstAppointmentRef.current
    ) {
      const container = scrollRef.current;
      const firstEl = firstAppointmentRef.current;
      const offsetTop = firstEl.offsetTop;

      container.scrollTo({
        top: offsetTop - 20, // Adjust the offset as needed
        behavior: 'smooth',
      });
    }
  }, [appointments]);

  return (
    <div className="mx-auto max-w-3xl p-4">
      {isLoading ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h2
              className={cn('text-2xl font-semibold text-default-900', {
                'text-default-500': !appointments.length,
              })}
            >
              {!appointments.length ? 'No' : appointments.length} Appointment
              {appointments.length > 1 ? 's' : ''} Scheduled
            </h2>
            <Link href="/appointments/all" className="text-primary">
              View all
            </Link>
          </div>

          <ScrollShadow
            className="relative max-h-[50vh] py-4 scrollbar-hide"
            ref={scrollRef}
          >
            <div className="absolute left-0 top-4 flex w-16 flex-col gap-[53.6px]">
              {timeSlots.map((time) => (
                <div key={time} className="text-xs text-default-500">
                  {time}
                </div>
              ))}
            </div>

            <div className="relative ml-16 border-l border-default-200">
              {timeSlots.map((time, index) => {
                return (
                  <div
                    key={`${time}-divider`}
                    className={`h-[70px] border-t border-default-200 ${
                      index % 2 === 0 ? 'border-solid' : 'border-dashed'
                    } `}
                  />
                );
              })}

              {format(new Date(date), 'yyyy-MM-dd') ===
                format(new Date(), 'yyyy-MM-dd') && (
                <Tooltip
                  content={format(new Date(), 'hh:mm a')}
                  showArrow
                  placement="left"
                  color="primary"
                >
                  <div
                    className="absolute left-0 z-[30] w-full border-t-2 border-primary shadow-lg"
                    style={{ top: `${getCurrentTimePosition()}px` }}
                  >
                    <div className="absolute -left-1.5 top-[-6.5px] h-3 w-3 rounded-full bg-primary" />
                  </div>
                </Tooltip>
              )}

              {/* Appointments */}
              {appointments
                ?.sort((a, b) => a.date.localeCompare(b.date))
                .map((appointment, index, sortedAppointments) => {
                  const styles = getAppointmentStyles(appointment.status);

                  let startTime = convertISOTimetoTime(appointment.date);
                  const [startHour, startMinute] = startTime
                    .split(':')
                    .map(Number);
                  const startTimeInMinutes = startHour * 60 + startMinute;
                  // Timeline starts at 8:00 AM (480 minutes)
                  const startY = startTimeInMinutes - 480;

                  let leftOffset = 16;
                  let width = '45%';
                  let overlappingCount = 0;
                  let overlappingAppointments: (typeof appointment)[] = [];
                  let remainingAppointments: (typeof appointment)[] = [];

                  // Find overlapping appointments
                  sortedAppointments.forEach((other, i) => {
                    if (i >= index) return;

                    const otherTime = convertISOTimetoTime(other.date);
                    const [otherHour, otherMinute] = otherTime
                      .split(':')
                      .map(Number);
                    const otherStart = otherHour * 60 + otherMinute;
                    const otherEnd = otherStart + 30;

                    if (
                      (startTimeInMinutes >= otherStart &&
                        startTimeInMinutes < otherEnd) ||
                      (otherStart >= startTimeInMinutes &&
                        otherStart < startTimeInMinutes + 50)
                    ) {
                      overlappingCount++;
                      overlappingAppointments.push(other);
                    }
                  });

                  // Skip rendering if this is the 3rd or later overlapping appointment
                  if (
                    overlappingCount >= 2 &&
                    overlappingAppointments.includes(
                      sortedAppointments[index - 1]
                    )
                  ) {
                    if (overlappingAppointments.length === 2) {
                      const remainingCount =
                        sortedAppointments.filter((apt) => {
                          const aptTime = convertISOTimetoTime(apt.date);
                          const [aptHour, aptMinute] = aptTime
                            .split(':')
                            .map(Number);
                          const aptStart = aptHour * 60 + aptMinute;
                          return Math.abs(aptStart - startTimeInMinutes) <= 30;
                        }).length - 2;

                      remainingAppointments = sortedAppointments.filter(
                        (apt, index) => {}
                      );

                      if (remainingCount > 0) {
                        return (
                          <Tooltip
                            key={`${appointment}-tooltip`}
                            placement="right"
                            content={
                              <CalendarWidget
                                appointments={remainingAppointments}
                                className="items-start"
                                isIcon
                              />
                            }
                            classNames={{
                              base: 'bg-transparent p-0',
                            }}
                            // isOpen
                            className="bg-transparent p-0"
                            shadow="none"
                          >
                            <Button
                              key={`more-${startTimeInMinutes}`}
                              className={cn(
                                'absolute left-4 z-[29] aspect-square rounded-large bg-default-100',
                                styles.background,
                                styles.avatar
                              )}
                              style={{
                                top: `${startY * 2.34}px`,
                                left: `${leftOffset + 420}px`,
                                // minHeight: '50px'
                              }}
                              isIconOnly
                              variant="flat"
                              // isIconOnly
                            >
                              {`+${remainingCount}`}
                            </Button>
                          </Tooltip>
                        );
                      }
                    }
                    return null;
                  }

                  if (overlappingCount > 0) {
                    leftOffset += overlappingCount * 160;
                    width = '45%';
                  }

                  // Mark appointment as past if it is less than current date minus 30 minutes
                  const isInPast =
                    new Date(appointment.date) < subMinutes(new Date(), 30);

                  return (
                    <Card
                      key={appointment.aid}
                      className={cn(
                        `absolute left-4 justify-center rounded-large px-2 py-1 hover:z-[29]`,
                        styles.background
                      )}
                      style={{
                        top: `${startY * 2.33}px`,
                        left: `${leftOffset}px`,
                        width,
                        minHeight: '50px',
                      }}
                      isPressable
                      onPress={() => {
                        formik.setFieldValue('selected', appointment);
                      }}
                      ref={index === 0 ? firstAppointmentRef : undefined}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        window.open(
                          `/appointments/${appointment.aid}`,
                          '_blank'
                        );
                      }}
                    >
                      {isInPast && (
                        <div className="absolute left-0 h-full w-full bg-background/50" />
                      )}
                      <div className="flex items-center justify-start gap-4">
                        <div className={`rounded-medium p-2 ${styles.iconBg}`}>
                          <Icon
                            icon={TypeIcon[appointment.type]}
                            className={`h-5 w-5 ${styles.icon}`}
                          />
                        </div>
                        <div className="flex flex-1 items-center justify-between">
                          <div className="flex flex-col items-start text-xs">
                            <h3 className="line-clamp-1 font-semibold capitalize text-default-900">
                              {appointment.patient.name}
                            </h3>
                            <p className="flex gap-1 text-default-500">
                              <span className="line-clamp-1 capitalize">
                                #{appointment.aid}
                              </span>
                              <span>•</span>
                              <span>
                                {format(new Date(appointment.date), 'HH:mm')}
                              </span>
                            </p>
                          </div>
                          <Avatar
                            size="sm"
                            radius="sm"
                            name={appointment.patient.name}
                            className={cn(styles.avatar, styles.avatarBg)}
                          />
                        </div>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </ScrollShadow>
          {/* a reference for colors */}
          <StatusReferences />
        </>
      )}
      {formik.values.selected && <AppointmentDetailsModal />}
    </div>
  );
}

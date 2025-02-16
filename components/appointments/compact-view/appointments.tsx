'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { Tag } from 'lucide-react';
import {
  Avatar,
  Card,
  cn,
  ScrollShadow,
  Spinner,
  Tooltip,
  Button,
  Link
} from '@heroui/react';
import { AppointmentType } from '@/models/Appointment';
import { format, addMinutes, subMinutes } from 'date-fns';
import { useQueryState } from 'nuqs';
import { useForm } from './context';
import AppointmentDetailsModal from './appointment-details-modal';

// Get background and icon colors based on appointment type
const getAppointmentStyles = (status: AppointmentType['status']) => {
  switch (status) {
    case 'booked':
      return {
        background: 'bg-default-50',
        avatarBg: 'bg-default-100',
        avatar: 'text-default-500',
        iconBg: 'bg-default-500',
        icon: 'text-white'
      };
    case 'confirmed':
      return {
        background: 'bg-green-50',
        avatarBg: 'bg-green-100',
        avatar: 'text-green-500',
        iconBg: 'bg-green-500',
        icon: 'text-white'
      };
    case 'in-progress':
      return {
        background: 'bg-blue-50',
        avatarBg: 'bg-blue-100',
        avatar: 'text-blue-500',
        iconBg: 'bg-blue-500',
        icon: 'text-white'
      };
    case 'completed':
      return {
        background: 'bg-success-50',
        avatarBg: 'bg-success-100',
        avatar: 'text-success-500',
        iconBg: 'bg-success-500',
        icon: 'text-white'
      };
    case 'cancelled':
      return {
        background: 'bg-danger-50',
        avatarBg: 'bg-danger-100',
        avatar: 'text-danger-500',
        iconBg: 'bg-danger-500',
        icon: 'text-white'
      };
    case 'overdue':
      return {
        background: 'bg-warning-50',
        avatarBg: 'bg-warning-100',
        avatar: 'text-warning-500',
        iconBg: 'bg-warning-500',
        icon: 'text-white'
      };
    case 'on-hold':
      return {
        background: 'bg-info-50',
        avatarBg: 'bg-info-100',
        avatar: 'text-info-500',
        iconBg: 'bg-info-500',
        icon: 'text-white'
      };
    default:
      return {
        background: 'bg-default-50',
        avatarBg: 'bg-default-100',
        avatar: 'text-default-500',
        iconBg: 'bg-default-500',
        icon: 'text-white'
      };
  }
};

export default function AppointmentsTimeline() {
  const { formik, appointments, isLoading } = useForm();
  const [date, setDate] = useQueryState('date', {
    defaultValue: new Date().toISOString().split('T')[0]
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
        behavior: 'smooth'
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
                'text-default-500': !appointments.length
              })}
            >
              {!appointments.length ? 'No' : appointments.length} Appointment
              {appointments.length > 1 ? 's' : ''} Scheduled
            </h2>
            <Link href="/appointments/all" className="text-primary">
              View all
            </Link>
          </div>

          <ScrollShadow className="relative max-h-96 py-4" ref={scrollRef}>
            <div className="absolute left-0 top-4 flex w-16 flex-col gap-[53.6px]">
              {timeSlots.map((time) => (
                <div key={time} className="text-xs text-default-500">
                  {time}
                </div>
              ))}
            </div>

            <div className="relative ml-16 border-l border-default-200">
              {timeSlots.map((_, index) => (
                <div
                  key={index}
                  className={`h-[70px] border-t border-default-200 ${
                    index % 2 === 0 ? 'border-solid' : 'border-dashed'
                  } `}
                />
              ))}

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

                  sortedAppointments.forEach((prev, i) => {
                    if (i >= index) return;

                    const prevTime = convertISOTimetoTime(prev.date);
                    const [prevHour, prevMinute] = prevTime
                      .split(':')
                      .map(Number);
                    const prevStart = prevHour * 60 + prevMinute;
                    const prevEnd = prevStart + 30;

                    if (
                      (startTimeInMinutes >= prevStart &&
                        startTimeInMinutes < prevEnd) ||
                      (prevStart >= startTimeInMinutes &&
                        prevStart < startTimeInMinutes + 50)
                    ) {
                      overlappingCount++;
                    }
                  });

                  if (overlappingCount > 0) {
                    leftOffset += overlappingCount * 160; // Shift based on overlap count
                    width = `${90 / (overlappingCount + 1)}%`; // Reduce width to fit multiple overlapping appointments
                  }

                  // Mark appointment as past if it is less than current date minus 30 minutes
                  const isInPast =
                    new Date(appointment.date) < subMinutes(new Date(), 30);

                  return (
                    <Card
                      key={appointment.aid}
                      className={cn(
                        `absolute left-4 justify-center rounded-xl px-2 py-1 hover:z-[29]`,
                        styles.background
                      )}
                      style={{
                        top: `${startY * 2.33}px`,
                        left: `${leftOffset}px`,
                        width,
                        minHeight: '50px'
                      }}
                      isPressable
                      onPress={() => {
                        formik.setFieldValue('selected', appointment);
                      }}
                      // Assign ref only to the first appointment (sorted by date)
                      ref={index === 0 ? firstAppointmentRef : undefined}
                    >
                      {isInPast && (
                        <div className="absolute left-0 z-[29] h-full w-full bg-background/50" />
                      )}
                      <div className="flex items-center gap-4">
                        <div className={`rounded-lg p-2 ${styles.iconBg}`}>
                          <Tag className={`h-5 w-5 ${styles.icon}`} />
                        </div>
                        <div className="flex-1 text-xs">
                          <h3 className="font-semibold capitalize text-default-900">
                            {appointment.patient.name}
                          </h3>
                          <p className="flex text-default-500">
                            <span className="line-clamp-1 capitalize">
                              {appointment.type}
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
                    </Card>
                  );
                })}
            </div>
          </ScrollShadow>
        </>
      )}
      <AppointmentDetailsModal />
    </div>
  );
}

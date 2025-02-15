'use client';

import { useMemo, useState } from 'react';
import { Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, Card, cn, ScrollShadow, Tooltip } from '@heroui/react';
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
  const { formik, appointments } = useForm();

  const [date] = useQueryState('date', {
    defaultValue: new Date().toISOString()
  });

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

  const convertISOTimetoTime = (date: string) => {
    const d = new Date(date);
    const hours = d.getHours();
    const minutes = d.getMinutes();
    return `${hours}:${minutes}`;
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) =>
        new Date(appointment.date).toDateString() ===
        new Date(date).toDateString()
    );
  }, [appointments, date]);

  return (
    <>
      <div className="mx-auto max-w-3xl p-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-default-900">
            {filteredAppointments.length} Appointments
          </h2>
          <Button variant="link" className="text-primary">
            View all
          </Button>
        </div>

        <ScrollShadow className="relative max-h-96 py-4">
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
                className={`h-[70px] border-b ${index % 2 === 0 ? 'border-dashed' : 'border-solid'} border-default-200`}
              />
            ))}

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

            {/* Appointments */}
            {filteredAppointments
              ?.sort((a, b) => a.date.localeCompare(b.date))
              .map((appointment, index, sortedAppointments) => {
                const styles = getAppointmentStyles(appointment.status);

                //  extract start time as HH:MM i.e 14:00 from the appointment.date which is like 2025-02-07T11:30:00.000Z in indian standard time
                let startTime = convertISOTimetoTime(appointment.date);

                const startTimeInMinutes =
                  parseInt(startTime.split(':')[0]) * 60 +
                  parseInt(startTime.split(':')[1]);
                const startY = startTimeInMinutes - 480;

                // **Detect Overlaps & Adjust Position**
                let leftOffset = 16;
                let width = '45%';
                let overlappingCount = 0;

                sortedAppointments.forEach((prev, i) => {
                  if (i >= index) return;

                  const prevStart =
                    parseInt(convertISOTimetoTime(prev.date).split(':')[0]) *
                      60 +
                    parseInt(convertISOTimetoTime(prev.date).split(':')[1]);
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

                // date is in past if it is less than current date also check for the date
                let isInPast =
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
      </div>
      <AppointmentDetailsModal />
    </>
  );
}

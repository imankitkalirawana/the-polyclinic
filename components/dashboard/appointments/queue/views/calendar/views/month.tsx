'use client';

import React from 'react';
import { useSession } from '@/libs/providers/session-provider';
import { Tooltip } from '@heroui/react';
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isPast,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { parseAsIsoDateTime, parseAsStringEnum, useQueryState } from 'nuqs';

import { allowedRolesToCreateAppointment, MAX_APPOINTMENTS_IN_CELL } from '../data';
import { viewTypes } from '../types';
import AppointmentList from '../ui/appointment-list';
import AppointmentTriggerItem from '../ui/appointment-trigger-item';
import DateChip from '../ui/date-chip';

import { TIMINGS } from '@/libs/config';
import { cn } from '@heroui/react';
import { useAppointmentStore } from '@/services/client/appointment/appointment.store';
import { AppointmentQueue } from '@repo/store';
import { UserRole } from '@repo/store';

interface MonthViewProps {
  appointments: AppointmentQueue[];
  onTimeSlotClick: (date: Date) => void;
}

export function MonthView({ appointments, onTimeSlotClick }: MonthViewProps) {
  const { user } = useSession();
  const [currentDate, setCurrentDate] = useQueryState(
    'date',
    parseAsIsoDateTime.withDefault(new Date())
  );

  const { aid, setIsTooltipOpen } = useAppointmentStore();

  const [_viewType, setViewType] = useQueryState('type', parseAsStringEnum(viewTypes));
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const numberOfWeeks = Math.ceil(days.length / 7);

  const getAppointmentsForDay = (date: Date) =>
    appointments.filter((apt) => isSameDay(new Date(apt.appointmentDate ?? ''), date));

  const isAllowedToCreateAppointment = allowedRolesToCreateAppointment.includes(
    user?.role || UserRole.PATIENT
  );

  return (
    <div className="flex h-full flex-col">
      {/* Week header */}
      <div className="grid grid-cols-7">
        {weekDays.map((day) => (
          <div
            key={day}
            className={cn(
              'border-divider text-default-500 text-tiny border-r text-center font-medium uppercase last:border-r-0'
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        className="grid h-full flex-1 grid-cols-7"
        style={{
          gridTemplateRows: `repeat(${numberOfWeeks}, minmax(100px, 1fr))`,
        }}
      >
        {days.map((day) => {
          const dayAppointments = getAppointmentsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const maxAppointmentsToShow =
            dayAppointments.length > MAX_APPOINTMENTS_IN_CELL + 1
              ? MAX_APPOINTMENTS_IN_CELL
              : MAX_APPOINTMENTS_IN_CELL + 1;

          const isDateDisabled = !isSameDay(day, currentDate) && isPast(day);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                'border-divider flex flex-col justify-start overflow-hidden border-r border-b p-1 select-none last:border-r-0',
                {
                  'bg-default-100 text-default-500': !isCurrentMonth,
                  'bg-default-50 cursor-not-allowed': isDateDisabled,
                  'cursor-auto': !isAllowedToCreateAppointment,
                }
              )}
              onClick={(e) => {
                if (!aid) {
                  if (isDateDisabled || !isAllowedToCreateAppointment) {
                    return;
                  }

                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickY = e.clientY - rect.top;
                  const cellHeight = rect.height;

                  const startHour = TIMINGS.appointment.start;
                  const endHour = TIMINGS.appointment.end;
                  const hourRange = endHour - startHour;

                  const clickRatio = Math.max(0, Math.min(1, clickY / cellHeight));
                  const selectedHour = startHour + clickRatio * hourRange;

                  const minutes = Math.round((selectedHour % 1) * 4) * TIMINGS.appointment.interval;
                  const hour = Math.floor(selectedHour);

                  const selectedDateTime = new Date(day);
                  selectedDateTime.setHours(hour, minutes, 0, 0);

                  onTimeSlotClick(selectedDateTime);
                }
              }}
            >
              <DateChip
                date={day}
                onClick={() => {
                  setCurrentDate(day);
                  setViewType('day');
                }}
              />

              <div className="flex flex-col">
                {dayAppointments.slice(0, maxAppointmentsToShow).map((appointment) => (
                  <AppointmentTriggerItem key={appointment.aid} appointment={appointment} />
                ))}
                {dayAppointments.length > maxAppointmentsToShow && (
                  <Tooltip
                    delay={200}
                    content={<AppointmentList appointments={dayAppointments} date={day} />}
                    onOpenChange={setIsTooltipOpen}
                  >
                    <button className="text-tiny hover:bg-default-100 truncate rounded-lg p-1 px-2 text-start">
                      {dayAppointments.length - maxAppointmentsToShow} more
                    </button>
                  </Tooltip>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

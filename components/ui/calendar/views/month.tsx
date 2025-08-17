'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
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
import { views } from '../types';
import AppointmentList from '../ui/appointment-list';
import AppointmentTriggerItem from '../ui/appointment-trigger-item';
import DateChip from '../ui/date-chip';

import { TIMINGS } from '@/lib/config';
import { cn } from '@/lib/utils';
import { useAppointmentStore } from '@/store/appointment';
import { AppointmentType } from '@/types/appointment';

interface MonthViewProps {
  appointments: AppointmentType[];
  onTimeSlotClick: (date: Date) => void;
}

export function MonthView({ appointments, onTimeSlotClick }: MonthViewProps) {
  const { data: session } = useSession();
  const [currentDate, setCurrentDate] = useQueryState(
    'date',
    parseAsIsoDateTime.withDefault(new Date())
  );

  const { appointment, setIsTooltipOpen } = useAppointmentStore();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_view, setView] = useQueryState('view', parseAsStringEnum(views));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const numberOfWeeks = Math.ceil(days.length / 7);

  const getAppointmentsForDay = (date: Date) =>
    appointments.filter((apt) => isSameDay(new Date(apt.date), date));

  const isAllowedToCreateAppointment = allowedRolesToCreateAppointment.includes(
    session?.user?.role || 'patient'
  );

  return (
    <div className="flex h-full flex-col">
      {/* Week header */}
      <div className="grid grid-cols-7">
        {weekDays.map((day) => (
          <div
            key={day}
            className={cn(
              'border-r text-center text-tiny font-medium uppercase text-default-500 last:border-r-0'
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
              title={isDateDisabled ? 'Booking is not allowed in the past' : ''}
              className={cn(
                'flex select-none flex-col justify-start overflow-hidden border-b border-r p-1 last:border-r-0',
                {
                  'bg-default-100 text-default-500': !isCurrentMonth,
                  'cursor-not-allowed bg-default-50': isDateDisabled,
                  'cursor-auto': !isAllowedToCreateAppointment,
                }
              )}
              onClick={(e) => {
                if (!appointment) {
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
                  setView('day');
                }}
              />

              <div className="flex flex-col">
                {dayAppointments.slice(0, maxAppointmentsToShow).map((appointment) => (
                  <AppointmentTriggerItem key={appointment.aid} appointment={appointment} />
                ))}
                {dayAppointments.length > maxAppointmentsToShow && (
                  <Tooltip
                    content={<AppointmentList appointments={dayAppointments} date={day} />}
                    onOpenChange={setIsTooltipOpen}
                  >
                    <button className="truncate rounded-lg p-1 px-2 text-start text-tiny hover:bg-default-100">
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

'use client';

import React, { useEffect, useRef } from 'react';
import { useSession } from '@/libs/providers/session-provider';
import { ScrollShadow, Tooltip } from '@heroui/react';
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isPast,
  isSameDay,
  isToday,
  startOfWeek,
} from 'date-fns';
import { parseAsIsoDateTime, parseAsStringEnum, useQueryState } from 'nuqs';

import { allowedRolesToCreateAppointment, MAX_APPOINTMENTS_IN_CELL } from '../data';
import { views } from '../types';
import AppointmentList from '../ui/appointment-list';
import AppointmentTriggerItem from '../ui/appointment-trigger-item';
import { CurrentHourIndicator } from '../ui/current-hour-indicator';
import DateChip from '../ui/date-chip';

import { TIMINGS } from '@/libs/config';
import { cn } from '@heroui/react';
import { useAppointmentStore } from '@/services/client/appointment/appointment.store';
import { AppointmentType } from '@/services/client/appointment';
import { Role } from '@/services/common/user/user.constants';

interface WeekViewProps {
  appointments: AppointmentType[];
  currentDate: Date;
  onTimeSlotClick: (date: Date) => void;
}

export function WeekView({ appointments, currentDate, onTimeSlotClick }: WeekViewProps) {
  const { user } = useSession();
  const ref = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_currentDate, setCurrentDate] = useQueryState(
    'date',
    parseAsIsoDateTime.withDefault(new Date())
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_view, setView] = useQueryState('view', parseAsStringEnum(views));

  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const isAllowedToCreateAppointment = allowedRolesToCreateAppointment.includes(
    user?.role || Role.PATIENT
  );

  const { aid, setIsTooltipOpen } = useAppointmentStore();
  const displayHours = Array.from(
    { length: TIMINGS.appointment.end - TIMINGS.appointment.start },
    (_, i) => i + TIMINGS.appointment.start
  ); // e.g., 9, 10, ..., 16 (for 9 AM to 5 PM view)

  const getAppointmentsForDayAndHour = (targetDate: Date, targetHour: number) =>
    appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return isSameDay(aptDate, targetDate) && aptDate.getHours() === targetHour;
    });

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, []);

  return (
    <div className="flex h-full flex-col">
      {/* Week header using Grid */}
      <div className="grid grid-cols-[auto_repeat(7,1fr)] border-b border-divider">
        <div className="w-20 shrink-0 border-r" />
        {/* Empty top-left cell */}
        {weekDays.map((day) => (
          <div
            key={`header-${day.toISOString()}`}
            className="flex flex-col items-center border-r border-divider p-2 text-center last:border-r-0"
          >
            <div className="text-default-500 text-small">{format(day, 'EEE')}</div>
            <DateChip
              date={day}
              size="md"
              onClick={() => {
                setView('day');
                setCurrentDate(day);
              }}
            />
          </div>
        ))}
      </div>

      {/* Time grid using Grid */}
      <ScrollShadow hideScrollBar className="flex-1 overflow-auto">
        <div
          className="grid h-full"
          style={{
            gridTemplateColumns: '80px repeat(7, minmax(100px, 1fr))',
            gridTemplateRows: `repeat(${displayHours.length}, minmax(80px, 1fr))`,
          }}
        >
          {displayHours.map((hour, hourIndex) => (
            <React.Fragment key={`hour-${hour}`}>
              {/* Time Label Cell */}
              <div
                className="row-span-1 w-20 shrink-0 border-b border-r border-divider p-2 text-right text-default-500 text-small"
                style={{ gridRowStart: hourIndex + 1, gridColumnStart: 1 }}
              >
                {hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>

              {weekDays.map((day, dayIndex) => {
                const dayAppointments = getAppointmentsForDayAndHour(day, hour);
                const isHourDisabled = isPast(day);
                return (
                  <div
                    key={`cell-${day.toISOString()}-${hour}`}
                    title={isHourDisabled ? 'Cannot create appointments in the past' : ''}
                    className={cn(
                      'relative min-h-[80px] cursor-pointer overflow-hidden border-b border-r border-divider p-1',
                      {
                        'last:border-r-0': dayIndex === weekDays.length - 1,
                        'cursor-not-allowed': isHourDisabled,
                        'cursor-auto': !isAllowedToCreateAppointment,
                      }
                    )}
                    style={{
                      gridRowStart: hourIndex + 1,
                      gridColumnStart: dayIndex + 2,
                    }}
                    onClick={(e) => {
                      if (isHourDisabled || !isAllowedToCreateAppointment) {
                        return;
                      }

                      if (!aid) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickY = e.clientY - rect.top;
                        const cellHeight = rect.height;

                        const clickRatio =
                          cellHeight > 0 ? Math.max(0, Math.min(1, clickY / cellHeight)) : 0;

                        const minutesOffset = Math.round((clickRatio * 60) / 15) * 15;

                        let targetHour = hour;
                        let targetMinutes = minutesOffset;

                        if (targetMinutes >= 60) {
                          targetHour += 1;
                          targetMinutes -= 60;
                        }

                        const clickedDateTime = new Date(day);
                        clickedDateTime.setHours(targetHour, targetMinutes, 0, 0);

                        onTimeSlotClick(clickedDateTime);
                      }
                    }}
                  >
                    {new Date().getHours() === hour && isToday(day) && (
                      <CurrentHourIndicator ref={ref} />
                    )}
                    {dayAppointments.slice(0, MAX_APPOINTMENTS_IN_CELL).map((appointment) => (
                      <AppointmentTriggerItem key={appointment.aid} appointment={appointment} />
                    ))}
                    {/* Optionally, add a "X more" indicator if needed */}
                    {dayAppointments.length > MAX_APPOINTMENTS_IN_CELL && (
                      <Tooltip
                        content={<AppointmentList appointments={dayAppointments} date={day} />}
                        onOpenChange={setIsTooltipOpen}
                      >
                        <button className="truncate rounded-lg p-1 px-2 text-start text-tiny hover:bg-default-100">
                          {dayAppointments.length - MAX_APPOINTMENTS_IN_CELL} more
                        </button>
                      </Tooltip>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </ScrollShadow>
    </div>
  );
}

'use client';

import React, { type MouseEvent, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { ScrollShadow, Tooltip } from '@heroui/react';
import { format, isPast, isSameDay, isToday } from 'date-fns';

import { allowedRolesToCreateAppointment, MAX_APPOINTMENTS_IN_CELL } from '../data';
import AppointmentList from '../ui/appointment-list';
import AppointmentTriggerItem from '../ui/appointment-trigger-item';
import { CurrentHourIndicator } from '../ui/current-hour-indicator';
import DateChip from '../ui/date-chip';

import { TIMINGS } from '@/lib/config'; // Assuming this provides start/end hours
import { cn } from '@/lib/utils';
import { useAppointmentStore } from '@/store/appointment';
import type { AppointmentType } from '@/types/appointment';

interface DayViewProps {
  appointments: AppointmentType[];
  currentDate: Date;
  onTimeSlotClick: (date: Date) => void;
}

export function DayView({ appointments, currentDate, onTimeSlotClick }: DayViewProps) {
  const { data: session } = useSession();
  const ref = useRef<HTMLDivElement>(null);
  const { appointment, setIsTooltipOpen } = useAppointmentStore();

  const isAllowedToCreateAppointment = allowedRolesToCreateAppointment.includes(
    session?.user?.role
  );

  const displayHours = Array.from(
    { length: TIMINGS.appointment.end - TIMINGS.appointment.start },
    (_, i) => i + TIMINGS.appointment.start
  );

  const dayAppointments = appointments.filter((apt) => isSameDay(new Date(apt.date), currentDate));

  const getAppointmentsForHour = (hour: number) =>
    dayAppointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate.getHours() === hour;
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
      {/* Day header */}
      <div className="flex border-b">
        <div className="flex w-20 shrink-0 items-end border-r px-2 pb-1">
          <div className="text-tiny uppercase tracking-wide text-default-500">
            {format(currentDate, 'z')}
          </div>
        </div>
        <div className="flex flex-1 flex-col p-2">
          <div className="text-small uppercase tracking-wide text-default-500">
            {format(currentDate, 'EEEE')}
          </div>
          <DateChip date={currentDate} size="lg" className="self-start" />
        </div>
      </div>

      {/* Time slots using Grid */}
      <ScrollShadow className="flex-1 overflow-auto">
        <div
          className="grid h-full"
          style={{
            gridTemplateColumns: 'auto 1fr', // Time labels, Day content
            gridTemplateRows: `repeat(${displayHours.length}, minmax(80px, auto))`,
          }}
        >
          {displayHours.map((hour, hourIndex) => {
            const appointmentsInHour = getAppointmentsForHour(hour);
            const hourDateTime = new Date(currentDate);
            hourDateTime.setHours(hour, 0, 0, 0);
            const slotEndTime = new Date(currentDate);
            slotEndTime.setHours(hour + 1, 0, 0, 0);
            const isHourDisabled = isPast(slotEndTime);

            return (
              <React.Fragment key={`hour-${hour}`}>
                {/* Time Label Cell */}
                <div
                  className="row-span-1 w-20 shrink-0 border-b border-r p-2 text-right text-small text-default-500"
                  style={{ gridRowStart: hourIndex + 1, gridColumnStart: 1 }}
                >
                  {hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </div>

                {/* Day Content Cell for this Hour */}
                <div
                  title={isHourDisabled ? 'Cannot create appointments in the past' : ''}
                  className={cn('relative min-h-[80px] cursor-pointer border-b p-1', {
                    'cursor-not-allowed': isHourDisabled,
                    'cursor-auto': !isAllowedToCreateAppointment,
                  })}
                  style={{
                    gridRowStart: hourIndex + 1,
                    gridColumnStart: 2,
                  }}
                  onClick={(e: MouseEvent<HTMLDivElement>) => {
                    if (isHourDisabled || !isAllowedToCreateAppointment) {
                      return;
                    }

                    if (!appointment) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickY = e.clientY - rect.top;
                      const cellHeight = rect.height;

                      const clickRatio =
                        cellHeight > 0 ? Math.max(0, Math.min(1, clickY / cellHeight)) : 0;

                      // Calculate minutes offset from the start of the hour, rounded to nearest 15 minutes
                      const minutesOffset = Math.round((clickRatio * 60) / 15) * 15;

                      let targetHour = hour;
                      let targetMinutes = minutesOffset;

                      if (targetMinutes >= 60) {
                        // Handle click at the very end of an hour slot
                        targetHour += 1;
                        targetMinutes = 0;
                      }

                      // Ensure the final time does not exceed the configured end time (e.g., 5 PM / 17:00)
                      if (targetHour >= TIMINGS.appointment.end) {
                        targetHour = TIMINGS.appointment.end;
                        targetMinutes = 0;
                      }

                      const clickedDateTime = new Date(currentDate);
                      clickedDateTime.setHours(targetHour, targetMinutes, 0, 0);
                      onTimeSlotClick(clickedDateTime);
                    }
                  }}
                >
                  {new Date().getHours() === hour && isToday(currentDate) && (
                    <CurrentHourIndicator ref={ref} />
                  )}
                  {appointmentsInHour.slice(0, MAX_APPOINTMENTS_IN_CELL).map((appointment) => (
                    <AppointmentTriggerItem key={appointment.aid} appointment={appointment} />
                  ))}
                  {appointmentsInHour.length > MAX_APPOINTMENTS_IN_CELL && (
                    <Tooltip
                      content={
                        <AppointmentList appointments={appointmentsInHour} date={currentDate} />
                      }
                      onOpenChange={setIsTooltipOpen}
                    >
                      <button className="truncate rounded-lg p-1 px-2 text-start text-tiny hover:bg-default-100">
                        {dayAppointments.length - MAX_APPOINTMENTS_IN_CELL} more
                      </button>
                    </Tooltip>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </ScrollShadow>
    </div>
  );
}

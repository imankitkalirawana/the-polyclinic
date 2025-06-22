'use client';

import { format, isSameDay, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import type { AppointmentType } from '@/types/appointment';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { TIMINGS } from '@/lib/config'; // Assuming this provides start/end hours
import { Appointment, AppointmentList } from './month'; // Assuming Appointment component is in ./month.tsx
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { CurrentHourIndicator } from '../ui/current-hour-indicator';
import DateChip from '../ui/date-chip';

interface DayViewProps {
  appointments: AppointmentType[];
  currentDate: Date;
  onTimeSlotClick: (date: Date) => void; // Updated signature
}

const MAX_APPOINTMENTS_PER_HOUR_DISPLAY = 2; // Or your preferred limit
const POPOVER_DELAY = 200;

export function DayView({
  appointments,
  currentDate,
  onTimeSlotClick,
}: DayViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Display hours based on TIMINGS config
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const displayHours = Array.from(
    { length: TIMINGS.appointment.end - TIMINGS.appointment.start },
    (_, i) => i + TIMINGS.appointment.start
  ); // e.g., 9, 10, ..., 16 (for 9 AM to 5 PM view)

  // Filter appointments for the current day once
  const dayAppointments = appointments.filter((apt) =>
    isSameDay(new Date(apt.date), currentDate)
  );

  // Get all appointments for a specific hour on the current day
  const getAppointmentsForHour = (hour: number) => {
    return dayAppointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate.getHours() === hour;
    });
  };

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
      <div className="flex-1 overflow-auto">
        <div
          className="grid h-full"
          style={{
            gridTemplateColumns: 'auto 1fr', // Time labels, Day content
            gridTemplateRows: `repeat(${displayHours.length}, minmax(80px, auto))`,
          }}
        >
          {displayHours.map((hour, hourIndex) => {
            const appointmentsInHour = getAppointmentsForHour(hour);
            return (
              <>
                {/* Time Label Cell */}
                <div
                  key={`time-${hour}`}
                  className="row-span-1 w-20 shrink-0 border-b border-r p-2 text-right text-small text-default-500"
                  style={{ gridRowStart: hourIndex + 1, gridColumnStart: 1 }}
                >
                  {hour < 12
                    ? `${hour} AM`
                    : hour === 12
                      ? '12 PM'
                      : `${hour - 12} PM`}
                </div>

                {/* Day Content Cell for this Hour */}
                <div
                  key={`cell-${hour}`}
                  className={cn(
                    'relative min-h-[80px] cursor-pointer border-b p-1'
                  )}
                  style={{
                    gridRowStart: hourIndex + 1,
                    gridColumnStart: 2,
                  }}
                  onClick={(e: MouseEvent<HTMLDivElement>) => {
                    if (!isPopoverOpen) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickY = e.clientY - rect.top;
                      const cellHeight = rect.height;

                      const clickRatio =
                        cellHeight > 0
                          ? Math.max(0, Math.min(1, clickY / cellHeight))
                          : 0;

                      // Calculate minutes offset from the start of the hour, rounded to nearest 15 minutes
                      const minutesOffset =
                        Math.round((clickRatio * 60) / 15) * 15;

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
                  {appointmentsInHour
                    .slice(0, MAX_APPOINTMENTS_PER_HOUR_DISPLAY)
                    .map((apt) => (
                      <Appointment
                        appointment={apt}
                        key={apt.aid}
                        popoverPlacement="left"
                        fullWidth={false}
                        onOpenChange={(open) => {
                          if (open) {
                            setIsPopoverOpen(true);
                          } else {
                            setTimeout(() => {
                              setIsPopoverOpen(false);
                            }, POPOVER_DELAY);
                          }
                        }}
                      />
                    ))}
                  {appointmentsInHour.length >
                    MAX_APPOINTMENTS_PER_HOUR_DISPLAY && (
                    <Popover
                      onOpenChange={(open) => {
                        // instantly open the popover but delay by 100ms when closing
                        if (open) {
                          setIsPopoverOpen(true);
                        } else {
                          setTimeout(() => {
                            setIsPopoverOpen(false);
                          }, POPOVER_DELAY);
                        }
                      }}
                    >
                      <PopoverTrigger>
                        <button className="truncate rounded-lg p-1 px-2 text-start text-tiny hover:bg-default-100">
                          {dayAppointments.length -
                            MAX_APPOINTMENTS_PER_HOUR_DISPLAY}{' '}
                          more
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <AppointmentList
                          appointments={appointmentsInHour}
                          date={currentDate}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}

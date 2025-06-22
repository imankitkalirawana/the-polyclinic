'use client';

import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isToday,
} from 'date-fns';
import { cn } from '@/lib/utils';
import type { AppointmentType } from '@/types/appointment';
// Assuming Appointment component is correctly imported from month.tsx or a shared components directory
import { Appointment, AppointmentList } from './month'; // Or adjust path if it's shared
import { TIMINGS } from '@/lib/config'; // Assuming this provides start/end hours
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { useEffect, useRef, useState } from 'react';
import { CurrentHourIndicator } from '../ui/current-hour-indicator';

interface WeekViewProps {
  appointments: AppointmentType[];
  currentDate: Date;
  onTimeSlotClick: (date: Date) => void; // Matches MonthView's onTimeSlotClick signature
}

const MAX_APPOINTMENTS_PER_HOUR_DISPLAY = 2;
const POPOVER_DELAY = 200;

export function WeekView({
  appointments,
  currentDate,
  onTimeSlotClick,
}: WeekViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const displayHours = Array.from(
    { length: TIMINGS.appointment.end - TIMINGS.appointment.start },
    (_, i) => i + TIMINGS.appointment.start
  ); // e.g., 9, 10, ..., 16 (for 9 AM to 5 PM view)

  const getAppointmentsForDayAndHour = (
    targetDate: Date,
    targetHour: number
  ) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return (
        isSameDay(aptDate, targetDate) && aptDate.getHours() === targetHour
      );
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
      {/* Week header using Grid */}
      <div className="grid grid-cols-[auto_repeat(7,1fr)] border-b">
        <div className="w-20 shrink-0 border-r"></div>
        {/* Empty top-left cell */}
        {weekDays.map((day) => (
          <div
            key={`header-${day.toISOString()}`}
            className="border-r p-2 text-center last:border-r-0"
          >
            <div className="text-small text-default-500">
              {format(day, 'EEE')}
            </div>
            <div
              className={cn(
                'mx-auto flex h-8 w-8 items-center justify-center rounded-full text-large font-medium',
                isToday(day) && 'bg-primary text-primary-foreground'
              )}
            >
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid using Grid */}
      <div className="flex-1 overflow-auto">
        <div
          className="grid h-full"
          style={{
            gridTemplateColumns: '80px repeat(7, minmax(100px, 1fr))',
            gridTemplateRows: `repeat(${displayHours.length}, minmax(80px, 1fr))`,
          }}
        >
          {displayHours.map((hour, hourIndex) => (
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

              {/* Day Cells for this Hour */}
              {weekDays.map((day, dayIndex) => {
                const dayAppointments = getAppointmentsForDayAndHour(day, hour);
                return (
                  <div
                    key={`cell-${day.toISOString()}-${hour}`}
                    className={cn(
                      'relative min-h-[80px] cursor-pointer border-b border-r p-1',
                      dayIndex === weekDays.length - 1 && 'last:border-r-0' // Ensure last column has no right border
                    )}
                    style={{
                      gridRowStart: hourIndex + 1,
                      gridColumnStart: dayIndex + 2, // +2 because time label is column 1
                    }}
                    onClick={(e) => {
                      if (!isPopoverOpen) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickY = e.clientY - rect.top;
                        const cellHeight = rect.height;

                        const clickRatio =
                          cellHeight > 0
                            ? Math.max(0, Math.min(1, clickY / cellHeight))
                            : 0;

                        const minutesOffset =
                          Math.round((clickRatio * 60) / 15) * 15;

                        let targetHour = hour;
                        let targetMinutes = minutesOffset;

                        if (targetMinutes >= 60) {
                          targetHour += 1;
                          targetMinutes -= 60;
                        }

                        const clickedDateTime = new Date(day);
                        clickedDateTime.setHours(
                          targetHour,
                          targetMinutes,
                          0,
                          0
                        );

                        onTimeSlotClick(clickedDateTime);
                      }
                    }}
                  >
                    {new Date().getHours() === hour && isToday(day) && (
                      <CurrentHourIndicator ref={ref} />
                    )}
                    {dayAppointments
                      .slice(0, MAX_APPOINTMENTS_PER_HOUR_DISPLAY)
                      .map((apt) => (
                        // Assuming Appointment component handles its own popover and styling
                        <Appointment
                          appointment={apt}
                          key={apt.aid}
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
                    {/* Optionally, add a "X more" indicator if needed */}
                    {dayAppointments.length >
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
                            appointments={dayAppointments}
                            date={day}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

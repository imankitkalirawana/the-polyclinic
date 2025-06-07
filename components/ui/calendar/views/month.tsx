'use client';

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import { cn } from '@/lib/utils';
import { AppointmentType } from '@/models/Appointment';
import { useCalendar } from '../store';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import DateChip from '../ui/date-chip';
import { formatTime } from '../helper';
import StatusDot from '../ui/status-dot';

interface MonthViewProps {
  appointments: AppointmentType[];
  currentDate: Date;
  onTimeSlotClick: (date: Date) => void;
}

const MAX_APPOINTMENTS_PER_DAY = 2;

export function MonthView({
  appointments,
  currentDate,
  onTimeSlotClick,
}: MonthViewProps) {
  const { setView } = useCalendar();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  const numberOfWeeks = Math.ceil(days.length / 7);

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter((apt) => isSameDay(new Date(apt.date), date));
  };

  return (
    <div className="flex h-full flex-col">
      {/* Week header */}
      <div className="grid grid-cols-7">
        {weekDays.map((day) => (
          <div
            key={day}
            className={cn(
              'border-r text-center text-xs font-medium uppercase text-default-500 last:border-r-0'
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
            dayAppointments.length > MAX_APPOINTMENTS_PER_DAY + 1
              ? MAX_APPOINTMENTS_PER_DAY
              : MAX_APPOINTMENTS_PER_DAY + 1;

          return (
            <div
              key={day.toISOString()}
              className={cn(
                'flex flex-col justify-start border-b border-r p-1 last:border-r-0',
                !isCurrentMonth && 'bg-default-100 text-default-500'
              )}
              onClick={() => onTimeSlotClick(day)}
            >
              <DateChip
                date={day}
                onClick={() => setView('day', { date: day })}
              />

              <div>
                {dayAppointments.slice(0, maxAppointmentsToShow).map((apt) => (
                  <Popover showArrow>
                    <PopoverTrigger>
                      <div
                        key={apt.aid}
                        className={cn(
                          'flex cursor-pointer items-center justify-start gap-1 truncate rounded-lg p-1 px-2 text-xs hover:bg-default-100',
                          apt.status === 'cancelled' && 'line-through'
                        )}
                      >
                        <StatusDot status={apt.status} />
                        <span className="font-light">
                          {formatTime(new Date(apt.date))}
                        </span>
                        <span className="font-medium">
                          {apt.patient.name}{' '}
                          {apt.doctor?.name ? `- ${apt.doctor.name}` : ''}
                        </span>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span>{apt.patient.name}</span>
                          <span>{formatTime(new Date(apt.date))}</span>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                ))}
                {dayAppointments.length > maxAppointmentsToShow && (
                  <Popover>
                    <PopoverTrigger>
                      <button className="w-full truncate rounded-lg p-1 px-2 text-start text-xs hover:bg-default-100">
                        {dayAppointments.length - maxAppointmentsToShow} more
                      </button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="flex flex-col gap-2">
                        {dayAppointments
                          .slice(maxAppointmentsToShow)
                          .map((apt) => (
                            <div key={apt._id}>{apt.patient.name}</div>
                          ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

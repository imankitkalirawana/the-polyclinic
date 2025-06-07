'use client';

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { cn } from '@/lib/utils';
import { AppointmentType } from '@/models/Appointment';
import { useCalendar } from '../store';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { chipColorMap } from '@/lib/chip';

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

          return (
            <div
              key={day.toISOString()}
              className={cn(
                'flex flex-col justify-start border-b border-r p-1 last:border-r-0',
                !isCurrentMonth && 'bg-default-100 text-default-500'
              )}
              onClick={() => onTimeSlotClick(day)}
            >
              <button
                className={cn(
                  'mb-1 flex size-6 items-center justify-center self-center rounded-full text-sm font-medium transition-colors hover:bg-default-100',
                  {
                    'bg-primary-500 text-primary-foreground hover:bg-primary-400':
                      isToday(day),
                  }
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setView('day', { date: day });
                }}
              >
                {format(day, 'd')}
              </button>

              <div className="space-y-1">
                {dayAppointments
                  .slice(0, MAX_APPOINTMENTS_PER_DAY)
                  .map((apt) => (
                    <Popover showArrow>
                      <PopoverTrigger>
                        <div
                          key={apt._id}
                          className={cn(
                            'flex cursor-pointer items-center justify-start gap-1 truncate rounded-lg p-1 px-2 text-xs text-white hover:opacity-90',
                            chipColorMap[apt.status].text,
                            apt.status === 'cancelled' && 'line-through'
                          )}
                        >
                          <span className="font-extralight">
                            {format(new Date(apt.date), 'HH:mm')}
                          </span>
                          <span>
                            {apt.patient.name}{' '}
                            {apt.doctor?.name ? `- ${apt.doctor.name}` : ''}
                          </span>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <span>{apt.patient.name}</span>
                            <span>{format(new Date(apt.date), 'HH:mm')}</span>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  ))}
                {dayAppointments.length > MAX_APPOINTMENTS_PER_DAY && (
                  <Popover>
                    <PopoverTrigger>
                      <button className="w-full truncate rounded-lg p-1 px-2 text-start text-xs hover:bg-default-100">
                        {dayAppointments.length - MAX_APPOINTMENTS_PER_DAY} more
                      </button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="flex flex-col gap-2">
                        {dayAppointments
                          .slice(MAX_APPOINTMENTS_PER_DAY)
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

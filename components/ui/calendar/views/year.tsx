'use client';

import {
  format,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
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
import { AppointmentType } from '@/types/appointment';

interface YearViewProps {
  appointments: AppointmentType[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onTimeSlotClick: (date: Date) => void;
}

export function YearView({
  appointments,
  currentDate,
  onDateChange,
  onTimeSlotClick,
}: YearViewProps) {
  const yearStart = startOfYear(currentDate);
  const yearEnd = endOfYear(currentDate);
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter((apt) => isSameDay(new Date(apt.date), date));
  };

  const MonthCalendar = ({ month }: { month: Date }) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <div className="cursor-pointer rounded-lg border-small p-2 transition-shadow hover:shadow-sm">
        <div className="mb-2 text-center text-small font-medium">
          {format(month, 'MMM')}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
            <div
              key={day}
              className="text-muted-foreground p-1 text-center text-tiny"
            >
              {day}
            </div>
          ))}
          {days.map((day) => {
            const dayAppointments = getAppointmentsForDay(day);
            const isCurrentMonth = isSameMonth(day, month);
            const isDayToday = isToday(day);
            const hasAppointments = dayAppointments.length > 0;

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'hover:bg-muted relative cursor-pointer rounded p-1 text-center text-tiny',
                  !isCurrentMonth && 'text-muted-foreground',
                  isDayToday && 'bg-blue-600 text-white hover:bg-blue-700',
                  hasAppointments && !isDayToday && 'bg-blue-100 text-blue-900'
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onTimeSlotClick(day);
                }}
              >
                {format(day, 'd')}
                {hasAppointments && (
                  <div className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full bg-current"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-auto p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {months.map((month) => (
          <div key={month.toISOString()} onClick={() => onDateChange(month)}>
            <MonthCalendar month={month} />
          </div>
        ))}
      </div>
    </div>
  );
}
